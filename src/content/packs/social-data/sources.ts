import { relations, source } from '../../source-factory';

const common = { caseId: 'old-well', scopeSummary: '가상 가온마을 옛 우물', methodSummary: '합성 기록의 작성 목적과 연도를 확인함' };
export const socialSources = [
  source({ ...common, id: 'village-map', originId: 'origin-map', publisherLabel: '가상 가온마을 기록관', sourceType: '1978년 마을 지도', publishedAt: '1978-05-01', periodLabel: '1978년', excerpt: '1978년 마을 지도에 옛 우물 위치가 이미 표시되어 있습니다.', assessments: relations({ subject: 'supports', time: 'contradicts', event: 'contradicts' }) }),
  source({ ...common, id: 'repair-record', originId: 'origin-repair', publisherLabel: '가상 가온마을 관리소', sourceType: '1998년 수리 기록', publishedAt: '1998-08-21', periodLabel: '1998년', excerpt: '“옛 우물 보수 작업 완료”라고 적힌 수리 목적의 기록입니다.', assessments: relations({ subject: 'supports', time: 'supports', event: 'contradicts' }) }),
  source({ ...common, id: 'well-repost', originId: 'origin-repair', derivedFromId: 'repair-record', publisherLabel: '가상 마을소식', sourceType: '2026년 재게시 요약', publishedAt: '2026-03-02', periodLabel: '1998년 기록을 2026년에 요약', excerpt: '수리 완료 기록을 “1998년에 처음 건설”로 잘못 바꾸어 옮겼습니다.', assessments: relations({ subject: 'supports', time: 'limits', event: 'limits' }) }),
  source({ ...common, id: 'postcard', originId: 'origin-postcard', publisherLabel: '가상 주민 수집함', sourceType: '날짜 없는 그림엽서', publishedAt: null, periodLabel: '날짜 표시 없음', methodSummary: '그림엽서의 장면을 관찰함', excerpt: '우물처럼 보이는 그림은 있지만 제작 날짜와 장소 확인이 어렵습니다.', assessments: relations({ subject: 'limits', time: 'irrelevant', event: 'irrelevant' }) }),
  source({ ...common, id: 'cover-receipt', originId: 'origin-receipt', publisherLabel: '가상 철물 기록소', sourceType: '1982년 덮개 영수증', publishedAt: '1982-09-14', periodLabel: '1982년', excerpt: '옛 우물 덮개를 손본 비용이 적혀 있어 1998년보다 앞선 존재를 보여 줍니다.', assessments: relations({ subject: 'supports', time: 'contradicts', event: 'contradicts' }) }),
];
