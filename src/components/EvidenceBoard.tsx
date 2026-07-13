import { ArrowRight, Check, MinusCircle, PlusCircle, ShieldQuestion, XCircle } from 'lucide-react';
import type { ClaimAtom, EvidenceRelation, SourceCard } from '../domain/types';

const relations: { id: EvidenceRelation; label: string; icon: typeof Check }[] = [
  { id: 'supports', label: '주장을 지지해요', icon: Check },
  { id: 'contradicts', label: '주장과 다른 결과예요', icon: XCircle },
  { id: 'limits', label: '말할 수 있는 범위를 줄여요', icon: MinusCircle },
  { id: 'irrelevant', label: '이 주장과는 관련이 적어요', icon: ShieldQuestion },
];

interface Props {
  atoms: ClaimAtom[]; sources: SourceCard[]; classified: Record<string, Record<string, EvidenceRelation>>;
  selectedSources: string[]; onClassify: (sourceId: string, atomId: string, relation: EvidenceRelation) => void;
  onToggleEvidence: (sourceId: string) => void; onContinue: () => void; late?: boolean;
}

export function EvidenceBoard({ atoms, sources, classified, selectedSources, onClassify, onToggleEvidence, onContinue, late = false }: Props) {
  const checkable = atoms.filter((atom) => atom.checkable);
  const complete = sources.every((source) => checkable.every((atom) => classified[source.id]?.[atom.id]));
  return <section className="page-section" data-od-id={late ? 'late-evidence' : 'evidence-board'}>
    <header className="section-heading"><p className="context-line">3 · 근거 분류</p><h1>{late ? '새 자료가 각 주장 조각과 어떤 관계인가요?' : '출처와 주장 조각의 관계를 연결하세요.'}</h1><p>같은 출처도 주장 조각에 따라 지지하거나 범위를 제한할 수 있어요.</p></header>
    <div className="evidence-stack">{sources.map((source) => <article className="evidence-source" key={source.id}><div className="evidence-source-header"><div><span>{source.sourceType}</span><h2>{source.publisherLabel}</h2></div><button className="evidence-pick" aria-pressed={selectedSources.includes(source.id)} onClick={() => onToggleEvidence(source.id)}>{selectedSources.includes(source.id) ? <Check aria-hidden="true" /> : <PlusCircle aria-hidden="true" />}{selectedSources.includes(source.id) ? '판정 근거로 선택됨' : '판정 근거로 사용'}</button></div>
      {checkable.map((atom) => <fieldset className="relation-row" key={atom.id}><legend><span>주장 조각</span>{atom.text}</legend><div>{relations.map(({ id, label, icon: Icon }) => <button type="button" key={id} aria-pressed={classified[source.id]?.[atom.id] === id} onClick={() => onClassify(source.id, atom.id, id)}><Icon aria-hidden="true" />{label}</button>)}</div></fieldset>)}
    </article>)}</div>
    <div className="action-row"><span>{selectedSources.length}/3개 판정 근거 선택</span><button className="button button-primary" disabled={!complete || selectedSources.length === 0} onClick={onContinue}>{late ? '새 자료를 반영해 다시 판단하기' : '이 근거로 첫 판정하기'}<ArrowRight aria-hidden="true" /></button></div>
  </section>;
}
