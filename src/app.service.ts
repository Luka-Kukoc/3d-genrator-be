import { Injectable } from '@nestjs/common';
import { LinkScraperService } from 'libs/utils/scrapeLinks';
import { ProductScraperService } from 'libs/utils/scrapeProducts';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AppService {
  constructor(
    private readonly linkScraperService: LinkScraperService,
    private readonly productScraperService: ProductScraperService,
  ) {}

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
