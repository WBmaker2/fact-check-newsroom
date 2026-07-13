import type { FactCheckPack } from '../../../domain/types';
import { socialCase } from './case';
import { socialSources } from './sources';
export const socialDataPack: FactCheckPack = { id: 'social-data', subjectLabel: '사회·매체', shortDescription: '오래된 기록의 목적과 출처 계보를 살펴요.', displayOrder: 4, iconToken: 'map', accentToken: 'green', learningGoals: ['수리 기록과 건설 기록을 구분하고 출처 계보를 확인한다.'], cases: [socialCase], sources: socialSources };
