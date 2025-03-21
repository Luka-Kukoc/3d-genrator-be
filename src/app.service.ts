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
      productLinks.map((link) =>
        this.productScraperService.scrapeProductDetails(link),
      ),
    );
    return productDetails;
  }

  saveProducts(): Array<object> {
    return [];
  }
}
