import type { FactCheckCase } from '../../../domain/types';

export const koreanCase: FactCheckCase = {
  id: 'library-saturday', synthetic: true,
  claimText: '좋은 소식! 가상 별빛도서관은 2026년 6월 첫째 토요일에 어린이 열람실을 연다.',
  atoms: [
    { id: 'opinion', kind: 'opinion', text: '좋은 소식', checkable: false, required: false },
    { id: 'target', kind: 'subject', text: '어린이 열람실', checkable: true, required: true },
    { id: 'schedule', kind: 'time', text: '6월 첫째 토요일에 연다', checkable: true, required: true },
  ],
  initialSourceIds: ['library-notice', 'library-repost', 'library-opinion'], lateSourceId: 'library-maintenance',
  initialVerdict: 'confirmed', finalVerdict: 'confirmed',
  decisionClues: {
    initial: '도서관 원문에는 어린이 열람실을 6월 첫째 토요일에 연다고 적혀 있어요.',
    final: '새 정비 안내에도 어린이 열람실은 원래 안내대로 연다고 적혀 있어요.',
  },
  decisionHints: {
    initial: '‘가상 별빛도서관 원문 운영 안내’에서 장소와 날짜를 다시 찾아보세요.',
    final: '새 정비 안내에서 어느 열람실을 고치는지 다시 읽어보세요.',
  },
  reasonOptions: [
    { id: 'original-matches', label: '도서관 원문에 어린이 열람실과 첫째 토요일이 모두 적혀 있어요.', correctAt: ['initial', 'final'] },
    { id: 'more-is-better', label: '같은 내용이 여러 번 올라오면 언제나 맞아요.', correctAt: [] },
  ],
  headlineOptions: [
    '가상 별빛도서관, 6월 첫째 토요일에 어린이 열람실 운영',
    '6월 첫째 토요일, 가상 별빛도서관 어린이 열람실 문 열어',
  ],
};
