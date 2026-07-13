import type { FactCheckPack } from '../../../domain/types';
import { scienceCase } from './case';
import { scienceSources } from './sources';
export const scienceDataPack: FactCheckPack = { id: 'science-data', subjectLabel: '과학·자료', shortDescription: '관측값의 관계와 과장된 수치를 나눠 봐요.', displayOrder: 2, iconToken: 'sun', accentToken: 'gold', learningGoals: ['자료가 보여 주는 관계와 원인 설명을 구분한다.'], cases: [scienceCase], sources: scienceSources };
