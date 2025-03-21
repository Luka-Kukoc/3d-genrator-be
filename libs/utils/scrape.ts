import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class LinkScraperService {
  async scrapeLinks(url: string): Promise<string[]> {
    try {
      const { data } = await axios.get(url);

      const $ = cheerio.load(data);

      const productLinks: string[] = [];
      $(
        '.plp-product-list__products .plp-fragment-wrapper .plp-product__image-link',
      ).each((index, element) => {
        const linkHref = $(element).attr('href');
        if (linkHref) {
          productLinks.push(new URL(linkHref, url).href);
        }
      });

      return productLinks;
    } catch (error) {
      console.error('Error scraping links:', error);
      return [];
    }
  }
}
