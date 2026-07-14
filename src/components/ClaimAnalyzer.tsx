import { ArrowRight, MessageCircle } from 'lucide-react';
import type { FactCheckCase } from '../domain/types';

interface Props { caseFile: FactCheckCase; selected: string[]; onToggle: (id: string) => void; onContinue: () => void }
export function ClaimAnalyzer({ caseFile, selected, onToggle, onContinue }: Props) {
  const required = caseFile.atoms.filter((atom) => atom.required).map((atom) => atom.id);
  const opinion = caseFile.atoms.find((atom) => atom.kind === 'opinion');
  const complete = required.every((id) => selected.includes(id));
  return <section className="page-section" data-od-id="claim-analyzer">
    <header className="section-heading"><p className="context-line">1 · 확인할 말 찾기</p><h1>자료에서 찾아볼 말을 고르세요.</h1><p>장소, 때, 숫자처럼 자료로 확인할 수 있는 말을 누르세요.</p></header>
    <div className="claim-paper"><blockquote>{caseFile.claimText}</blockquote><div className="atom-list" aria-label="주장 조각">
      {caseFile.atoms.map((atom) => atom.checkable ? <button key={atom.id} aria-pressed={selected.includes(atom.id)} className="atom-button" onClick={() => onToggle(atom.id)}><span>{selected.includes(atom.id) ? '✓ 선택됨' : '확인하기'}</span>{atom.text}</button> : <button key={atom.id} className="atom-button opinion" disabled><MessageCircle aria-hidden="true" />{atom.text}<span>의견</span></button>)}
    </div></div>
    <aside className="teaching-note"><strong>{opinion ? '느낌을 나타낸 말은 빼요.' : '무엇을 고르면 되나요?'}</strong><p>{opinion ? `“${opinion.text}”은 느낌을 나타내므로 맞는지 틀린지 확인하지 않아요.` : '주장의 중요한 대상과 내용을 모두 고르면 돼요.'}</p></aside>
    <div className="action-row"><span>{selected.length}/{required.length}개 확인</span><button className="button button-primary" disabled={!complete} onClick={onContinue}>자료 살펴보기<ArrowRight aria-hidden="true" /></button></div>
  </section>;
}
