import type { EvidenceRelation, SourceCard } from '../domain/types';

export function source(
  base: Omit<SourceCard, 'synthetic' | 'accessibleSummary'> & { accessibleSummary?: string },
): SourceCard {
  return {
    ...base,
    synthetic: true,
    accessibleSummary: base.accessibleSummary ?? `${base.sourceType}. ${base.excerpt}`,
  };
}

export function relations(entries: Record<string, EvidenceRelation>) {
  return entries;
}
