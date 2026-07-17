const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('https://auth.zuup.dev/update-password', { waitUntil: 'networkidle0' });
  
  const formVisible = await page.evaluate(() => {
    const form = document.querySelector('form');
    if (!form) return 'No form found';
    return window.getComputedStyle(form).display !== 'none';
  });
  console.log('Form is visible:', formVisible);
  
  await browser.close();
})();
