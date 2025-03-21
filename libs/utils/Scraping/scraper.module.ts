import { Module } from '@nestjs/common';
import { LinkScraperService } from './scraper.service';
import { ImageScraperService } from './productScraper.service';
import { ScraperController } from './scraper.controller';

@Module({
  controllers: [ScraperController],
  providers: [LinkScraperService, ImageScraperService],
})
export class ScraperModule {}
