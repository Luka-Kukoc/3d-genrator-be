import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import {
  ScrapeDto,
  scrapePostSchema,
  saveProductsSchema,
  generateModelPostSchema,
  GnerateModelDto,
} from 'libs/schemas';
export const importDynamic = new Function(
  'modulePath',
  'return import(modulePath)',
);

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
      name: string;
      price: number;
      dimension: string;
      imageUrl: string;
      productLink: string;
    }>,
  ): Promise<string> {
    return await this.appService.saveProducts(products);
  }

  @Post('/generate-model')
  @ApiBody({ schema: zodToOpenAPI(generateModelPostSchema) })
  async generateModel(
    @Body() { url, dimensions }: GnerateModelDto,
  ): Promise<object> {
    const result = await this.appService.generateModel(url, dimensions);

    return result;
  }
  @Get('/products')
  async getProducts(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return await this.appService.getProducts(pageNumber, limitNumber);
  }
}
