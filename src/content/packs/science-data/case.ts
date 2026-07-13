import type { FactCheckCase } from '../../../domain/types';

export const scienceCase: FactCheckCase = {
  id: 'seasonal-sun', synthetic: true,
  claimText: '가상 하늘관측소에서는 계절에 따라 태양의 남중 고도가 낮을수록 낮 길이도 짧았고, 12월 낮은 6월의 정확히 절반이었다.',
  atoms: [
    { id: 'subject', kind: 'subject', text: '남중 고도와 낮 길이', checkable: true, required: true },
    { id: 'relation', kind: 'relation', text: '두 값이 함께 변함', checkable: true, required: true },
    { id: 'measure', kind: 'measure', text: '12월은 6월의 정확히 절반', checkable: true, required: true },
  ],
  initialSourceIds: ['sun-table', 'sun-infographic', 'sun-photo', 'sun-other'], lateSourceId: 'sun-december',
  initialVerdict: 'insufficient', finalVerdict: 'partly-confirmed',
  reasonOptions: [
    { id: 'missing-december', label: '처음에는 12월 직접 값이 없어 판단을 보류해요.', correctAt: ['initial'] },
    { id: 'relation-supported', label: '후속 자료에서 두 값의 동반 변화는 확인돼요.', correctAt: ['final'] },
    { id: 'half-contradicted', label: '9시간 38분은 14시간 42분의 정확히 절반이 아니에요.', correctAt: ['final'] },
    { id: 'cause-proved', label: '함께 변했으므로 원인도 증명됐어요.', correctAt: [] },
  ],
  headlineOptions: ['합성 계절 관측에서 남중 고도와 낮 길이는 함께 달라졌지만 12월 낮은 6월의 절반은 아니었다', '남중 고도와 낮 길이는 함께 변했지만 합성 관측의 12월 값은 6월의 정확히 절반이 아니었다'],
};
