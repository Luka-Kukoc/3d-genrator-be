import { Injectable } from '@nestjs/common';
import { LinkScraperService } from 'libs/utils/scrapeLinks';
import { ProductScraperService } from 'libs/utils/scrapeProducts';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import {
  Segmentation,
  Generation,
  SegmentationOutput,
  Dimensions,
  GenerationOutput,
} from 'types';
export const importDynamic = new Function(
  'modulePath',
  'return import(modulePath)',
);

const prisma = new PrismaClient();

@Injectable()
export class AppService {
  private huggingFaceRepo: string;
  private huggingFaceToken: string;

  constructor(
    private configService: ConfigService,
    private readonly linkScraperService: LinkScraperService,
    private readonly productScraperService: ProductScraperService,
  ) {
    this.huggingFaceRepo = this.configService.get<string>('HUGGING_FACE_REPO');
    this.huggingFaceToken =
      this.configService.get<string>('HUGGING_FACE_TOKEN');
  }

  async scrape(url: string): Promise<Array<object>> {
    const productLinks = await this.linkScraperService.scrapeLinks(url);
    const productDetails = await Promise.all(
      productLinks.map((link, index) =>
        this.productScraperService.scrapeProductDetails(link, index + 1),
      ),
    );
    return productDetails;
  }

  async saveProducts(
    products: Array<{
      name: string;
      price: number;
      dimension: string;
      imageUrl: string;
      productLink: string;
    }>,
  ): Promise<string> {
    for (const product of products) {
      const existingProd = await prisma.product.findFirst({
        where: { productLink: product.productLink },
      });
      //provjera da ne kreiramo za iste proizvode ponovo(url je unique)
      if (!existingProd) {
        await prisma.product.create({
          data: {
            ...product,
            object3DLink: '',
          },
        });
      }
    }

    //3d generation

    return 'Success';
  }

  async runSegmentation({
    client,
    handle_file,
    rgbImageUrl,
    dimensions,
  }: Segmentation): Promise<SegmentationOutput> {
    console.log(`Running image segmentation for => ${rgbImageUrl}`);

    const { height, width } = dimensions;
    console.log(`Image dimensions are height:${height} width:${width}`);

    const { data } = await client.predict('/run_segmentation', {
      image_prompts: {
        image: handle_file(rgbImageUrl),
        points: [[1, 1, 2, width, height, 3]],
        url: handle_file(rgbImageUrl),
      },
      polygon_refinement: true,
    });

    const { path, url } = data[0];

    return { segmentedPath: path, segmentedUrl: url };
  }

  async runModelGeneration({
    client,
    handle_file,
    rgbImageUrl,
    segmentedUrl,
    dimensions,
  }: Generation): Promise<GenerationOutput> {
    console.log(
      `Running model generation with segmentation image => ${segmentedUrl}`,
    );
    console.log(`RGB image URL => ${rgbImageUrl}`);

    const { height, width } = dimensions;
    console.log(`Image dimensions are height:${height} width:${width}`);

    const { data } = await client.predict('/run_generation', {
      rgb_image: {
        path: handle_file(rgbImageUrl),
        image: handle_file(rgbImageUrl),
        points: [[1, 1, 2, width, height, 3]],

        url: handle_file(rgbImageUrl),
      },
      seg_image: handle_file(segmentedUrl),
      seed: 0,
      randomize_seed: true,
      num_inference_steps: 50,
      guidance_scale: 7,
      do_image_padding: true,
    });

    const { path, url } = data[0];
    return { path, url };
  }

  async generateModel(
    rgbImageUrl: string,
    dimensions: Dimensions,
  ): Promise<object> {
    //This solves open issue with gradio client import
    //https://github.com/gradio-app/gradio/issues/4260
    const { Client, handle_file } = await importDynamic('@gradio/client');
    try {
      const client = await Client.connect(
        this.huggingFaceRepo,

        {
          hf_token: this.huggingFaceToken,
        },
      );

      const { segmentedPath, segmentedUrl } = await this.runSegmentation({
        client,
        handle_file,
        rgbImageUrl,
        dimensions,
      });

      const generationResult = await this.runModelGeneration({
        client,
        handle_file,
        rgbImageUrl,
        segmentedUrl,
        dimensions,
      });

      return generationResult;
    } catch (error) {
      console.log(error);
    }
  }
  async getProducts(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const products = await prisma.product.findMany({
      skip,
      take: limit,
    });

    const totalProducts = await prisma.product.count();

    return {
      total: totalProducts,
      page,
      limit,
      totalPages: Math.ceil(totalProducts / limit),
      products,
    };
  }
}
