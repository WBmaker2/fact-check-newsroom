import type { Page } from '@playwright/test';

export async function openKoreanCase(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: '편집 회의 시작' }).click();
  await page.getByRole('button', { name: /국어·매체 사건 선택/ }).click();
}

export async function completeKoreanFlow(page: Page) {
  await openKoreanCase(page);
  for (const name of ['어린이 열람실', '2026년 6월 첫째 토요일', '운영할 예정']) await page.getByRole('button', { name: new RegExp(name) }).click();
  await page.getByRole('button', { name: /출처 데스크 열기/ }).click();
  for (const label of ['작성 주체 확인', '날짜 확인', '방법 확인', '범위 확인']) {
    for (const button of await page.getByRole('button', { name: new RegExp(label) }).all()) await button.click();
  }
  await page.getByRole('button', { name: /이 자료로 근거 분류하기/ }).click();
  const expected = [
    ['주장을 지지해요', '주장을 지지해요', '주장을 지지해요'],
    ['말할 수 있는 범위를 줄여요', '말할 수 있는 범위를 줄여요', '주장을 지지해요'],
    ['주장을 지지해요', '이 주장과는 관련이 적어요', '이 주장과는 관련이 적어요'],
    ['말할 수 있는 범위를 줄여요', '이 주장과는 관련이 적어요', '이 주장과는 관련이 적어요'],
  ];
  const cards = page.locator('.evidence-source');
  for (let sourceIndex = 0; sourceIndex < 4; sourceIndex += 1) {
    const rows = cards.nth(sourceIndex).locator('.relation-row');
    for (let atomIndex = 0; atomIndex < 3; atomIndex += 1) await rows.nth(atomIndex).getByRole('button', { name: expected[sourceIndex][atomIndex] }).click();
  }
  await cards.nth(0).getByRole('button', { name: /판정 근거로 사용/ }).click();
  await page.getByRole('button', { name: /이 근거로 첫 판정하기/ }).click();
  await page.getByRole('button', { name: '자료로 확인됨' }).click();
  await page.getByText('원문 안내의 대상·날짜·예정 상태가 주장과 일치해요.').click();
  await page.getByText('“반가운”은 의견이라 사실 판정에서 제외했어요.').click();
  await page.getByRole('button', { name: /첫 판정 확정하기/ }).click();
  for (const label of ['작성 주체 확인', '날짜 확인', '방법 확인', '범위 확인']) await page.getByRole('button', { name: new RegExp(label) }).click();
  await page.getByRole('button', { name: /새 자료의 근거 관계 보기/ }).click();
  for (const row of await page.locator('.relation-row').all()) await row.getByRole('button', { name: '주장을 지지해요' }).click();
  await page.getByRole('button', { name: /새 자료를 반영해 다시 판단하기/ }).click();
  await page.getByRole('button', { name: '자료로 확인됨' }).click();
  await page.getByText('원문 안내의 대상·날짜·예정 상태가 주장과 일치해요.').click();
  await page.getByText('“반가운”은 의견이라 사실 판정에서 제외했어요.').click();
  await page.getByRole('button', { name: /최종 판정 확정하기/ }).click();
  await page.locator('.headline-paper button').first().click();
  await page.getByRole('button', { name: /결과 카드 완성하기/ }).click();
}
