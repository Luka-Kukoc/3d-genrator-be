// import puppeteer from 'puppeteer';

// export async function scrapeRH(url: string) {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();

//   await page.setUserAgent(
//     'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
//   );

//   await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });

//   const pageContent = await page.content();
//   console.log(pageContent);

//   try {
//     await page.waitForSelector('a[href*="product"]', { timeout: 20000 });

//     const productLinks = await page.evaluate(() =>
//       Array.from(
//         document.querySelectorAll('a[href*="product"]'),
//         (a: any) => a.href,
//       ),
//     );

//     console.log('Extracted Links:', productLinks);
//     return productLinks;
//   } catch (error) {
//     console.error('Error extracting product links:', error);
//   } finally {
//     await browser.close();
//   }
// }
