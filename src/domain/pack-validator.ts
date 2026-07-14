import type { FactCheckPack } from './types';

const URL_PATTERN = /https?:\/\//i;

export function validatePackRegistry(packs: FactCheckPack[]) {
  const errors: string[] = [];
  const warnings: string[] = [];
  const packIds = new Set<string>();

  for (const pack of packs) {
    if (packIds.has(pack.id)) errors.push(`${pack.id}: 팩 ID가 중복되었습니다.`);
    packIds.add(pack.id);
    const caseIds = new Set<string>();
    const sourceIds = new Set<string>();
    for (const source of pack.sources) {
      if (sourceIds.has(source.id)) errors.push(`${source.id}: 출처 ID가 중복되었습니다.`);
      sourceIds.add(source.id);
      if (!source.synthetic) errors.push(`${source.id}: synthetic 표시가 필요합니다.`);
      if (URL_PATTERN.test(JSON.stringify(source))) warnings.push(`${source.id}: 외부 URL이 포함되어 있습니다.`);
    }
    for (const caseFile of pack.cases) {
      if (caseIds.has(caseFile.id)) errors.push(`${caseFile.id}: 사건 ID가 중복되었습니다.`);
      caseIds.add(caseFile.id);
      if (caseFile.initialSourceIds.length !== 3) errors.push(`${caseFile.id}: 처음 출처는 3개여야 합니다.`);
      const referenced = [...caseFile.initialSourceIds, caseFile.lateSourceId];
      for (const id of referenced) if (!sourceIds.has(id)) errors.push(`${caseFile.id}: 출처 ${id}를 찾을 수 없습니다.`);
      const checkableAtoms = caseFile.atoms.filter((atom) => atom.checkable);
      for (const checkpoint of ['initial', 'final'] as const) {
        const correctReasonCount = caseFile.reasonOptions.filter((reason) => reason.correctAt.includes(checkpoint)).length;
        if (correctReasonCount !== 1) errors.push(`${caseFile.id}/${checkpoint}: 정답 이유는 정확히 1개여야 합니다.`);
        if (!caseFile.decisionClues[checkpoint].trim()) errors.push(`${caseFile.id}/${checkpoint}: 핵심 비교 문장이 필요합니다.`);
        if (!caseFile.decisionHints[checkpoint].trim()) errors.push(`${caseFile.id}/${checkpoint}: 오답 힌트가 필요합니다.`);
      }
      for (const source of pack.sources.filter((item) => item.caseId === caseFile.id)) {
        for (const atom of checkableAtoms) {
          if (!source.assessments[atom.id]) errors.push(`${source.id}/${atom.id}: 관계 평가가 없습니다.`);
        }
      }
      if (caseFile.headlineOptions.length < 1) errors.push(`${caseFile.id}: 검수된 제목이 필요합니다.`);
    }
  }
  return { valid: errors.length === 0, errors, warnings };
}
