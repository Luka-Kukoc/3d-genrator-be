import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiParam, ApiBody, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { ScrapeDto, scrapePostSchema, urlSchema } from 'libs/schemas';

@ApiTags('Service')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/scrape')
  @ApiBody({ schema: zodToOpenAPI(scrapePostSchema) })
  @ApiParam({ name: 'url', schema: zodToOpenAPI(urlSchema) })
  scrape(@Body() categoryUrl: ScrapeDto): Array<object> {
    return this.appService.scrape(categoryUrl.url);
  }

  @Post('/save-products')
  saveProducts(): Array<object> {
    return this.appService.saveProducts();
  }
}
