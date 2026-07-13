import type { FactCheckCase } from '../../../domain/types';

export const socialCase: FactCheckCase = {
  id: 'old-well', synthetic: true,
  claimText: '가상 가온마을의 옛 우물은 1998년에 처음 만들어졌다.',
  atoms: [
    { id: 'subject', kind: 'subject', text: '가상 가온마을 옛 우물', checkable: true, required: true },
    { id: 'time', kind: 'time', text: '1998년', checkable: true, required: true },
    { id: 'event', kind: 'event', text: '처음 만들어짐', checkable: true, required: true },
  ],
  initialSourceIds: ['village-map', 'repair-record', 'well-repost', 'postcard'], lateSourceId: 'cover-receipt',
  initialVerdict: 'contradicted', finalVerdict: 'contradicted',
  reasonOptions: [
    { id: 'map-before', label: '1978년 지도에 우물이 이미 표시되어 있어요.', correctAt: ['initial', 'final'] },
    { id: 'repair-not-build', label: '1998년 기록은 건설이 아니라 수리 완료 기록이에요.', correctAt: ['initial', 'final'] },
    { id: 'guess-1978', label: '그러므로 정확한 건설 연도는 1978년이에요.', correctAt: [] },
  ],
  headlineOptions: ['가상 가온마을 옛 우물, 1978년 지도에 이미 표시되고 1998년 수리 완료 기록이 남음', '1998년은 가상 가온마을 옛 우물의 건설 연도가 아니라 수리 완료 기록의 해'],
};
