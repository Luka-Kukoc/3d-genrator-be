import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ImageScraperService {
  async scrapeProductDetails(productUrl: string) {
    try {
      const { data } = await axios.get(productUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      });

      const $ = cheerio.load(data);

      let name = $('.pip-header-section__title--big').first().text().trim();
      if (!name) {
        name = 'none';
      }

      let price = $('.pip-price__integer').first().text().trim();
      if (!price) {
        price = 'none';
      }

      let dimensions = $(
        '.pip-link-button.pip-header-section__description-measurement',
      )
        .first()
        .text()
        .trim();
      if (!dimensions) {
        dimensions = 'none';
      }

      let imageUrl = $('.pip-image').first().attr('src');
      if (!imageUrl) {
        imageUrl = 'none';
      }

      return {
        name: name || 'Not found',
        price: price || 'Not found',
        dimensions: dimensions || 'Not found',
        imageUrl: imageUrl || 'Not found',
        productUrl,
      };
    } catch (error) {
      console.error(`Error scraping product details: ${error.message}`);
      return { error: 'Failed to scrape product details' };
    }
  }
}
