import { expect, test } from '@playwright/test';
import { completeKoreanFlow, openKoreanCase, openKoreanEvidenceBoard } from './helpers';

test('시작 화면은 가상 자료와 개인정보 비수집 원칙을 알린다', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '팩트체크 편집국' })).toBeVisible();
  await expect(page.getByText(/이름을 묻거나 활동을 저장하지 않습니다/)).toBeVisible();
});

test('네 교과 데스크를 동적으로 보여 준다', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: '편집 회의 시작' }).click();
  await expect(page.getByRole('button', { name: /사건 선택/ })).toHaveCount(4);
});

test('의견 조각은 진위 선택에서 제외한다', async ({ page }) => {
  await openKoreanCase(page);
  await expect(page.getByRole('button', { name: /반가운 소식/ })).toBeDisabled();
});

test('출처 렌즈를 확인하기 전에는 근거 분류로 갈 수 없다', async ({ page }) => {
  await openKoreanCase(page);
  for (const name of ['어린이 열람실', '2026년 6월 첫째 토요일', '운영할 예정']) await page.getByRole('button', { name: new RegExp(name) }).click();
  await page.getByRole('button', { name: /출처 데스크 열기/ }).click();
  await expect(page.getByRole('button', { name: /이 자료로 근거 분류하기/ })).toBeDisabled();
});

test('재게시 자료는 같은 원자료임을 표시한다', async ({ page }) => {
  await openKoreanCase(page);
  for (const name of ['어린이 열람실', '2026년 6월 첫째 토요일', '운영할 예정']) await page.getByRole('button', { name: new RegExp(name) }).click();
  await page.getByRole('button', { name: /출처 데스크 열기/ }).click();
  await expect(page.getByText(/같은 원자료를 옮긴 자료/)).toBeVisible();
});

test('근거 분류에서 각 자료 내용을 다시 보여 준다', async ({ page }) => {
  await openKoreanEvidenceBoard(page);
  await expect(page.getByText('자료 내용 다시 보기')).toHaveCount(4);
  await expect(page.getByText('첫째·셋째 토요일 10:00~14:00에 어린이 열람실을 운영할 예정입니다.')).toBeVisible();
});

test('국어 사건 전체 흐름에서 첫 판정과 최종 판정을 보존한다', async ({ page }) => {
  await completeKoreanFlow(page);
  await expect(page.getByRole('heading', { name: '팩트체크 결과 카드' })).toBeVisible();
  await expect(page.getByText('자료로 확인됨')).toHaveCount(2);
});

test('결과 카드는 읽기 전용이고 게시·공유 기능이 없다', async ({ page }) => {
  await completeKoreanFlow(page);
  await expect(page.getByRole('button', { name: /게시|공유|저장/ })).toHaveCount(0);
  await expect(page.getByText(/읽기 전용/)).toBeVisible();
});

test('결과 카드에는 고유 원자료만 인용한다', async ({ page }) => {
  await completeKoreanFlow(page);
  await expect(page.getByRole('heading', { name: '판정에 사용한 고유 원자료' })).toBeVisible();
  await expect(page.locator('.citations li')).toHaveCount(1);
});
