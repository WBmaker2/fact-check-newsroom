import { relations, source } from '../../source-factory';

const common = { caseId: 'old-well', scopeSummary: '가상 가온마을 옛 우물', methodSummary: '합성 기록의 작성 목적과 연도를 확인함' };
export const socialSources = [
  source({ ...common, id: 'village-map', originId: 'origin-map', publisherLabel: '가상 가온마을 기록관', sourceType: '1978년 마을 지도', publishedAt: '1978-05-01', periodLabel: '1978년', excerpt: '1978년 지도에 옛 우물의 자리가 이미 그려져 있어요.', assessments: relations({ subject: 'supports', yearEvent: 'contradicts' }) }),
  source({ ...common, id: 'repair-record', originId: 'origin-repair', publisherLabel: '가상 가온마을 관리소', sourceType: '1998년 고친 기록', publishedAt: '1998-08-21', periodLabel: '1998년', excerpt: '“옛 우물 고치기 완료”라고 적혀 있어요.', assessments: relations({ subject: 'supports', yearEvent: 'contradicts' }) }),
  source({ ...common, id: 'well-repost', originId: 'origin-repair', derivedFromId: 'repair-record', publisherLabel: '가상 마을소식', sourceType: '옮겨 적은 글', publishedAt: '2026-03-02', periodLabel: '1998년 기록을 2026년에 옮김', excerpt: '고친 기록을 “1998년에 처음 만들었다”라고 잘못 옮겼어요.', assessments: relations({ subject: 'supports', yearEvent: 'limits' }) }),
  source({ ...common, id: 'postcard', originId: 'origin-postcard', publisherLabel: '가상 주민 수집함', sourceType: '날짜 없는 그림엽서', publishedAt: null, periodLabel: '날짜 표시 없음', methodSummary: '그림을 살펴봄', excerpt: '우물처럼 보이는 그림은 있지만 언제 어디인지 알 수 없어요.', assessments: relations({ subject: 'limits', yearEvent: 'irrelevant' }) }),
  source({ ...common, id: 'cover-receipt', originId: 'origin-receipt', publisherLabel: '가상 철물 기록소', sourceType: '1982년 영수증', publishedAt: '1982-09-14', periodLabel: '1982년', excerpt: '1982년에 옛 우물 덮개를 고친 비용이 적혀 있어요.', assessments: relations({ subject: 'supports', yearEvent: 'contradicts' }) }),
];
