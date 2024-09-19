import puppeteer from 'puppeteer';
import { saveCookie } from './utils.js';

//@inteliscraper
//puppeteer

const login = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto('https://x.com/', {
    waitUntil: 'domcontentloaded',
  });
  setTimeout(() => {
    saveCookie(page);
    browser.close();
  }, 30000);
};

login();
