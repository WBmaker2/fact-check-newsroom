import { relations, source } from '../../source-factory';

const common = { caseId: 'library-saturday', periodLabel: '2026년 6월', methodSummary: '안내문 내용과 적용 날짜를 직접 확인함' };
export const koreanSources = [
  source({ ...common, id: 'library-notice', originId: 'origin-library-notice', publisherLabel: '가상 별빛도서관', sourceType: '도서관 원문 안내', publishedAt: '2026-05-20', scopeSummary: '어린이 열람실, 6월 첫째·셋째 토요일', excerpt: '6월 첫째·셋째 토요일에 어린이 열람실을 엽니다.', assessments: relations({ target: 'supports', schedule: 'supports' }) }),
  source({ ...common, id: 'library-repost', originId: 'origin-library-notice', derivedFromId: 'library-notice', publisherLabel: '가상 마을소식 게시판', sourceType: '옮겨 적은 글', publishedAt: '2026-05-22', scopeSummary: '도서관 전체와 6월의 모든 토요일', excerpt: '6월 토요일마다 도서관 전체를 연다고 옮겼어요. 원문보다 범위가 넓어요.', assessments: relations({ target: 'limits', schedule: 'limits' }) }),
  source({ ...common, id: 'library-old', originId: 'origin-old-notice', publisherLabel: '가상 별빛도서관', sourceType: '지난 겨울 안내', publishedAt: '2025-12-01', periodLabel: '2025년 12월', scopeSummary: '지난 겨울 어린이 열람실', excerpt: '지난 겨울에는 시설을 고치느라 어린이 열람실을 닫았어요.', assessments: relations({ target: 'supports', schedule: 'irrelevant' }) }),
  source({ ...common, id: 'library-opinion', originId: 'origin-user-opinion', publisherLabel: '가상 이용자 모임', sourceType: '이용자 의견', publishedAt: null, periodLabel: '날짜 표시 없음', methodSummary: '이용자 한 명이 생각을 적음', scopeSummary: '이용자 한 명', excerpt: '“주말에도 열면 좋겠어요”라는 생각만 적혀 있어요.', assessments: relations({ target: 'limits', schedule: 'irrelevant' }) }),
  source({ ...common, id: 'library-maintenance', originId: 'origin-maintenance', publisherLabel: '가상 별빛도서관 시설팀', sourceType: '새 정비 안내', publishedAt: '2026-05-28', scopeSummary: '첫째 토요일 성인 열람실만 정비', excerpt: '성인 열람실만 고칩니다. 어린이 열람실은 안내대로 엽니다.', assessments: relations({ target: 'supports', schedule: 'supports' }) }),
];
