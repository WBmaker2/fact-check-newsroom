import type { FactCheckPack } from '../../../domain/types';
import { scienceCase } from './case';
import { scienceSources } from './sources';
export const scienceDataPack: FactCheckPack = { id: 'science-data', subjectLabel: '과학·자료', shortDescription: '6월과 12월의 낮 길이를 비교해요.', displayOrder: 2, iconToken: 'sun', accentToken: 'gold', learningGoals: ['표에 나온 두 숫자를 직접 비교한다.'], cases: [scienceCase], sources: scienceSources };
