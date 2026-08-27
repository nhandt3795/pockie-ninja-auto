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
  await newWindow.waitForTimeout(1000)
})
test('slot machine', async ({ page }) => {
  test.setTimeout(0);
  while (true) {
    await page.locator('button.slot-machine__challenge-btn.--default').click({timeout: 200000});
    await page.locator("//b[text()='Combat Results']/ancestor::div[@class='panel--dark']//button[text()='Close']").click({timeout: 200000});
    const notify = page.locator('//pre[contains(text(),"You obtained")]/ancestor::div[@class="panel--dark"]//button[text()="Close"]')
    await page.waitForTimeout(2000)
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
    await page.waitForTimeout(2000)
  }
});

test('konoha bountique', async ({ page }) => {
  test.setTimeout(0);
  while (true) {
    await page.locator("//div[text()='Max bet']/parent::button[not(contains(@class,'--disabled'))]").click({timeout: 200000});
    await page.waitForTimeout(1000)
    await page.locator("//div[text()='Buy Coins']/parent::button[contains(@class,'--default')]").waitFor('visible')
    const claimBonusButton = page.locator("//button[contains(@class,'theme__button--dark') and text()='Claim Bonus']");
    const doubleChance = page.locator("//button[contains(@class,'theme__button--dark') and text()='Double Chance']");
    
    if(await doubleChance.isVisible({timeout: 5000})) {
      await doubleChance.click();
      await page.locator("//div[text()='Claim']/parent::button[contains(@class,'--default')]").click();
      await page.locator("//pre[text()='Are you sure want to claim your collected coins so far?']/ancestor::div[@class='panel--dark']//button[text()='Accept']").click();
      await page.locator("//div[text()='Ok']/parent::button[contains(@class,'--default')]").click();
    }

    if(await claimBonusButton.isVisible({timeout: 5000})) {
      await claimBonusButton.click();
      const boxes = await page.locator("//img[contains(@src,'box_close.png')]/parent::button[not(contains(@class,'--disabled'))]").all();
      await boxes[0].click();
      await page.waitForTimeout(3000);
      await boxes[1].click();
      await page.waitForTimeout(3000);
      await boxes[2].click();
      await page.waitForTimeout(3000);
      await page.locator("//div[text()='Ok']/parent::button[contains(@class,'--default')]").click();
    } 
  }
});

test('konoha bountique try your luck', async ({ page }) => {
  test.setTimeout(0);
  await page.locator("//div[text()='Max bet']/parent::button[not(contains(@class,'--disabled'))]").waitFor('visible')
  await page.waitForTimeout(10000);
  while (true) {
    await page.locator("//div[text()='Try your luck']/parent::button[not(contains(@class,'--disabled'))]").click({timeout: 200000});
    await page.waitForTimeout(1000)
    await page.locator("//div[text()='Buy Coins']/parent::button[contains(@class,'--default')]").waitFor('visible')
    const claimBonusButton = page.locator("//button[contains(@class,'theme__button--dark') and text()='Claim Bonus']");
    const doubleChance = page.locator("//button[contains(@class,'theme__button--dark') and text()='Double Chance']");
    
    if(await doubleChance.isVisible({timeout: 5000})) {
      await doubleChance.click();
      await page.locator("//div[text()='Claim']/parent::button[contains(@class,'--default')]").click();
      await page.locator("//pre[text()='Are you sure want to claim your collected coins so far?']/ancestor::div[@class='panel--dark']//button[text()='Accept']").click();
      await page.locator("//div[text()='Ok']/parent::button[contains(@class,'--default')]").click();
    }

    if(await claimBonusButton.isVisible({timeout: 5000})) {
      await claimBonusButton.click();
      const boxes = await page.locator("//img[contains(@src,'box_close.png')]/parent::button[not(contains(@class,'--disabled'))]").all();
      await boxes[0].click();
      await page.waitForTimeout(3000);
      await boxes[1].click();
      await page.waitForTimeout(3000);
      await boxes[2].click();
      await page.waitForTimeout(3000);
      await page.locator("//div[text()='Ok']/parent::button[contains(@class,'--default')]").click();
    } 
  }
});