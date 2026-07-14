import type { FactCheckPack } from '../../../domain/types';
import { koreanCase } from './case';
import { koreanSources } from './sources';

export const koreanMediaPack: FactCheckPack = { id: 'korean-media', subjectLabel: '국어·매체', shortDescription: '도서관 원문과 옮겨 적은 글을 비교해요.', displayOrder: 1, iconToken: 'file', accentToken: 'red', learningGoals: ['느낌을 나타낸 말과 확인할 말을 나누고 원문을 확인한다.'], cases: [koreanCase], sources: koreanSources };
