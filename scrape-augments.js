const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Navigating to Mobalytics augments page...');
  await page.goto('https://mobalytics.gg/tft/augments', { waitUntil: 'networkidle', timeout: 60000 });

  // Wait for augment cards to appear
  await page.waitForSelector('img[src*="hextech-augments"]', { timeout: 30000 });

  const augments = await page.evaluate(() => {
    const results = [];

    // Grab all augment cards
    const cards = document.querySelectorAll('[class*="AugmentCard"], [class*="augment-card"], [class*="augment_card"]');

    if (cards.length === 0) {
      // Fallback: find by image pattern
      const imgs = document.querySelectorAll('img[src*="hextech-augments"]');
      imgs.forEach(img => {
        const container = img.closest('[class*="card"], [class*="Card"], article, li, [class*="item"]') || img.parentElement?.parentElement;
        if (!container) return;

        const name = container.querySelector('h2, h3, h4, [class*="name"], [class*="title"]')?.textContent?.trim();
        const desc = container.querySelector('p, [class*="desc"], [class*="text"]')?.textContent?.trim();
        const imageUrl = img.src;

        // Determine tier from image URL or nearby element
        const tierEl = container.querySelector('[class*="tier"], [class*="Tier"]');
        const tierText = tierEl?.textContent?.trim() || '';
        let tier = 'Silver';
        if (tierText.toLowerCase().includes('gold') || imageUrl.toLowerCase().includes('gold')) tier = 'Gold';
        if (tierText.toLowerCase().includes('prismatic') || imageUrl.toLowerCase().includes('prismatic')) tier = 'Prismatic';

        if (name) results.push({ name, tier, desc: desc || '', imageUrl });
      });
    } else {
      cards.forEach(card => {
        const name = card.querySelector('[class*="name"], [class*="title"], h2, h3, h4')?.textContent?.trim();
        const desc = card.querySelector('[class*="desc"], [class*="text"], p')?.textContent?.trim();
        const img = card.querySelector('img');
        const imageUrl = img?.src || '';
        const tierEl = card.querySelector('[class*="tier"], [class*="Tier"]');
        const tierText = tierEl?.textContent?.trim() || '';
        let tier = 'Silver';
        if (tierText.toLowerCase().includes('gold')) tier = 'Gold';
        if (tierText.toLowerCase().includes('prismatic')) tier = 'Prismatic';
        if (name) results.push({ name, tier, desc: desc || '', imageUrl });
      });
    }

    return results;
  });

  console.log(`Found ${augments.length} augments (before dedup)`);

  // Snapshot the DOM for debugging if nothing found
  if (augments.length === 0) {
    const html = await page.content();
    require('fs').writeFileSync('/tmp/mobalytics-debug.html', html);
    console.log('No augments found — saved page HTML to /tmp/mobalytics-debug.html for inspection');
    await browser.close();
    process.exit(1);
  }

  // Print first few for verification
  console.log('Sample:', JSON.stringify(augments.slice(0, 3), null, 2));
  console.log('\nTier breakdown:');
  ['Silver', 'Gold', 'Prismatic'].forEach(t => {
    console.log(`  ${t}: ${augments.filter(a => a.tier === t).length}`);
  });

  require('fs').writeFileSync('/tmp/augments-scraped.json', JSON.stringify(augments, null, 2));
  console.log('\nSaved to /tmp/augments-scraped.json');

  await browser.close();
})();
