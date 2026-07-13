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
  if (input.verdict !== expectedVerdict) return { matched: false, feedback: '근거 부족과 직접 반박을 구분해 판정을 다시 살펴보세요.' };
  if (JSON.stringify(expectedReasons) !== JSON.stringify(actualReasons)) return { matched: false, feedback: '선택한 이유가 자료가 허용하는 설명과 맞는지 확인하세요.' };
  for (const source of input.sources) {
    if (!input.inspectedSourceIds.includes(source.id)) continue;
    for (const [atomId, expected] of Object.entries(source.assessments)) {
      if (input.relations[source.id]?.[atomId] !== expected) return { matched: false, feedback: '출처와 주장 조각의 근거 관계를 다시 확인하세요.' };
    }
  }
  if (input.selectedSourceIds.length < 1 || input.selectedSourceIds.length > 3) return { matched: false, feedback: '판정 근거는 1~3개를 선택하세요.' };
  return { matched: true, feedback: '' };
}
