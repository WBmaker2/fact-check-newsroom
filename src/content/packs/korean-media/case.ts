import type { FactCheckCase } from '../../../domain/types';

export const koreanCase: FactCheckCase = {
  id: 'library-saturday', synthetic: true,
  claimText: '반가운 소식! 가상 별빛도서관 안내에 따르면 2026년 6월 첫째 토요일에 어린이 열람실을 운영할 예정이다.',
  atoms: [
    { id: 'opinion', kind: 'opinion', text: '반가운 소식', checkable: false, required: false },
    { id: 'target', kind: 'subject', text: '어린이 열람실', checkable: true, required: true },
    { id: 'time', kind: 'time', text: '2026년 6월 첫째 토요일', checkable: true, required: true },
    { id: 'event', kind: 'event', text: '운영할 예정', checkable: true, required: true },
  ],
  initialSourceIds: ['library-notice', 'library-repost', 'library-old', 'library-opinion'], lateSourceId: 'library-maintenance',
  initialVerdict: 'confirmed', finalVerdict: 'confirmed',
  reasonOptions: [
    { id: 'original-matches', label: '원문 안내의 대상·날짜·예정 상태가 주장과 일치해요.', correctAt: ['initial', 'final'] },
    { id: 'opinion-excluded', label: '“반가운”은 의견이라 사실 판정에서 제외했어요.', correctAt: ['initial', 'final'] },
    { id: 'more-is-better', label: '자료 카드가 많으면 주장이 언제나 맞아요.', correctAt: [] },
  ],
  headlineOptions: [
    '가상 별빛도서관 안내: 어린이 열람실, 2026년 6월 첫째 토요일 운영 예정',
    '2026년 6월 첫째 토요일, 가상 별빛도서관 어린이 열람실 운영 예정',
  ],
};
