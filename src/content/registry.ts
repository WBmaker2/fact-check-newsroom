import { koreanMediaPack } from './packs/korean-media';
import { mathStatisticsPack } from './packs/math-statistics';
import { scienceDataPack } from './packs/science-data';
import { socialDataPack } from './packs/social-data';
import type { FactCheckPack } from '../domain/types';

export const packRegistry: FactCheckPack[] = [koreanMediaPack, scienceDataPack, mathStatisticsPack, socialDataPack].sort((a, b) => a.displayOrder - b.displayOrder);
