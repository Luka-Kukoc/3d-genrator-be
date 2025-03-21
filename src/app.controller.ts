import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { ScrapeDto, scrapePostSchema } from 'libs/schemas';

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
  saveProducts(): Array<object> {
    return this.appService.saveProducts();
  }
}
