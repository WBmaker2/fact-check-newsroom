import { relations, source } from '../../source-factory';

const common = { caseId: 'library-saturday', periodLabel: '2026년 6월', methodSummary: '안내문 내용과 적용 날짜를 직접 확인함' };
export const koreanSources = [
  source({ ...common, id: 'library-notice', originId: 'origin-library-notice', publisherLabel: '가상 별빛도서관', sourceType: '원문 운영 안내', publishedAt: '2026-05-20', scopeSummary: '어린이 열람실, 6월 첫째·셋째 토요일', excerpt: '첫째·셋째 토요일 10:00~14:00에 어린이 열람실을 운영할 예정입니다.', assessments: relations({ target: 'supports', time: 'supports', event: 'supports' }) }),
  source({ ...common, id: 'library-repost', originId: 'origin-library-notice', derivedFromId: 'library-notice', publisherLabel: '가상 마을소식 게시판', sourceType: '재게시 요약', publishedAt: '2026-05-22', scopeSummary: '도서관 전체와 모든 토요일로 범위를 넓힘', excerpt: '6월 토요일마다 도서관을 운영한다고 요약했지만 원문보다 범위가 넓습니다.', assessments: relations({ target: 'limits', time: 'limits', event: 'supports' }) }),
  source({ ...common, id: 'library-old', originId: 'origin-old-notice', publisherLabel: '가상 별빛도서관', sourceType: '지난 겨울 휴실 안내', publishedAt: '2025-12-01', periodLabel: '2025년 12월', scopeSummary: '2025년 겨울 어린이 열람실', excerpt: '지난 겨울 시설 점검 기간의 휴실 안내로 2026년 6월 운영과 시점이 다릅니다.', assessments: relations({ target: 'supports', time: 'irrelevant', event: 'irrelevant' }) }),
  source({ ...common, id: 'library-opinion', originId: 'origin-user-opinion', publisherLabel: '가상 이용자 모임', sourceType: '날짜 없는 이용자 의견', publishedAt: null, periodLabel: '날짜 표시 없음', methodSummary: '이용자 한 명의 경험을 적음', scopeSummary: '이용자 한 명', excerpt: '주말에 열면 좋겠다는 의견이지만 실제 운영 날짜를 확인할 수 없습니다.', assessments: relations({ target: 'limits', time: 'irrelevant', event: 'irrelevant' }) }),
  source({ ...common, id: 'library-maintenance', originId: 'origin-maintenance', publisherLabel: '가상 별빛도서관 시설팀', sourceType: '후속 정비 안내', publishedAt: '2026-05-28', scopeSummary: '첫째 토요일 성인 열람실만 정비', excerpt: '성인 열람실은 정비하지만 어린이 열람실은 안내대로 운영합니다.', assessments: relations({ target: 'supports', time: 'supports', event: 'supports' }) }),
];
