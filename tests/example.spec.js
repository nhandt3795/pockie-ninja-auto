import { test, expect } from '@playwright/test';
async function clickIfVisible(locator, timeout = 5000) {
  if (await locator.isVisible({timeout: timeout})) {
    await locator.click();
  }
}
test.beforeEach(async ({ page }) => {
  await page.goto('https://pockieninja.online/')
  
})
test.only('slot machine', async ({ page }) => {
  test.setTimeout(0);
  while (true) {
    await page.locator('button.slot-machine__challenge-btn.--default').click({timeout: 200000});
    await page.locator("//b[text()='Combat Results']/ancestor::div[@class='panel--dark']//button[text()='Close']").click({timeout: 200000});
    const notify = page.locator('//pre[contains(text(),"You obtained")]/ancestor::div[@class="panel--dark"]//button[text()="Close"]')
    await clickIfVisible(notify);
    await page.locator("//div[@data-text='Team Stone']/parent::div").click();
    await page.locator('//div[@class="clickable" and text()="Heal"]').click();
    await page.locator("//div[@data-text='Team Stone']/parent::div").click();
    await page.locator('//div[@class="clickable" and text()="Repair All"]').click();
    await page.locator("//div[@class='panel--dark']//button[text()='Accept']").click();
  }
});

test('farm demon', async ({ page }) => {
  const bossName = 'Thunderbore Dragon'
  test.setTimeout(0);
  while (true) {
    await page.locator(`//div[@data-text="${bossName}"]/parent::div`).click({timeout: 200000});
    await page.locator('//pre[text()="Use Demon Proof of Suppression to fight boss?"]/ancestor::div[@class="panel--dark"]//button[text()="Accept"]').click();
    await page.locator("//b[text()='Combat Results']/ancestor::div[@class='panel--dark']//button[text()='Close']").click({timeout: 200000});
  }
});