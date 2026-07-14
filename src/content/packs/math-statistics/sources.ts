import { relations, source } from '../../source-factory';

const common = { caseId: 'reading-survey', periodLabel: '2026년 4월', publishedAt: '2026-04-12', scopeSummary: '가상 새봄초 독서동아리 12명', methodSummary: '독서동아리 학생에게 찬반을 물음' };
const tableData = { headers: ['응답', '학생 수'], rows: [['찬성', '10명'], ['반대', '2명'], ['합계', '12명']] };
export const mathSources = [
  source({ ...common, id: 'survey-table', originId: 'origin-survey', publisherLabel: '가상 새봄초 독서동아리', sourceType: '설문 결과표', excerpt: '독서동아리 12명 중 10명이 찬성하고 2명이 반대했어요.', assessments: relations({ subject: 'limits', measure: 'limits' }), tableData }),
  source({ ...common, id: 'survey-chart', originId: 'origin-survey', derivedFromId: 'survey-table', publisherLabel: '가상 교내소식', sourceType: '옮겨 그린 그림', excerpt: '같은 설문을 83%라고 그렸어요. 새로 설문한 것은 아니에요.', assessments: relations({ subject: 'limits', measure: 'limits' }) }),
  source({ ...common, id: 'teacher-opinion', originId: 'origin-teacher', publisherLabel: '가상 교사 연구모임', sourceType: '교사 한 명의 생각', excerpt: '한 교사가 “아침 독서가 도움이 될 것 같아요”라고 말했어요.', assessments: relations({ subject: 'irrelevant', measure: 'irrelevant' }) }),
  source({ ...common, id: 'unknown-post', originId: 'origin-unknown', publisherLabel: '가상 학교 게시판', sourceType: '정보가 빠진 글', publishedAt: null, periodLabel: '날짜 표시 없음', scopeSummary: '누가 답했는지 표시 없음', methodSummary: '어떻게 조사했는지 표시 없음', excerpt: '“학생들이 원해요”라고만 적혀 있어 누구에게 물었는지 몰라요.', assessments: relations({ subject: 'limits', measure: 'limits' }) }),
  source({ ...common, id: 'sample-note', originId: 'origin-roster', publisherLabel: '가상 새봄초 학년부', sourceType: '새 학생 수 자료', publishedAt: '2026-04-15', scopeSummary: '5학년 전체 120명과 설문에 답한 12명', methodSummary: '학생 명단과 설문 명단을 비교함', excerpt: '5학년은 120명이고, 설문에 답한 12명은 모두 독서동아리 학생이에요.', assessments: relations({ subject: 'limits', measure: 'limits' }) }),
];
