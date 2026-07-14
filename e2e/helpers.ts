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
  for (const label of ['누가 만들었나요', '언제 만들었나요', '어떻게 알아봤나요', '누구·어디 이야기인가요']) {
    for (const button of await page.getByRole('button', { name: new RegExp(label) }).all()) await button.click();
  }
  await page.getByRole('button', { name: /자료와 주장 비교하기/ }).click();
}

export async function openKoreanInitialVerdict(page: Page) {
  await openKoreanEvidenceBoard(page);
  const expected = [
    ['같아요', '같아요'],
    ['일부만 알 수 있어요', '일부만 알 수 있어요'],
    ['일부만 알 수 있어요', '관계없어요'],
  ];
  const cards = page.locator('.evidence-source');
  for (let sourceIndex = 0; sourceIndex < 3; sourceIndex += 1) {
    const rows = cards.nth(sourceIndex).locator('.relation-row');
    for (let atomIndex = 0; atomIndex < 2; atomIndex += 1) await rows.nth(atomIndex).getByRole('button', { name: expected[sourceIndex][atomIndex] }).click();
  }
  await cards.nth(0).getByRole('button', { name: /판정 근거로 사용/ }).click();
  await page.getByRole('button', { name: /첫 번째 판단하기/ }).click();
}

export async function completeKoreanFlow(page: Page) {
  await openKoreanInitialVerdict(page);
  await page.getByRole('button', { name: /맞아요.*자료로 확인됨/ }).click();
  await page.getByText('도서관 원문에 어린이 열람실과 첫째 토요일이 모두 적혀 있어요.').click();
  await page.getByRole('button', { name: /첫 판단 확인하기/ }).click();
  for (const label of ['누가 만들었나요', '언제 만들었나요', '어떻게 알아봤나요', '누구·어디 이야기인가요']) await page.getByRole('button', { name: new RegExp(label) }).click();
  await page.getByRole('button', { name: /새 자료 비교하기/ }).click();
  for (const row of await page.locator('.relation-row').all()) await row.getByRole('button', { name: '같아요' }).click();
  await page.getByRole('button', { name: /판정 근거로 사용/ }).click();
  await page.getByRole('button', { name: /새 자료로 다시 판단하기/ }).click();
  await page.getByRole('button', { name: /맞아요.*자료로 확인됨/ }).click();
  await page.getByText('도서관 원문에 어린이 열람실과 첫째 토요일이 모두 적혀 있어요.').click();
  await page.getByRole('button', { name: /마지막 판단 확인하기/ }).click();
  await page.locator('.headline-paper button').first().click();
  await page.getByRole('button', { name: /결과 카드 보기/ }).click();
}
