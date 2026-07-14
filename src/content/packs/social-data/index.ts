import type { FactCheckPack } from '../../../domain/types';
import { socialCase } from './case';
import { socialSources } from './sources';
export const socialDataPack: FactCheckPack = { id: 'social-data', subjectLabel: '사회·매체', shortDescription: '우물을 처음 만든 기록과 고친 기록을 구별해요.', displayOrder: 4, iconToken: 'map', accentToken: 'green', learningGoals: ['처음 만들기와 고치기의 뜻을 구별한다.'], cases: [socialCase], sources: socialSources };
