import { relations, source } from '../../source-factory';

const common = { caseId: 'reading-survey', periodLabel: '2026년 4월', publishedAt: '2026-04-12', scopeSummary: '가상 새봄초 독서동아리 12명', methodSummary: '독서동아리 학생에게 찬반을 물음' };
const tableData = { headers: ['응답', '학생 수'], rows: [['찬성', '10명'], ['반대', '2명'], ['합계', '12명']] };
export const mathSources = [
  source({ ...common, id: 'survey-table', originId: 'origin-survey', publisherLabel: '가상 새봄초 독서동아리', sourceType: '설문 원자료 표', excerpt: '독서동아리 12명 중 찬성 10명, 반대 2명입니다.', assessments: relations({ subject: 'limits', measure: 'limits', scope: 'supports' }), tableData }),
  source({ ...common, id: 'survey-chart', originId: 'origin-survey', derivedFromId: 'survey-table', publisherLabel: '가상 교내소식', sourceType: '83% 재게시 그림', excerpt: '같은 설문을 83%로 표현했으며 새로운 응답자는 없습니다.', assessments: relations({ subject: 'limits', measure: 'limits', scope: 'supports' }) }),
  source({ ...common, id: 'teacher-opinion', originId: 'origin-teacher', publisherLabel: '가상 교사 연구모임', sourceType: '교사 한 명의 의견', excerpt: '아침 독서가 도움이 될 것이라는 의견으로 학생 전체의 선호 조사는 아닙니다.', assessments: relations({ subject: 'irrelevant', measure: 'irrelevant', scope: 'limits' }) }),
  source({ ...common, id: 'unknown-post', originId: 'origin-unknown', publisherLabel: '가상 학교 게시판', sourceType: '응답자 미표시 게시물', publishedAt: null, periodLabel: '날짜 표시 없음', scopeSummary: '응답자 표시 없음', methodSummary: '조사 방법 표시 없음', excerpt: '“학생들이 원한다”라고만 적혀 있어 누구에게 물었는지 알 수 없습니다.', assessments: relations({ subject: 'limits', measure: 'limits', scope: 'limits' }) }),
  source({ ...common, id: 'sample-note', originId: 'origin-roster', publisherLabel: '가상 새봄초 학년부', sourceType: '후속 표본 메모', publishedAt: '2026-04-15', scopeSummary: '5학년 전체 120명과 설문 응답자 12명', methodSummary: '학년 명부와 설문 명단을 대조함', excerpt: '5학년은 120명이고 설문 응답자는 모두 독서동아리 학생이었습니다.', assessments: relations({ subject: 'limits', measure: 'limits', scope: 'supports' }) }),
];
