import { expect, test } from '@playwright/test';

for (const viewport of [{ width: 320, height: 568 }, { width: 375, height: 812 }, { width: 768, height: 1024 }]) {
  test(`${viewport.width}px에서 가로 스크롤이 없다`, async ({ page }) => {
    await page.setViewportSize(viewport); await page.goto('/');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(overflow).toBe(false);
  });
}

test('업데이트 내역은 Escape로 닫고 호출 버튼으로 초점을 돌린다', async ({ page }) => {
  await page.goto('/'); const trigger = page.getByRole('button', { name: '업데이트 내역' }); await trigger.click();
  await expect(page.getByRole('dialog', { name: '업데이트 내역' })).toBeVisible(); await page.keyboard.press('Escape'); await expect(trigger).toBeFocused();
});

test('핵심 버튼 터치 영역은 44px 이상이다', async ({ page }) => {
  await page.goto('/');
  const sizes = await page.locator('button').evaluateAll((buttons) => buttons.map((button) => button.getBoundingClientRect().height));
  expect(sizes.every((height) => height >= 44)).toBe(true);
});

test('감소된 움직임에서도 시작 동작이 가능하다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.goto('/'); await page.getByRole('button', { name: '편집 회의 시작' }).click();
  await expect(page.getByRole('heading', { name: '어느 사건부터 살펴볼까요?' })).toBeVisible();
});

test('모바일 단계 표시는 내부 가로 스크롤 없이 현재 단계를 보여 준다', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  await page.getByRole('button', { name: '편집 회의 시작' }).click();
  await page.getByRole('button', { name: /국어·매체 사건 선택/ }).click();
  await expect(page.getByText('1/5')).toBeVisible();
  const overflow = await page.locator('.step-progress').evaluate((element) => element.scrollWidth > element.clientWidth);
  expect(overflow).toBe(false);
});
