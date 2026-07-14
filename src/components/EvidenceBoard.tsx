import { useState } from 'react';
import { ArrowRight, Check, MinusCircle, PlusCircle, ShieldQuestion, XCircle } from 'lucide-react';
import type { ClaimAtom, EvidenceRelation, SourceCard } from '../domain/types';

const relations: { id: EvidenceRelation; label: string; icon: typeof Check }[] = [
  { id: 'supports', label: '같아요', icon: Check },
  { id: 'contradicts', label: '달라요', icon: XCircle },
  { id: 'limits', label: '일부만 알 수 있어요', icon: MinusCircle },
  { id: 'irrelevant', label: '관계없어요', icon: ShieldQuestion },
];

interface Props {
  atoms: ClaimAtom[]; sources: SourceCard[]; classified: Record<string, Record<string, EvidenceRelation>>;
  selectedSources: string[]; onClassify: (sourceId: string, atomId: string, relation: EvidenceRelation) => void;
  onToggleEvidence: (sourceId: string) => void; onContinue: () => void; late?: boolean;
}

export function EvidenceBoard({ atoms, sources, classified, selectedSources, onClassify, onToggleEvidence, onContinue, late = false }: Props) {
  const [attempted, setAttempted] = useState(false);
  const checkable = atoms.filter((atom) => atom.checkable);
  const complete = sources.every((source) => checkable.every((atom) => classified[source.id]?.[atom.id]));
  const accurate = complete && sources.every((source) => checkable.every((atom) => classified[source.id]?.[atom.id] === source.assessments[atom.id]));
  const total = sources.length * checkable.length;
  const classifiedCount = sources.reduce((count, source) => count + checkable.filter((atom) => classified[source.id]?.[atom.id]).length, 0);
  const submit = () => accurate ? onContinue() : setAttempted(true);
  return <section className="page-section" data-od-id={late ? 'late-evidence' : 'evidence-board'}>
    <header className="section-heading"><p className="context-line">3 · 자료 비교하기</p><h1>{late ? '새 자료와 확인할 말을 비교하세요.' : '자료와 확인할 말이 같은지 살펴보세요.'}</h1><p>자료에 적힌 내용과 같으면 ‘같아요’, 다르면 ‘달라요’를 고르세요.</p></header>
    <div className="evidence-stack">{sources.map((source) => {
      const selected = selectedSources.includes(source.id);
      const selectionFull = !selected && selectedSources.length >= 2;
      return <article className="evidence-source" key={source.id}><div className="evidence-source-header"><div><span>{source.sourceType}</span><h2>{source.publisherLabel}</h2></div><button className="evidence-pick" aria-pressed={selected} disabled={selectionFull} onClick={() => onToggleEvidence(source.id)}>{selected ? <Check aria-hidden="true" /> : <PlusCircle aria-hidden="true" />}{selected ? '판정 근거로 선택됨' : selectionFull ? '자료는 2개까지 선택' : '판정 근거로 사용'}</button></div>
      <aside className="evidence-excerpt" aria-label={`${source.publisherLabel} 자료 내용 다시 보기`}><span>자료 내용</span><blockquote>{source.excerpt}</blockquote></aside>
      {checkable.map((atom) => {
        const needsReview = attempted && classified[source.id]?.[atom.id] !== source.assessments[atom.id];
        return <fieldset className={`relation-row${needsReview ? ' needs-review' : ''}`} key={atom.id}><legend><span>확인할 말</span>{atom.text}</legend><div>{relations.map(({ id, label, icon: Icon }) => <button type="button" key={id} aria-pressed={classified[source.id]?.[atom.id] === id} onClick={() => onClassify(source.id, atom.id, id)}><Icon aria-hidden="true" />{label}</button>)}</div>{needsReview ? <p className="relation-hint" role="status">자료 문장과 다시 비교해 보세요.</p> : null}</fieldset>;
      })}
    </article>;
    })}</div>
    <div className="action-row"><span>비교 {classifiedCount}/{total} · 도움 된 자료 {selectedSources.length}/2개</span><button className="button button-primary" disabled={!complete || selectedSources.length === 0} onClick={submit}>{late ? '새 자료로 다시 판단하기' : '첫 번째 판단하기'}<ArrowRight aria-hidden="true" /></button></div>
  </section>;
}
