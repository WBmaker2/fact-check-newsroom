import type { FactCheckPack } from '../../../domain/types';
import { mathCase } from './case';
import { mathSources } from './sources';
export const mathStatisticsPack: FactCheckPack = { id: 'math-statistics', subjectLabel: '수학·통계', shortDescription: '12명의 대답과 5학년 전체 의견을 구별해요.', displayOrder: 3, iconToken: 'chart', accentToken: 'blue', learningGoals: ['설문에 누가 답했는지 확인한다.'], cases: [mathCase], sources: mathSources };
