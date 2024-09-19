import puppeteer from 'puppeteer';
import fs from 'fs';
import fsp from 'fs/promises';
import { loadCookie } from './utils.js';

const url = 'https://x.com/MKBHD';
const tweetSel = '[data-testid="tweet"]';
const amount = 20;

const getTweets = async () => {
  const browser = await puppeteer.launch({
    headless: 'shell',
  });

  const page = await browser.newPage();
  await loadCookie(page);
  await page.goto(url, {
    waitUntil: 'networkidle2',
  });

  await page.waitForSelector(tweetSel);
  const data = [];

  for (let i = 0; i < 50 && data.length < amount; i++) {
    console.log(data.length);
    const preLen = await page.$$eval(tweetSel, (els) => els.length);
    await page.keyboard.press('PageDown');

    try {
      await page.waitForFunction(
        `document.querySelectorAll('${tweetSel}').length > ${preLen}`,
        { timeout: 2000 }
      );
    } catch (err) {}

    const chunk = await page.$$eval(tweetSel, (els) =>
      els.map((el) => ({
        text: el
          .querySelector('[data-testid="tweetText"]')
          .textContent.trim()
          .replace(/\n/g, ' '),
        photo: el
          .querySelector('[data-testid="tweetText"]')
          .parentElement.parentElement?.querySelector('img.css-9pa8cd')
          ?.getAttribute('src'),
      }))
    );

    for (const e of chunk) {
      if (data.every((f) => f.text !== e.text)) {
        data.push(e);
      }
    }
  }
  console.log('done');
  const date = new Date();
  const dir = 'tweets';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);

  await fsp.writeFile(
    `${dir}/${date
      .toDateString()
      .replace(/\s/g, '_')
      .toLowerCase()}_${date.getHours()}-${date.getMinutes()}.json`,
    JSON.stringify(data, null, 2)
  );
  browser.close();
};

getTweets();
