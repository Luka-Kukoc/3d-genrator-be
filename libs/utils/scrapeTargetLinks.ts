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
    const seenLinks = new Set();

    return Array.from(
      document.querySelectorAll('.styles_ndsCol__MIQSp.styles_xs__jQ_Rd'),
    )
      .map((product, index) => {
        const linkElement = product.querySelector('a[href*="/p/"]');
        const imageElement = product.querySelector('picture img');

        if (!linkElement || !imageElement) return null;

        let productLink = linkElement.getAttribute('href');
        if (!productLink) return null;
        productLink = productLink.startsWith('http')
          ? productLink
          : 'https://www.target.com' + productLink;

        if (seenLinks.has(productLink)) return null;
        seenLinks.add(productLink);

        let imageUrl = imageElement.getAttribute('src');
        if (!imageUrl) {
          const srcset = imageElement.getAttribute('srcset');
          if (srcset) {
            const srcsetArray = srcset
              .split(',')
              .map((s) => s.trim().split(' ')[0]);
            imageUrl = srcsetArray[srcsetArray.length - 1];
          }
        }

        return {
          id: index,
          name:
            (product.querySelector('.styles_ndsTruncate__GRSDE') as HTMLElement)
              ?.title || 'none',
          price: Number(
            product
              .querySelector('[data-test="current-price"]')
              ?.textContent?.trim()
              ?.replace(/[^0-9.]/g, '') || 0,
          ),
          productLink: 'www.target.com' + productLink,
          dimension: 'none',
          imageUrl: imageUrl || null,
        };
      })
      .filter((product) => product !== null);
  });

  await browser.close();

  return products;
}
