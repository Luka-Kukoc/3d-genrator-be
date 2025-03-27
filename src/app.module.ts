import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LinkScraperService } from 'libs/utils/scrapeLinks';
import { ProductScraperService } from 'libs/utils/scrapeProducts';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, LinkScraperService, ProductScraperService],
})
export class AppModule {}
