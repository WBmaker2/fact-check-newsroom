import { expect, test, type Page } from '@playwright/test';
import { packRegistry } from '../src/content/registry';
import type { EvidenceRelation, FactCheckPack, Verdict } from '../src/domain/types';

const dimensionLabels = ['누가 만들었나요', '언제 만들었나요', '어떻게 알아봤나요', '누구·어디 이야기인가요'];
const relationLabels: Record<EvidenceRelation, string> = {
  supports: '같아요',
  contradicts: '달라요',
  limits: '일부만 알 수 있어요',
  irrelevant: '관계없어요',
};
const verdictLabels: Record<Verdict, RegExp> = {
  confirmed: /맞아요.*자료로 확인됨/,
  'partly-confirmed': /일부만 맞아요.*일부만 확인됨/,
  contradicted: /아니에요.*자료와 맞지 않음/,
  insufficient: /아직 몰라요.*판단 보류/,
};

async function inspectVisibleSources(page: Page) {
  for (const label of dimensionLabels) {
    for (const button of await page.getByRole('button', { name: new RegExp(label) }).all()) await button.click();
  }
}

async function classifyVisibleSources(page: Page, pack: FactCheckPack, sourceIds: string[]) {
  const caseFile = pack.cases[0];
  const atoms = caseFile.atoms.filter((atom) => atom.checkable);
  const cards = page.locator('.evidence-source');
  for (let sourceIndex = 0; sourceIndex < sourceIds.length; sourceIndex += 1) {
    const source = pack.sources.find((item) => item.id === sourceIds[sourceIndex])!;
    const rows = cards.nth(sourceIndex).locator('.relation-row');
    for (let atomIndex = 0; atomIndex < atoms.length; atomIndex += 1) {
      await rows.nth(atomIndex).getByRole('button', { name: relationLabels[source.assessments[atoms[atomIndex].id]] }).click();
    }
  }
}

async function completePack(page: Page, pack: FactCheckPack) {
  const caseFile = pack.cases[0];
  await page.goto('/');
  await page.getByRole('button', { name: '편집 회의 시작' }).click();
  await page.getByRole('button', { name: new RegExp(`${pack.subjectLabel} 사건 선택`) }).click();
  for (const atom of caseFile.atoms.filter((item) => item.required)) await page.getByRole('button', { name: new RegExp(atom.text) }).click();
  await page.getByRole('button', { name: /자료 살펴보기/ }).click();
  await inspectVisibleSources(page);
  await page.getByRole('button', { name: /자료와 주장 비교하기/ }).click();
  await classifyVisibleSources(page, pack, caseFile.initialSourceIds);
  await page.locator('.evidence-source').first().getByRole('button', { name: /판정 근거로 사용/ }).click();
  await page.getByRole('button', { name: /첫 번째 판단하기/ }).click();
  await page.getByRole('button', { name: verdictLabels[caseFile.initialVerdict] }).click();
  await page.getByText(caseFile.reasonOptions.find((reason) => reason.correctAt.includes('initial'))!.label).click();
  await page.getByRole('button', { name: /첫 판단 확인하기/ }).click();

  await inspectVisibleSources(page);
  await page.getByRole('button', { name: /새 자료 비교하기/ }).click();
  await classifyVisibleSources(page, pack, [caseFile.lateSourceId]);
  await page.getByRole('button', { name: /판정 근거로 사용/ }).click();
  await page.getByRole('button', { name: /새 자료로 다시 판단하기/ }).click();
  await page.getByRole('button', { name: verdictLabels[caseFile.finalVerdict] }).click();
  await page.getByText(caseFile.reasonOptions.find((reason) => reason.correctAt.includes('final'))!.label).click();
  await page.getByRole('button', { name: /마지막 판단 확인하기/ }).click();
  await page.locator('.headline-paper button').first().click();
  await page.getByRole('button', { name: /결과 카드 보기/ }).click();
}

for (const pack of packRegistry) {
  test(`${pack.subjectLabel} 초등 흐름을 처음부터 결과 카드까지 완료한다`, async ({ page }) => {
    await completePack(page, pack);
    await expect(page.getByRole('heading', { name: '팩트체크 결과 카드' })).toBeVisible();
  });
}
