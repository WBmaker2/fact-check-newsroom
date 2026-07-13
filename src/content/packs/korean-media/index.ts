import type { FactCheckPack } from '../../../domain/types';
import { koreanCase } from './case';
import { koreanSources } from './sources';

export const koreanMediaPack: FactCheckPack = { id: 'korean-media', subjectLabel: '국어·매체', shortDescription: '원문과 재게시문의 범위를 구별해요.', displayOrder: 1, iconToken: 'file', accentToken: 'red', learningGoals: ['사실과 의견을 구분하고 원문 범위를 확인한다.'], cases: [koreanCase], sources: koreanSources };
