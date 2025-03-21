import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinkScraperService } from 'libs/utils/scrape';
import { ProductScraperService } from 'libs/utils/scrapeProducts';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, LinkScraperService, ProductScraperService],
})
export class AppModule {}
