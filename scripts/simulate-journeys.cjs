// Controlled synthetic traffic for the Kiwi Outdoor teaching store.
// This generates test scenarios, never independent human customers.
const { chromium } = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');

const products = [
  { id: 'P001', slug: 'hiking-bottle', name: 'Hiking Bottle', price: 25 },
  { id: 'P002', slug: 'nz-t-shirt', name: 'NZ T-Shirt', price: 35 },
  { id: 'P003', slug: 'travel-mug', name: 'Travel Mug', price: 29 },
  { id: 'P004', slug: 'tote-bag', name: 'Tote Bag', price: 20 },
  { id: 'P005', slug: 'hoodie', name: 'Hoodie', price: 65 },
];
const output = process.env.SIMULATION_OUTPUT;
if (!output) throw new Error('Set SIMULATION_OUTPUT to an evidence directory.');
const seed = Number(process.env.SIMULATION_SEED);
const batch = process.env.SIMULATION_BATCH;
if (!Number.isInteger(seed) || !batch) throw new Error('Set an integer SIMULATION_SEED and a distinct SIMULATION_BATCH name.');
let state = seed >>> 0;
function random() { state = (Math.imul(1664525, state) + 1013904223) >>> 0; return state / 4294967296; }
function integer(min, max) { return min + Math.floor(random() * (max - min + 1)); }
function shuffled(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) { const j = integer(0, i); [copy[i], copy[j]] = [copy[j], copy[i]]; }
  return copy;
}
const stages = ['view_only', 'cart_exit', 'checkout_exit', 'purchase'];
const scenarios = Array.from({ length: 30 }, (_, i) => {
  const outcome = stages[integer(0, 3)];
  const viewed = shuffled(products).slice(0, integer(1, 5));
  const basket = outcome === 'view_only' ? [] : shuffled(viewed).slice(0, integer(1, Math.min(3, viewed.length))).map(product => ({ ...product, quantity: integer(1, 3) }));
  return { id: `S${String(i + 1).padStart(2, '0')}`, outcome, viewed, basket, expectedValue: basket.reduce((n, p) => n + p.price * p.quantity, 0) };
});
async function save(name, data) { await fs.writeFile(path.join(output, name), JSON.stringify(data, null, 2) + '\n'); }

async function main() {
  await fs.mkdir(output, { recursive: true });
  await save('scenario_plan.json', { seed, batch, source: 'automated synthetic scenarios; no real participants or payments', assignment: 'uniform random stopping stage, shuffled products, quantities 1–3; not an estimate of consumer behaviour', scenarios });
  if (process.argv.includes('--plan-only')) { console.log(JSON.stringify({ planned: scenarios.length, outcomes: stages.map(stage => [stage, scenarios.filter(s => s.outcome === stage).length]) })); return; }
  // Refuse to overwrite evidence or replay a partially executed batch accidentally.
  try { await fs.access(path.join(output, 'results.json')); throw new Error('Existing results.json: choose a new evidence directory after reviewing the previous run.'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];
  try {
    for (const scenario of scenarios) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'en-NZ', timezoneId: 'Pacific/Auckland' });
      const page = await context.newPage();
      const requests = [], responses = [], failures = [];
      function isCollect(url) { return /google-analytics\.com\/g\/collect/.test(url); }
      page.on('request', request => { if (isCollect(request.url())) requests.push({ url: request.url(), body: request.postData() }); });
      page.on('response', response => { if (isCollect(response.url())) responses.push({ status: response.status(), url: response.url() }); });
      page.on('requestfailed', request => { if (isCollect(request.url())) failures.push({ url: request.url(), error: request.failure()?.errorText }); });
      const result = { id: scenario.id, outcome: scenario.outcome, startedAt: new Date().toISOString() };
      try {
        const query = new URLSearchParams({ debug: '0', utm_source: 'simulation', utm_medium: 'test', utm_campaign: batch, scenario: scenario.id });
        await page.goto(`https://kiwi-outdoor.vercel.app/?${query}`, { waitUntil: 'networkidle' });
        for (const product of scenario.viewed) {
          await page.getByRole('link', { name: product.name, exact: true }).click();
          await page.getByRole('heading', { name: product.name, exact: true }).waitFor();
          const line = scenario.basket.find(p => p.id === product.id);
          if (line) {
            for (let quantity = 0; quantity < line.quantity; quantity++) {
              await page.getByRole('button', { name: `Add ${product.name} to cart`, exact: true }).click();
              await page.getByRole('link', { name: /^Cart \(/ }).waitFor();
              // Give the component its next render before incrementing again.
              await page.waitForTimeout(100);
            }
          }
          await page.getByRole('link', { name: 'Shop', exact: true }).click();
        }
        if (scenario.outcome !== 'view_only') {
          await page.getByRole('link', { name: /^Cart \(/ }).click();
          await page.getByRole('link', { name: 'Continue to checkout →', exact: true }).waitFor();
          for (const line of scenario.basket) assert.equal(await page.getByLabel(`${line.name} quantity`, { exact: true }).innerText(), String(line.quantity));
        }
        if (['checkout_exit', 'purchase'].includes(scenario.outcome)) {
          await page.getByRole('link', { name: 'Continue to checkout →', exact: true }).click();
          await page.getByRole('heading', { name: 'Checkout.' }).waitFor();
        }
        if (scenario.outcome === 'purchase') {
          await page.getByRole('checkbox').check();
          await page.getByRole('button', { name: 'Place demo order →', exact: true }).click();
          await page.getByText('DEMO ORDER COMPLETE', { exact: true }).waitFor();
          result.receipt = await page.locator('main').innerText();
          await page.screenshot({ path: path.join(output, `${scenario.id}_receipt.png`), fullPage: true });
        }
        result.finalJourneyUrl = page.url();
        await page.getByRole('link', { name: 'Demo tools', exact: true }).click();
        await page.getByRole('heading', { name: 'Session event log', exact: true }).waitFor();
        result.events = await page.locator('details').evaluateAll(nodes => nodes.map(node => ({ name: node.querySelector('summary code').textContent, params: JSON.parse(node.querySelector('pre').textContent) })));
        const purchases = result.events.filter(event => event.name === 'purchase');
        assert.equal(purchases.length, scenario.outcome === 'purchase' ? 1 : 0);
        assert(result.events.every(event => event.params.simulated_transaction === true));
        assert(result.events.every(event => event.params.debug_mode !== true));
        if (purchases.length) {
          assert.equal(purchases[0].params.value, scenario.expectedValue);
          assert.deepEqual(purchases[0].params.items.map(item => [item.item_id, item.quantity]).sort(), scenario.basket.map(item => [item.id, item.quantity]).sort());
          result.transactionId = purchases[0].params.transaction_id;
        }
        assert.equal(result.events.some(e => e.name === 'begin_checkout'), ['checkout_exit', 'purchase'].includes(scenario.outcome));
        assert.equal(result.events.some(e => e.name === 'add_to_cart'), scenario.outcome !== 'view_only');
        await page.waitForTimeout(1500); // Allow the Google tag transport to finish before closing this context.
        const clientIds = [...new Set(requests.map(r => new URL(r.url).searchParams.get('cid')).filter(Boolean))];
        result.transport = { clientIds, requests, responses, failures };
        assert.equal(clientIds.length, 1, 'Exactly one analytics client ID must be observed per isolated context.');
        assert(!results.some(previous => previous.transport?.clientIds.includes(clientIds[0])), 'Analytics ID must differ across contexts.');
        assert(responses.some(r => r.status >= 200 && r.status < 300), 'No successful Google Analytics collection response.');
        result.status = 'verified';
      } catch (error) {
        result.status = 'failed'; result.error = error.stack; result.transport = { requests, responses, failures };
        await page.screenshot({ path: path.join(output, `${scenario.id}_failure.png`), fullPage: true }).catch(() => {});
      }
      result.completedAt = new Date().toISOString();
      results.push(result);
      await save('results.json', { batch, seed, synthetic: true, results });
      console.log(JSON.stringify({ scenario: result.id, outcome: result.outcome, status: result.status, error: result.error?.split('\n')[0] }));
      await context.close();
      if (result.status === 'failed') throw new Error(`Stopped at ${result.id}; inspect evidence before resuming. No automatic replay.`);
    }
  } finally { await browser.close(); }
  const purchased = results.flatMap(r => r.events.filter(e => e.name === 'purchase'));
  const summary = { batch, seed, synthetic: true, independentHumanParticipants: 0, isolatedBrowserContexts: results.length, uniqueAnalyticsClientIds: new Set(results.flatMap(r => r.transport.clientIds)).size, outcomes: Object.fromEntries(stages.map(stage => [stage, results.filter(r => r.outcome === stage).length])), orders: purchased.length, units: purchased.reduce((n,e) => n + e.params.items.reduce((s,i) => s + i.quantity, 0), 0), simulatedRevenueNZD: purchased.reduce((n,e) => n + e.params.value, 0), transportNote: 'Successful collection responses do not prove inclusion in processed GA4 reports; processing and filters can affect reporting.', interpretation: 'Stopping stages and purchases were assigned by the scenario generator. Funnel proportions and revenue describe this simulation only.' };
  await save('summary.json', summary);
  console.log(JSON.stringify(summary));
}
main().catch(error => { console.error(error); process.exitCode = 1; });
