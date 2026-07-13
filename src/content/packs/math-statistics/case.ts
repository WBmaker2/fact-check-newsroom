import type { FactCheckCase } from '../../../domain/types';

export const mathCase: FactCheckCase = {
  id: 'reading-survey', synthetic: true,
  claimText: '가상 새봄초 5학년 대부분은 아침 독서를 원한다.',
  atoms: [
    { id: 'subject', kind: 'subject', text: '가상 새봄초 5학년 전체', checkable: true, required: true },
    { id: 'measure', kind: 'measure', text: '대부분', checkable: true, required: true },
    { id: 'scope', kind: 'scope', text: '조사 응답자 범위', checkable: true, required: true },
  ],
  initialSourceIds: ['survey-table', 'survey-chart', 'teacher-opinion', 'unknown-post'], lateSourceId: 'sample-note',
  initialVerdict: 'insufficient', finalVerdict: 'insufficient',
  reasonOptions: [
    { id: 'club-sample', label: '10명은 독서동아리 12명 안에서 나온 결과예요.', correctAt: ['initial', 'final'] },
    { id: 'not-representative', label: '5학년 전체를 대표한다고 볼 근거가 부족해요.', correctAt: ['initial', 'final'] },
    { id: 'large-percent', label: '83%는 큰 수이므로 누구에게나 적용돼요.', correctAt: [] },
  ],
  headlineOptions: ['독서동아리 12명 중 10명은 원했지만 5학년 전체 의견은 아직 알 수 없다', '아침 독서를 원한 응답은 독서동아리 12명 중 10명, 5학년 전체 판단은 보류'],
};
