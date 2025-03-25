import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

@Injectable()
export class ProductScraperService {
  async scrapeProductDetails(productUrl: string, index: number) {
    if (productUrl.includes('ikea.com')) {
      return this.scrapeIkeaProduct(productUrl, index);
    } else if (productUrl.includes('target.com')) {
      return this.scrapeTargetProduct(productUrl, index);
    } else {
      console.error(`Unsupported website: ${productUrl}`);
      return { error: 'Unsupported website' };
    }
  }

  private async scrapeIkeaProduct(productLink: string, index: number) {
    try {
      const { data } = await axios.get(productLink, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        },
      });

      const $ = cheerio.load(data);

      let name = $('.pip-header-section__title--big').first().text().trim();
      if (!name) name = 'none';

      let price = Number($('.pip-price__integer').first().text().trim());
      if (!price) price = 0;

      let dimension = $(
        '.pip-link-button.pip-header-section__description-measurement',
      )
        .first()
        .text()
        .trim();
      if (!dimension) dimension = 'none';

      let imageUrl = $('.pip-image').first().attr('src');
      if (!imageUrl) imageUrl = 'none';

      return {
        id: index,
        name,
        price,
        dimension,
        imageUrl,
        productLink,
      };
    } catch (error) {
      console.error(`Error scraping IKEA product: ${error.message}`);
      return { error: 'Failed to scrape product details' };
    }
  }

  private async scrapeTargetProduct(productUrl: string, index: number) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');

    try {
      console.log(`Navigating to Target product page: ${productUrl}`);
      await page.goto(productUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });

      await page.waitForSelector('[data-test="product-title"]', {
        timeout: 20000,
      });

      let name = await page.evaluate(() => {
        const titleEl = document.querySelector('[data-test="product-title"]');
        return titleEl ? titleEl.textContent?.trim() : 'none';
      });

      let price = await page.evaluate(() => {
        const priceEl = document.querySelector('[data-test="product-price"]');
        return priceEl ? priceEl.textContent?.trim() : 'none';
      });

      let dimensions = await page.evaluate(() => {
        const descEl = document.querySelector(
          '[data-test="item-details-description"]',
        );
        return descEl ? descEl.textContent?.trim() : 'none';
      });

      let imageUrl = await page.evaluate(() => {
        const imgEl = document.querySelector('img[alt][src]');
        return imgEl ? (imgEl as HTMLImageElement).src : 'none';
      });

      await browser.close();

      console.log(`Scraped Target Product: ${name}, ${price}, ${imageUrl}`);
      return {
        id: index,
        name,
        price,
        dimensions,
        imageUrl,
        productUrl,
      };
    } catch (error) {
      console.error(`Error scraping Target product: ${error.message}`);
      await browser.close();
      return { error: 'Failed to scrape product details' };
    }
  }
}
