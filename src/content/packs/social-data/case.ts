import type { FactCheckCase } from '../../../domain/types';

export const socialCase: FactCheckCase = {
  id: 'old-well', synthetic: true,
  claimText: '가상 가온마을의 옛 우물은 1998년에 처음 만들어졌다.',
  atoms: [
    { id: 'subject', kind: 'subject', text: '가상 가온마을 옛 우물', checkable: true, required: true },
    { id: 'yearEvent', kind: 'event', text: '1998년에 처음 만들어짐', checkable: true, required: true },
  ],
  initialSourceIds: ['village-map', 'repair-record', 'well-repost'], lateSourceId: 'cover-receipt',
  initialVerdict: 'contradicted', finalVerdict: 'contradicted',
  decisionClues: {
    initial: '1978년 지도에 이미 우물이 있고, 1998년 기록에는 ‘고침’이라고 적혀 있어요.',
    final: '새로 나온 1982년 영수증에도 우물 덮개를 고쳤다고 적혀 있어요.',
  },
  decisionHints: {
    initial: '‘처음 만듦’과 ‘고침’은 다른 뜻이에요. 1998년 기록을 다시 읽어보세요.',
    final: '1982년에도 우물이 있었다면 1998년에 처음 만들 수 있는지 생각해 보세요.',
  },
  reasonOptions: [
    { id: 'already-there', label: '1978년 지도에 우물이 있고, 1998년 기록은 새로 만든 기록이 아니라 고친 기록이에요.', correctAt: ['initial', 'final'] },
    { id: 'guess-1978', label: '지도에 1978년이 적혀 있으니 그해 처음 만들었어요.', correctAt: [] },
  ],
  headlineOptions: ['가온마을 옛 우물, 1978년 지도에 이미 표시', '1998년 기록은 옛 우물을 새로 만든 기록이 아니라 고친 기록'],
};
