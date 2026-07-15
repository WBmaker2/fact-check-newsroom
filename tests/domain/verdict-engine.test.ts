import { describe, expect, it } from 'vitest';
import { countIndependentOrigins, evaluateDecision } from '../../src/domain/verdict-engine';
import type { FactCheckCase, SourceCard } from '../../src/domain/types';

const caseFile: FactCheckCase = {
  id: 'case', claimText: '합성 주장', synthetic: true,
  atoms: [
    { id: 'a', kind: 'subject', text: '대상', checkable: true, required: true },
    { id: 'b', kind: 'measure', text: '수치', checkable: true, required: true },
  ],
  initialSourceIds: ['s1', 's2', 's3'], lateSourceId: 's5',
  initialVerdict: 'insufficient', finalVerdict: 'partly-confirmed',
  decisionClues: { initial: '핵심 비교', final: '새 자료 비교' },
  decisionHints: { initial: '표의 조사 대상을 다시 보세요.', final: '새 표를 다시 보세요.' },
  reasonOptions: [{ id: 'r', label: '이유', correctAt: ['initial'] }, { id: 'f', label: '후속 이유', correctAt: ['final'] }],
  headlineOptions: ['정확한 제목'],
};

const sources: SourceCard[] = [
  { id: 's1', caseId: 'case', synthetic: true, originId: 'o1', publisherLabel: '가상 관측소', sourceType: '표', publishedAt: '2026-01-01', periodLabel: '봄~가을', methodSummary: '관측', scopeSummary: '한 장소', excerpt: '합성 표', accessibleSummary: '표 요약', assessments: { a: 'supports', b: 'limits' } },
  { id: 's2', caseId: 'case', synthetic: true, originId: 'o1', derivedFromId: 's1', publisherLabel: '가상 블로그', sourceType: '재게시', publishedAt: '2026-01-02', periodLabel: '봄~가을', methodSummary: '옮김', scopeSummary: '같은 자료', excerpt: '재게시', accessibleSummary: '재게시 요약', assessments: { a: 'supports', b: 'limits' } },
];

describe('verdict engine', () => {
  it('counts a source and its repost as one independent origin', () => {
    expect(countIndependentOrigins(sources)).toBe(1);
  });

  it('matches the configured checkpoint verdict and single reason', () => {
    const result = evaluateDecision({ caseFile, checkpoint: 'initial', sources, relations: { s1: { a: 'supports', b: 'limits' }, s2: { a: 'supports', b: 'limits' } }, selectedSourceIds: ['s1'], inspectedSourceIds: ['s1'], verdict: 'insufficient', reasonIds: ['r'] });
    expect(result.matched).toBe(true);
  });

  it('uses a concrete case hint when the verdict is wrong', () => {
    const result = evaluateDecision({ caseFile, checkpoint: 'initial', sources, relations: { s1: { a: 'supports', b: 'limits' } }, selectedSourceIds: ['s1'], inspectedSourceIds: ['s1'], verdict: 'confirmed', reasonIds: ['r'] });
    expect(result.matched).toBe(false);
    expect(result.feedback).toBe('표의 조사 대상을 다시 보세요.');
  });

  it('rejects an extra misconception reason', () => {
    const result = evaluateDecision({ caseFile, checkpoint: 'initial', sources, relations: { s1: { a: 'supports', b: 'limits' } }, selectedSourceIds: ['s1'], inspectedSourceIds: ['s1'], verdict: 'insufficient', reasonIds: ['r', 'extra'] });
    expect(result.matched).toBe(false);
  });

  it('allows no more than two selected evidence sources', () => {
    const result = evaluateDecision({ caseFile, checkpoint: 'initial', sources, relations: {}, selectedSourceIds: ['s1', 's2', 's3'], inspectedSourceIds: [], verdict: 'insufficient', reasonIds: ['r'] });
    expect(result.matched).toBe(false);
    expect(result.feedback).toContain('1개 또는 2개');
  });

  it('rejects a selected source that does not explain the expected verdict', () => {
    const irrelevant = { ...sources[0], id: 'irrelevant', originId: 'irrelevant-origin', assessments: { a: 'irrelevant' as const, b: 'irrelevant' as const } };
    const result = evaluateDecision({ caseFile, checkpoint: 'initial', sources: [irrelevant], relations: { irrelevant: { a: 'irrelevant', b: 'irrelevant' } }, selectedSourceIds: ['irrelevant'], inspectedSourceIds: ['irrelevant'], verdict: 'insufficient', reasonIds: ['r'] });
    expect(result.matched).toBe(false);
    expect(result.feedback).toContain('직접 도움이 되는 자료');
  });

  it('rejects a selected source whose comparison is incomplete', () => {
    const result = evaluateDecision({ caseFile, checkpoint: 'initial', sources, relations: { s1: { a: 'supports' } }, selectedSourceIds: ['s1'], inspectedSourceIds: ['s1'], verdict: 'insufficient', reasonIds: ['r'] });
    expect(result.matched).toBe(false);
    expect(result.feedback).toContain('다시 비교');
  });
});
