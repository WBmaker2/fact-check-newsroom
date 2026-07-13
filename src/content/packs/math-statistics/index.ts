import type { FactCheckPack } from '../../../domain/types';
import { mathCase } from './case';
import { mathSources } from './sources';
export const mathStatisticsPack: FactCheckPack = { id: 'math-statistics', subjectLabel: '수학·통계', shortDescription: '작은 표본을 전체 의견으로 넓히지 않아요.', displayOrder: 3, iconToken: 'chart', accentToken: 'blue', learningGoals: ['비율의 분모와 조사 대상을 함께 확인한다.'], cases: [mathCase], sources: mathSources };
