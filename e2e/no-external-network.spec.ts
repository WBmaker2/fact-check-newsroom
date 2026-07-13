import { expect, test } from '@playwright/test';

test('초기 로드에서 외부 출처 요청이 없다', async ({ page }) => {
  const external: string[] = []; page.on('request', (request) => { if (!request.url().startsWith('http://127.0.0.1:4173')) external.push(request.url()); });
  await page.goto('/'); expect(external).toEqual([]);
});

test('브라우저 저장소를 사용하지 않는다', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length, cookies: document.cookie }))).toEqual({ local: 0, session: 0, cookies: '' });
});

test('실제 URL 입력과 파일 업로드가 없다', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('input[type="url"], input[type="file"]')).toHaveCount(0);
});
