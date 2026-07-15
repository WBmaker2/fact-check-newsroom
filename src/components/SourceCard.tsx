import { Check, Eye, Link2 } from 'lucide-react';
import type { SourceCard } from '../domain/types';
import { dimensions } from './source-dimensions';

const detail = (source: SourceCard, id: string) => ({ publisher: `${source.publisherLabel} · ${source.sourceType}`, date: `${source.publishedAt ?? '날짜 표시 없음'} · ${source.periodLabel}`, method: source.methodSummary, scope: source.scopeSummary }[id]);

interface Props { source: SourceCard; inspected: string[]; onInspectAll: () => void; positionLabel?: string; compact?: boolean }
export function SourceCardView({ source, inspected, onInspectAll, positionLabel, compact = false }: Props) {
  const complete = dimensions.every((dimension) => inspected.includes(dimension.id));
  return <article className={`source-card${compact ? ' compact' : ''}`} aria-label={`${source.publisherLabel} ${source.sourceType}`}>
    <div className="source-topline"><span className="source-type">{positionLabel ? `${positionLabel} · ` : ''}{source.sourceType}</span><span className="synthetic-tag">가상 자료</span></div>
    <h2>{source.publisherLabel}</h2>
    {source.derivedFromId ? <p className="origin-note"><Link2 aria-hidden="true" />같은 원자료를 옮긴 자료 · 독립 근거로 두 번 세지 않아요.</p> : null}
    <p className="source-excerpt">{source.excerpt}</p>
    {source.tableData ? <div className="table-wrap"><table><caption className="sr-only">{source.accessibleSummary}</caption><thead><tr>{source.tableData.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{source.tableData.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, index) => index === 0 ? <th key={cell} scope="row">{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div> : null}
    <button className="lens-reveal" aria-expanded={complete} onClick={onInspectAll}>{complete ? <Check aria-hidden="true" /> : <Eye aria-hidden="true" />}{complete ? '네 가지 단서 확인 완료' : '네 가지 단서 한눈에 보기'}</button>
    {complete ? <dl className="source-details" aria-label="확인한 출처 단서">{dimensions.map(({ id, label, icon: Icon }) => <div key={id}><dt><Icon aria-hidden="true" />{label}</dt><dd>{detail(source, id)}</dd></div>)}</dl> : null}
  </article>;
}
