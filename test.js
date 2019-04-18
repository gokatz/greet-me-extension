const puppeteer = require('puppeteer');
const assert = require('assert');

const extensionPath = 'src';
let extensionPage = null;
let browser = null;

describe('Extension UI Testing', function() {
  this.timeout(20000);
  before(async function() {
    await boot();
  });

  describe('Home Page', async function() {
    it('Greet Message', async function() {
      const inputElement = await extensionPage.$('[data-test-input]');
      assert.ok(inputElement, 'Input is not rendered');
    
      await extensionPage.type('[data-test-input]', 'Gokul Kathirvel');
      await extensionPage.click('[data-test-greet-button]');
    
      const greetMessage  = await extensionPage.$eval('#greetMsg', element => element.textContent)
      assert.equal(greetMessage, 'Hello, Gokul Kathirvel!', 'Greeting message is not shown');
    })
  });

  after(async function() {
    await browser.close();
  });
});

async function boot() {
  browser = await puppeteer.launch({
    headless: false, // extension are allowed only in head-full mode
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`
    ]
  });

  const page = await browser.newPage();
  await page.waitFor(2000); // arbitrary wait time.

  const targets = await browser.targets();
  const extensionTarget = targets.find(({ _targetInfo }) => {
    return _targetInfo.title === 'GreetMe';
  });

  const extensionUrl = extensionTarget._targetInfo.url || '';
  const [,, extensionID] = extensionUrl.split('/');
  const extensionPopupHtml = 'index.html'

  extensionPage = await browser.newPage();
  await extensionPage.goto(`chrome-extension://${extensionID}/${extensionPopupHtml}`);
}
