import type { Checkpoint, EvidenceRelation, FactCheckCase, SourceCard, Verdict } from './types';

export function countIndependentOrigins(sources: SourceCard[]) {
  return new Set(sources.map((source) => source.originId)).size;
}

function sourceFitsVerdict(source: SourceCard, atomIds: string[], verdict: Verdict) {
  const assessments = atomIds.map((atomId) => source.assessments[atomId]);
  if (verdict === 'confirmed') return assessments.every((relation) => relation === 'supports');
  if (verdict === 'partly-confirmed') return assessments.includes('supports') && assessments.some((relation) => relation === 'limits' || relation === 'contradicts');
  if (verdict === 'contradicted') return assessments.includes('contradicts');
  return assessments.includes('limits') && !assessments.includes('contradicts');
}

interface DecisionInput {
  caseFile: FactCheckCase;
  checkpoint: Checkpoint;
  sources: SourceCard[];
  relations: Record<string, Record<string, EvidenceRelation>>;
  selectedSourceIds: string[];
  inspectedSourceIds: string[];
  verdict: Verdict;
  reasonIds: string[];
}

export function evaluateDecision(input: DecisionInput) {
  const expectedVerdict = input.checkpoint === 'initial' ? input.caseFile.initialVerdict : input.caseFile.finalVerdict;
  const expectedReasons = input.caseFile.reasonOptions.filter((reason) => reason.correctAt.includes(input.checkpoint)).map((reason) => reason.id).sort();
  const actualReasons = [...input.reasonIds].sort();
  if (input.verdict !== expectedVerdict) return { matched: false, feedback: input.caseFile.decisionHints[input.checkpoint] };
  if (JSON.stringify(expectedReasons) !== JSON.stringify(actualReasons)) return { matched: false, feedback: input.caseFile.decisionHints[input.checkpoint] };
  if (input.selectedSourceIds.length < 1 || input.selectedSourceIds.length > 2) return { matched: false, feedback: '판정에 도움이 된 자료를 1개 또는 2개 골라 주세요.' };
  const atomIds = input.caseFile.atoms.filter((atom) => atom.checkable).map((atom) => atom.id);
  const selectedSources = input.sources.filter((source) => input.selectedSourceIds.includes(source.id));
  const accuratelyCompared = selectedSources.every((source) => atomIds.every((atomId) => input.relations[source.id]?.[atomId] === source.assessments[atomId]));
  if (!accuratelyCompared) return { matched: false, feedback: '고른 자료와 확인할 말을 다시 비교해 보세요.' };
  if (!selectedSources.some((source) => sourceFitsVerdict(source, atomIds, expectedVerdict))) return { matched: false, feedback: '판정에 직접 도움이 되는 자료를 다시 골라 보세요.' };
  return { matched: true, feedback: '' };
}
