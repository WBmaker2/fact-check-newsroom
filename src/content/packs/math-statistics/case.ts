import type { FactCheckCase } from '../../../domain/types';

export const mathCase: FactCheckCase = {
  id: 'reading-survey', synthetic: true,
  claimText: '가상 새봄초 5학년 대부분은 아침 독서를 원한다.',
  atoms: [
    { id: 'subject', kind: 'subject', text: '가상 새봄초 5학년 학생', checkable: true, required: true },
    { id: 'measure', kind: 'measure', text: '대부분은 아침 독서를 원함', checkable: true, required: true },
  ],
  initialSourceIds: ['survey-table', 'teacher-opinion', 'unknown-post'], lateSourceId: 'sample-note',
  initialVerdict: 'insufficient', finalVerdict: 'insufficient',
  decisionClues: {
    initial: '찬성한 10명은 5학년 전체가 아니라 독서동아리 학생이에요.',
    final: '새 자료를 보니 5학년은 120명이고, 설문에 답한 사람은 동아리 학생 12명뿐이에요.',
  },
  decisionHints: {
    initial: '설문표에서 누구에게 물었는지 다시 확인해 보세요.',
    final: '5학년 전체 학생 수와 설문에 답한 학생 수를 비교해 보세요.',
  },
  reasonOptions: [
    { id: 'club-sample', label: '설문은 5학년 전체가 아니라 독서동아리 12명에게만 물었어요.', correctAt: ['initial', 'final'] },
    { id: 'large-percent', label: '10명이 찬성했으니 5학년 전체도 대부분 찬성해요.', correctAt: [] },
  ],
  headlineOptions: ['독서동아리 12명 중 10명 찬성, 5학년 전체 의견은 아직 몰라', '아침 독서 설문은 동아리 학생 12명만 참여'],
};
