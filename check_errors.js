const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  
  await new Promise(r => setTimeout(r, 5000));
  
  const scripts = await page.$$eval('script', scripts => scripts.map(s => s.src || s.innerHTML.substring(0, 50)));
  const iframes = await page.$$eval('iframe', iframes => iframes.map(f => f.src || 'inline-iframe'));
  const adBoxes = await page.$$eval('.ad-box', boxes => boxes.length);

  console.log('ADSTERRA SCRIPTS:', scripts.filter(s => s.includes('profitable') || s.includes('highperformance')));
  console.log('IFRAMES:', iframes);
  console.log('AD BOXES COUNT:', adBoxes);
  
  await browser.close();
})();
