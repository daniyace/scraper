import fs from 'fs/promises';

export const saveCookie = async (page) => {
  const cookies = await page.cookies();
  const cookieJson = JSON.stringify(cookies, null, 2);
  await fs.writeFile('cookies.json', cookieJson);
};

export const loadCookie = async (page) => {
  const cookieJson = await fs.readFile('cookies.json');
  const cookies = JSON.parse(cookieJson);
  await page.setCookie(...cookies);
};
