import { relations, source } from '../../source-factory';

const tableData = { headers: ['달', '낮 길이'], rows: [['3월', '12시간'], ['6월', '14시간'], ['9월', '12시간']] };
const common = { caseId: 'seasonal-sun', scopeSummary: '가상 하늘관측소 한 곳', methodSummary: '매달 같은 방법으로 낮 길이를 기록함' };
export const scienceSources = [
  source({ ...common, id: 'sun-table', originId: 'origin-sun-table', publisherLabel: '가상 하늘관측소', sourceType: '낮 길이 표', publishedAt: '2026-10-01', periodLabel: '2026년 3·6·9월', excerpt: '6월 낮은 14시간이에요. 이 표에는 12월 숫자가 없어요.', assessments: relations({ relation: 'limits', measure: 'limits' }), tableData }),
  source({ ...common, id: 'sun-infographic', originId: 'origin-sun-table', derivedFromId: 'sun-table', publisherLabel: '가상 과학소식', sourceType: '옮겨 그린 그림', publishedAt: '2026-10-02', periodLabel: '2026년 3·6·9월', excerpt: '같은 표를 그림으로 옮겼어요. 새로 관찰한 자료는 아니에요.', assessments: relations({ relation: 'limits', measure: 'limits' }) }),
  source({ ...common, id: 'sun-photo', originId: 'origin-sun-photo', publisherLabel: '가상 관찰 모임', sourceType: '사진 한 장', publishedAt: '2026-06-15', periodLabel: '2026년 6월 하루', methodSummary: '낮에 사진 한 장을 찍음', scopeSummary: '6월의 하루', excerpt: '6월에 찍은 사진 한 장으로는 12월 낮 길이를 알 수 없어요.', assessments: relations({ relation: 'irrelevant', measure: 'irrelevant' }) }),
  source({ ...common, id: 'sun-other', originId: 'origin-other-place', publisherLabel: '가상 먼지역 관측소', sourceType: '다른 지역 메모', publishedAt: null, periodLabel: '날짜 표시 없음', methodSummary: '방법 표시 없음', scopeSummary: '다른 지역', excerpt: '다른 지역의 자료이고 날짜도 적혀 있지 않아요.', assessments: relations({ relation: 'irrelevant', measure: 'irrelevant' }) }),
  source({ ...common, id: 'sun-december', originId: 'origin-sun-december', publisherLabel: '가상 하늘관측소', sourceType: '새 낮 길이 표', publishedAt: '2026-12-22', periodLabel: '2026년 6월과 12월', excerpt: '6월 낮은 14시간, 12월 낮은 10시간이에요.', assessments: relations({ relation: 'supports', measure: 'contradicts' }), tableData: { headers: ['달', '낮 길이'], rows: [['6월', '14시간'], ['12월', '10시간']] } }),
];
