import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { ScrapeDto, scrapePostSchema, saveProductsSchema } from 'libs/schemas';

@ApiTags('Service')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/scrape')
  @ApiBody({ schema: zodToOpenAPI(scrapePostSchema) })
  async scrape(@Body() categoryUrl: ScrapeDto): Promise<Array<object>> {
    return await this.appService.scrape(categoryUrl.url);
  }

  @Post('/save-products')
  @ApiBody({ schema: zodToOpenAPI(saveProductsSchema) })
  async saveProducts(
    @Body()
    products: Array<{
      id: number;
      name: string;
      price: string;
      dimensions: string;
      imageUrl: string;
      productUrl: string;
    }>,
  ): Promise<Array<object>> {
    return await this.appService.saveProducts(products);
  }
}
