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

  const products = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll('.styles_ndsCol__MIQSp.styles_xs__jQ_Rd'),
    ).map((product) => {
      if (
        product.querySelector('a')?.href &&
        product.closest('[data-test="product-grid"]')?.querySelector('img')?.src
      ) {
        return {
          name:
            (product.querySelector('a') as HTMLElement)?.innerText.trim() ||
            'none',
          price: Number(
            product
              .querySelector('[data-test="current-price"]')
              ?.textContent?.trim()
              ?.split('$')[1]
              ?.split(' -')[0] ||
              product
                .querySelector('[data-test="current-price"]')
                ?.textContent?.trim() ||
              0,
          ),
          productLink: product.querySelector('a')?.href,
          dimension: 'none',
          imageUrl:
            product.closest('[data-test="product-grid"]')?.querySelector('img')
              ?.src || null,
        };
      }
    });
  });

  await browser.close();

  return products;
}
