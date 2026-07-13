const PROHIBITED = ['무조건', '전부', '완벽', '충격', '100%'];

export function validateHeadline(headline: string, reviewedOptions: string[]) {
  if (PROHIBITED.some((word) => headline.includes(word))) return { valid: false, message: '근거보다 강한 과장 표현은 제목에 쓸 수 없습니다.' };
  if (!reviewedOptions.includes(headline)) return { valid: false, message: '사건 자료에 맞게 검수된 제목 조합을 선택하세요.' };
  return { valid: true, message: '' };
}
