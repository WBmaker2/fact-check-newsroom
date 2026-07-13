import { ArrowRight, MessageCircle } from 'lucide-react';
import type { FactCheckCase } from '../domain/types';

interface Props { caseFile: FactCheckCase; selected: string[]; onToggle: (id: string) => void; onContinue: () => void }
export function ClaimAnalyzer({ caseFile, selected, onToggle, onContinue }: Props) {
  const required = caseFile.atoms.filter((atom) => atom.required).map((atom) => atom.id);
  const complete = required.every((id) => selected.includes(id));
  return <section className="page-section" data-od-id="claim-analyzer">
    <header className="section-heading"><p className="context-line">1 · 주장 해부</p><h1>자료로 확인할 조각을 찾아보세요.</h1><p>의견과 확인 가능한 대상을 구분하면 출처를 더 정확히 볼 수 있어요.</p></header>
    <div className="claim-paper"><blockquote>{caseFile.claimText}</blockquote><div className="atom-list" aria-label="주장 조각">
      {caseFile.atoms.map((atom) => atom.checkable ? <button key={atom.id} aria-pressed={selected.includes(atom.id)} className="atom-button" onClick={() => onToggle(atom.id)}><span>{selected.includes(atom.id) ? '✓ 선택됨' : '확인하기'}</span>{atom.text}</button> : <button key={atom.id} className="atom-button opinion" disabled><MessageCircle aria-hidden="true" />{atom.text}<span>의견</span></button>)}
    </div></div>
    <aside className="teaching-note"><strong>의견은 어떻게 하나요?</strong><p>“반가운 소식”은 의견이라 자료로 참·거짓을 가리지 않아요.</p></aside>
    <div className="action-row"><span>{selected.length}/{required.length}개 핵심 조각 확인</span><button className="button button-primary" disabled={!complete} onClick={onContinue}>출처 데스크 열기<ArrowRight aria-hidden="true" /></button></div>
  </section>;
}
