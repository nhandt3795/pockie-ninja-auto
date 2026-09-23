import { test, expect } from '@playwright/test';
import {installBattleSpeedHook, setBattleSpeed, waitForBattleResults} from '../battle-control.js';

async function clickIfVisible(locator, timeout = 5000) {
  if (await locator.isVisible({timeout: timeout})) {
    await locator.click();
  }
}
test.beforeEach(async ({ page }) => {
  test.setTimeout(0);
  await installBattleSpeedHook(page)
  await page.goto('https://s01.pockieninja.online/')
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
  await page.locator("//div[text()='Modified']/parent::div").click({timeout: 200000})
})
test('slot machine', async ({ page }) => {
  test.setTimeout(0)
  while (true) {
    await page.locator('button.slot-machine__challenge-btn.--default').click()
    await setBattleSpeed(page, 2)
    await waitForBattleResults(page)
    await setBattleSpeed(page, 1)
    await page.locator("//b[text()='Combat Results']/ancestor::div[@class='panel--dark']//button[text()='Close']").click()
    const notify = page.locator('//pre[contains(text(),"You obtained")]/ancestor::div[@class="panel--dark"]//button[text()="Close"]')
    await page.waitForTimeout(2000)
    await clickIfVisible(notify)
    await page.locator("div.slot-machine__container > button.slot-machine__close-btn").click()
    await page.locator("//div[@data-text='Team Stone']/parent::div").click()
    await page.locator('//div[@class="clickable" and text()="Heal"]').click()
    await page.locator("//div[@data-text='Team Stone']/parent::div").click()
    await page.locator('//div[@class="clickable" and text()="Repair All"]').click()
    await page.locator("//div[@class='panel--dark']//button[text()='Accept']").click()
    await page.locator("div.slot-machine__icon--dark > button").click()
  }
});

test('farm demon', async ({ page }) => {
  const bossName = process.env.BOSS_NAME
  test.setTimeout(0);
  while (true) {
    await page.locator(`//div[@data-text="${bossName}"]/parent::div`).click({timeout: 200000})
    await page.locator('//pre[text()="Use Demon Proof of Suppression to fight boss?"]/ancestor::div[@class="panel--dark"]//button[text()="Accept"]').click()
    await setBattleSpeed(page, 4)
    await waitForBattleResults(page)
    await setBattleSpeed(page, 1)
    await page.locator("//b[text()='Combat Results']/ancestor::div[@class='panel--dark']//button[text()='Close']").click({timeout: 200000})
    await page.waitForTimeout(2000)
  }
});

test('konoha bountique', async ({ page }) => {
  test.setTimeout(0);
  await page.locator("//div[text()='Max bet']/parent::button[not(contains(@class,'--disabled'))]").waitFor('visible')
  await page.waitForTimeout(10000);
  while (true) {
    await page.locator("//div[text()='Try your luck']/parent::button[not(contains(@class,'--disabled'))]").click({timeout: 200000});
    await page.waitForTimeout(1000)
    await page.locator("//div[text()='Buy Coins']/parent::button[contains(@class,'--default')]").waitFor('visible')
    const freeCoins = page.locator("//div[text()='Free coins']/parent::button[not(contains(@class,'--disabled'))]");
    const claimBonusButton = page.locator("//button[contains(@class,'theme__button--dark') and text()='Claim Bonus']");
    const doubleChance = page.locator("//button[contains(@class,'theme__button--dark') and text()='Double Chance']");
    
    if(await freeCoins.isVisible()) {
      await freeCoins.click();
    }

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
      await page.waitForTimeout(1000);
      await boxes[1].click();
      await page.waitForTimeout(1000);
      await boxes[2].click();
      await page.waitForTimeout(1000);
      await page.locator("//div[text()='Ok']/parent::button[contains(@class,'--default')]").click();
    } 
  }
});

test('Quest kill', async ({ page }) => {
  test.setTimeout(0);
  while (true) {
    await page.locator("//b[text()='Quest Navigation']/ancestor::div[@class='panel--dark']//button[text()='Go' and not(@disabled)]").click({timeout: 200000})
    await setBattleSpeed(page, 4)
    await waitForBattleResults(page)
    await setBattleSpeed(page, 1)
    await page.locator("//b[text()='Combat Results']/ancestor::div[@class='panel--dark']//button[text()='Close']").click({timeout: 200000})
    await page.waitForTimeout(2000)
  }
})

test('Tailed beast', async ({ page }) => {
  test.setTimeout(0);
  const useNecklace = process.env.USE_NECKLACE === 'true';
  await page.locator('#tailed-beast-map-container canvas').waitFor('visible', {timeout: 5000000})
  let currentBeast
  while(true) {
    let position
    await expect(page.locator('input.chat-field')).toHaveValue(/.+/, {timeout: 200000})
    const inputtedBeast = await page.locator('input.chat-field').getAttribute('value')
    if (inputtedBeast !== currentBeast) {
      currentBeast = inputtedBeast
    }
    switch(currentBeast) {
      case '1':
        position = { x: 720, y: 412 }
        break;
      case '2':
        position = { x: 148, y: 245 }
        break;
      case '3':
        position = { x: 800, y: 121 }
        break;
      case '4':
        position = { x: 589, y: 304 }
        break;
      case '5':
        position = { x: 849, y: 307 }
        break;
      case '6':
        position = { x: 380, y: 306 }
        break;
      case '7':
        position = { x: 425, y: 158 }
        break;
      case '8':
        position = { x: 433, y: 424 }
        break;
      case '9':
        position = { x: 143, y: 457 }
        break;
      default:
        console.log('Unknown beast:', currentBeast);
        return;
    }
    await page.locator('#tailed-beast-map-container canvas').click({
    position: position
    });
    if (useNecklace) {
      const availableNecklace = await page.locator("//div[@title='Rampage']/ancestor::div[contains(@class,'theme__big1--dark')]//div[@class='label undefined']").textContent()
      const number = Number(availableNecklace.split('/')[0])
      if (number >= 3) {
        await page.locator("//div[@title='Rampage']/ancestor::div[contains(@class,'theme__big1--dark')]//div[@class='j-checkbox  ' and not(@aria-disabled='true')]").click()
      }
    }
    await page.locator("//div[@title='Rampage']/ancestor::div[contains(@class,'theme__big1--dark')]//button[text()='Fight']").click()
    await setBattleSpeed(page, 4)
    await waitForBattleResults(page)
    await setBattleSpeed(page, 1)
    await page.getByRole('button', { name: 'Close' }).click()
  }
})

test('Valhalla', async ({ page }) => {
  for (let turn = 0; turn < 3; turn++) {
    for (let i = 0; i < 4; i++) {
      await page.locator("//img[contains(@src,'dungeons')]/parent::button[contains(@class,'--default')]").click({timeout: 200000})
      for (let j = 0; j < 5; j++) {
        await page.locator("//img[contains(@src,'dungeons/select')]/parent::div//img[contains(@src,'monsters')]/parent::button[contains(@class,'--default')]").click({timeout: 200000})
        await setBattleSpeed(page, 4)
        await waitForBattleResults(page)
        await setBattleSpeed(page, 1)
        await page.locator("//b[text()='Combat Results']/ancestor::div[@class='panel--dark']//button[text()='Close']").click({timeout: 200000})
      await page.waitForTimeout(3000)
      }
    }
  }
})

test('Las Noches', async ({ page }) => {
  test.setTimeout(0);
  while(true) {
    let currentFloor = (await page.locator("//pre[contains(text(),'Current Floor')]").innerText()).match(/\d+/)[0]
    while (currentFloor <= 170) {
      await page.locator("//button[text()='Continue']").click()
      await setBattleSpeed(page, 2)
      await waitForBattleResults(page)
      await setBattleSpeed(page, 1)
      await page.locator("//b[text()='Combat Results']/ancestor::div[@class='panel--dark']//button[contains(text(),'Close')]").click()
      currentFloor = (await page.locator("//pre[contains(text(),'Current Floor')]").innerText()).match(/\d+/)[0]
    }
  }
})