import puppeteer from 'puppeteer';

export async function scrapeTarget(url: string) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
  );

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  await page.waitForSelector('[data-test="product-grid"] a[href*="/p/"]', {
    timeout: 30000,
  });

  const productLinks = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll('[data-test="product-grid"] a[href*="/p/"]'),
    ).map((a: any) => a.href);
  });

  await browser.close();

  return productLinks;
}
