export async function installBattleSpeedHook(page) {
  await page.addInitScript(() => {
    const previous = globalThis.__PIXI_APP_INIT__;
    globalThis.__inspectionPixiApps = [];
    globalThis.__PIXI_APP_INIT__ = function (app, ...args) {
      globalThis.__inspectionPixiApps.push(app);
      if (previous) previous.call(this, app, ...args);
    };
  });
}

/** Set the active battle's animation multiplier. Use 1 to restore normal speed. */
export async function setBattleSpeed(page, speed = 4) {
  if (!Number.isFinite(speed) || speed <= 0) {
    throw new Error('Battle speed must be a positive finite number.');
  }

  await page.waitForFunction(
    () => globalThis.__inspectionPixiApps?.some(
      app => app.renderer && app.canvas.closest('#fightContainer')
    ),
    undefined
  );

  await page.evaluate(speed => {
    const app = globalThis.__inspectionPixiApps.find(
      app => app.renderer && app.canvas.closest('#fightContainer')
    );
    app.ticker.speed = speed;
  }, speed);
}

export async function waitForBattleResults(page) {
  await page.locator('#fightContainer')
    .getByText('Combat Results', { exact: true })
    .waitFor({ state: 'visible' });
}