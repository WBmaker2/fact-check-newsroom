import type { Page } from '@playwright/test';

export async function openKoreanCase(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: '편집 회의 시작' }).click();
  await page.getByRole('button', { name: /국어·매체 사건 선택/ }).click();
}

export async function openKoreanEvidenceBoard(page: Page) {
  await openKoreanCase(page);
  for (const name of ['어린이 열람실', '6월 첫째 토요일에 연다']) await page.getByRole('button', { name: new RegExp(name) }).click();
  await page.getByRole('button', { name: /자료 살펴보기/ }).click();
  const revealButtons = page.getByRole('button', { name: '네 가지 단서 한눈에 보기' });
  while (await revealButtons.count()) await revealButtons.first().click();
  await page.getByRole('button', { name: /자료와 주장 비교하기/ }).click();
}

export async function openKoreanInitialVerdict(page: Page) {
  await openKoreanEvidenceBoard(page);
  const card = page.locator('.evidence-source').first();
  await card.getByRole('button', { name: /판정 근거로 사용/ }).click();
  for (const row of await card.locator('.relation-row').all()) await row.getByRole('button', { name: '같아요' }).click();
  await page.getByRole('button', { name: /첫 번째 판단하기/ }).click();
}

export async function completeKoreanFlow(page: Page) {
  await openKoreanInitialVerdict(page);
  await page.getByRole('button', { name: /맞아요.*자료로 확인됨/ }).click();
  await page.getByText('도서관 원문에 어린이 열람실과 첫째 토요일이 모두 적혀 있어요.').click();
  await page.getByRole('button', { name: /첫 판단 확인하기/ }).click();
  await page.getByRole('button', { name: '네 가지 단서 한눈에 보기' }).click();
  await page.getByRole('button', { name: /새 자료 비교하기/ }).click();
  await page.getByRole('button', { name: /판정 근거로 사용/ }).click();
  for (const row of await page.locator('.relation-row').all()) await row.getByRole('button', { name: '같아요' }).click();
  await page.getByRole('button', { name: /새 자료로 다시 판단하기/ }).click();
  await page.getByRole('button', { name: /맞아요.*자료로 확인됨/ }).click();
  await page.getByText('도서관 원문에 어린이 열람실과 첫째 토요일이 모두 적혀 있어요.').click();
  await page.getByRole('button', { name: /마지막 판단 확인하기/ }).click();
  await page.locator('.headline-paper button').first().click();
  await page.getByRole('button', { name: /결과 카드 보기/ }).click();
}
