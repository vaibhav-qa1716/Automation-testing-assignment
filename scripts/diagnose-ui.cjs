const { chromium } = require('@playwright/test');
const fs = require('node:fs');
(async () => {
  const url = process.env.SAUCEDEMO_BASE_URL || 'https://www.saucedemo.com';
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  const info = { requestedUrl: url, time: new Date().toISOString() };
  try {
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    info.finalUrl = page.url(); info.httpStatus = response?.status(); info.title = await page.title();
    info.usernameFound = await page.getByTestId('username').count();
    info.passwordFound = await page.getByTestId('password').count();
    info.bodyPreview = (await page.locator('body').innerText().catch(() => '')).slice(0, 1000);
  } catch (e) { info.error = String(e); info.finalUrl = page.url(); }
  fs.mkdirSync('diagnostics', { recursive: true });
  await page.screenshot({ path: 'diagnostics/saucedemo-page.png', fullPage: true }).catch(() => {});
  fs.writeFileSync('diagnostics/saucedemo-check.json', JSON.stringify(info, null, 2));
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exitCode = 1; });
