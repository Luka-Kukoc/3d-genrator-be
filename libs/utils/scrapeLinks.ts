import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { scrapeTarget } from './scrapeTargetLinks';
// import { scrapeRH } from './scrapeRhLinks';

@Injectable()
export class LinkScraperService {
  async scrapeLinks(url: string): Promise<string[]> {
    try {
      const { data } = await axios.get(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          Referer: 'https://www.target.com/',
        },
      });

      const $ = cheerio.load(data);

      let productLinks: string[] = [];
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
