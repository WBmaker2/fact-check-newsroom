import { describe, expect, it } from 'vitest';
import { validatePackRegistry } from '../../src/domain/pack-validator';
import type { FactCheckPack } from '../../src/domain/types';

const makePack = (): FactCheckPack => ({
  id: 'sample-pack', subjectLabel: '샘플', shortDescription: '검증용 합성 팩', displayOrder: 1,
  iconToken: 'file', accentToken: 'blue', learningGoals: ['근거를 확인한다.'],
  cases: [{
    id: 'sample-case', claimText: '가상 기관의 합성 주장', synthetic: true,
    atoms: [{ id: 'subject', kind: 'subject', text: '가상 기관', checkable: true, required: true }],
    initialSourceIds: ['s1', 's2', 's3'], lateSourceId: 's5',
    initialVerdict: 'confirmed', finalVerdict: 'confirmed',
    decisionClues: { initial: '핵심 비교', final: '새 자료 비교' },
    decisionHints: { initial: '첫 자료를 다시 보세요.', final: '새 자료를 다시 보세요.' },
    reasonOptions: [{ id: 'r1', label: '직접 자료가 뒷받침해요', correctAt: ['initial', 'final'] }],
    headlineOptions: ['가상 기관의 합성 자료로 확인된 범위'],
  }],
  sources: [1, 2, 3, 4, 5].map((index) => ({
    id: `s${index}`, caseId: 'sample-case', synthetic: true, originId: `o${index}`,
    publisherLabel: '가상 기관', sourceType: '합성 기록', publishedAt: '2026-01-01',
    periodLabel: '2026년 1월', methodSummary: '합성 기록을 확인함', scopeSummary: '가상 대상 한 곳',
    excerpt: '교육을 위해 만든 합성 자료입니다.', accessibleSummary: '합성 자료 요약',
    assessments: { subject: 'supports' },
  })),
});

describe('validatePackRegistry', () => {
  it('accepts a structurally complete synthetic pack', () => {
    expect(validatePackRegistry([makePack()]).errors).toEqual([]);
  });

  it('requires exactly three initial sources and one late source', () => {
    const pack = makePack();
    pack.cases[0].initialSourceIds = ['s1', 's2'];
    expect(validatePackRegistry([pack]).errors).toContain('sample-case: 처음 출처는 3개여야 합니다.');
  });

  it('rejects missing structured assessments', () => {
    const pack = makePack();
    pack.sources[0].assessments = {};
    expect(validatePackRegistry([pack]).errors.some((error) => error.includes('관계 평가가 없습니다'))).toBe(true);
  });

  it('requires one correct reason and a clue for each checkpoint', () => {
    const pack = makePack();
    pack.cases[0].reasonOptions[0].correctAt = ['initial'];
    pack.cases[0].decisionClues.final = '';
    const errors = validatePackRegistry([pack]).errors;
    expect(errors).toContain('sample-case/final: 정답 이유는 정확히 1개여야 합니다.');
    expect(errors).toContain('sample-case/final: 핵심 비교 문장이 필요합니다.');
  });

  it('rejects duplicate ids and external urls', () => {
    const pack = makePack();
    pack.sources[1].id = 's1';
    pack.sources[0].excerpt = 'https://example.com';
    const result = validatePackRegistry([pack]);
    expect(result.errors.some((error) => error.includes('중복'))).toBe(true);
    expect(result.warnings.some((warning) => warning.includes('URL'))).toBe(true);
  });

  it('keeps opinion atoms outside source assessments', () => {
    const pack = makePack();
    pack.cases[0].atoms.push({ id: 'opinion', kind: 'opinion', text: '반가운', checkable: false, required: false });
    expect(validatePackRegistry([pack]).errors).toEqual([]);
  });
});
