import { Injectable } from '@nestjs/common';
import { LinkScraperService } from 'libs/utils/scrape';
import { ProductScraperService } from 'libs/utils/scrapeProducts';

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
      id: number;
      name: string;
      price: string;
      dimensions: string;
      imageUrl: string;
      productUrl: string;
    }>,
  ): Promise<Array<object>> {
    return products;
  }
}
