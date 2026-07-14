import type { FactCheckCase } from '../../../domain/types';

export const scienceCase: FactCheckCase = {
  id: 'seasonal-sun', synthetic: true,
  claimText: '가상 하늘관측소에서 12월의 낮은 6월보다 짧고, 길이는 정확히 절반이다.',
  atoms: [
    { id: 'relation', kind: 'relation', text: '12월 낮은 6월보다 짧음', checkable: true, required: true },
    { id: 'measure', kind: 'measure', text: '12월 낮은 6월의 정확히 절반', checkable: true, required: true },
  ],
  initialSourceIds: ['sun-table', 'sun-photo', 'sun-other'], lateSourceId: 'sun-december',
  initialVerdict: 'insufficient', finalVerdict: 'partly-confirmed',
  decisionClues: {
    initial: '처음 표에는 6월 낮 길이만 있고 12월 낮 길이는 없어요.',
    final: '새 표에는 6월 14시간, 12월 10시간이라고 적혀 있어요.',
  },
  decisionHints: {
    initial: '처음 표에서 12월 숫자를 찾을 수 있는지 살펴보세요.',
    final: '14시간의 절반과 10시간이 같은지 계산해 보세요.',
  },
  reasonOptions: [
    { id: 'missing-december', label: '처음 자료에는 12월 낮 길이가 없어요.', correctAt: ['initial'] },
    { id: 'short-not-half', label: '12월 10시간은 6월 14시간보다 짧지만 정확히 절반은 아니에요.', correctAt: ['final'] },
    { id: 'short-means-half', label: '12월 낮이 더 짧으면 언제나 정확히 절반이에요.', correctAt: [] },
  ],
  headlineOptions: ['12월 낮은 6월보다 짧지만 정확히 절반은 아니었다', '가상 관측소 낮 길이: 6월 14시간, 12월 10시간'],
};
