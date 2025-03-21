import { Controller, Get, Query } from '@nestjs/common';
import { LinkScraperService } from './scraper.service';
import { ImageScraperService } from './productScraper.service';

@Controller('scraper')
export class ScraperController {
  constructor(
    private readonly linkScraperService: LinkScraperService,
    private readonly imageScraperService: ImageScraperService,
  ) {}

  @Get('products')
  async scrapeProductImages(@Query('url') url: string) {
    const productLinks = await this.linkScraperService.scrapeLinks(url);
    const productDetails = await Promise.all(
      productLinks.map((productUrl) =>
        this.imageScraperService.scrapeProductDetails(productUrl),
      ),
    );

    return productDetails;
  }
}
