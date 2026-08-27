import { test, expect } from '@playwright/test';
async function clickIfVisible(locator, timeout = 5000) {
  if (await locator.isVisible({timeout: timeout})) {
    await locator.click();
  }
}
test.beforeEach(async ({ page }) => {
  await page.goto('https://pockieninja.online/')
  await page.locator("div.button.start-button").click()
  const [newWindow] = await Promise.all([
  page.context().waitForEvent('page'),
  await page.locator("//span[text()='Đăng nhập bằng Google']/ancestor::div[@role='button']").click()
  ]);
  
  await newWindow.locator("input#identifierId").fill(process.env.EMAIL)
  await newWindow.locator("//span[text()='Next']/ancestor::button").click()
  await newWindow.locator("input[name='Passwd']").fill(process.env.PASSWORD)
  await newWindow.locator("//span[text()='Next']/ancestor::button").last().click()
  await newWindow.close()
})
test('slot machine', async ({ page }) => {
  test.setTimeout(0);
  while (true) {
    await page.locator('button.slot-machine__challenge-btn.--default').click({timeout: 200000});
    await page.locator("//b[text()='Combat Results']/ancestor::div[@class='panel--dark']//button[text()='Close']").click({timeout: 200000});
    const notify = page.locator('//pre[contains(text(),"You obtained")]/ancestor::div[@class="panel--dark"]//button[text()="Close"]')
    await clickIfVisible(notify);
    await page.locator("div.slot-machine__container > button.slot-machine__close-btn").click();
    await page.locator("//div[@data-text='Team Stone']/parent::div").click();
    await page.locator('//div[@class="clickable" and text()="Heal"]').click();
    await page.locator("//div[@data-text='Team Stone']/parent::div").click();
    await page.locator('//div[@class="clickable" and text()="Repair All"]').click();
    await page.locator("//div[@class='panel--dark']//button[text()='Accept']").click();
    await page.locator("div.slot-machine__icon--dark > button").click();
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