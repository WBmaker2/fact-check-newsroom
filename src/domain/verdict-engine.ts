import type { Checkpoint, EvidenceRelation, FactCheckCase, SourceCard, Verdict } from './types';

export function countIndependentOrigins(sources: SourceCard[]) {
  return new Set(sources.map((source) => source.originId)).size;
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
  return { matched: true, feedback: '' };
}
