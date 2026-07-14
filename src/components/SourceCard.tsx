import { Check, Link2 } from 'lucide-react';
import type { SourceCard } from '../domain/types';
import { dimensions } from './source-dimensions';

const detail = (source: SourceCard, id: string) => ({ publisher: `${source.publisherLabel} · ${source.sourceType}`, date: `${source.publishedAt ?? '날짜 표시 없음'} · ${source.periodLabel}`, method: source.methodSummary, scope: source.scopeSummary }[id]);

interface Props { source: SourceCard; inspected: string[]; onInspect: (dimension: string) => void; compact?: boolean }
export function SourceCardView({ source, inspected, onInspect, compact = false }: Props) {
  return <article className={`source-card${compact ? ' compact' : ''}`} aria-label={`${source.publisherLabel} ${source.sourceType}`}>
    <div className="source-topline"><span className="source-type">{source.sourceType}</span><span className="synthetic-tag">가상 자료</span></div>
    <h2>{source.publisherLabel}</h2>
    {source.derivedFromId ? <p className="origin-note"><Link2 aria-hidden="true" />같은 원자료를 옮긴 자료 · 독립 근거로 두 번 세지 않아요.</p> : null}
    <p className="source-excerpt">{source.excerpt}</p>
    {source.tableData ? <div className="table-wrap"><table><caption className="sr-only">{source.accessibleSummary}</caption><thead><tr>{source.tableData.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{source.tableData.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, index) => index === 0 ? <th key={cell} scope="row">{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div> : null}
    <div className="lens-list" aria-label="출처 점검 렌즈">
      {dimensions.map(({ id, label, icon: Icon }) => {
        const checked = inspected.includes(id);
        return <button key={id} className="lens-button" aria-pressed={checked} onClick={() => onInspect(id)}><span><Icon aria-hidden="true" />{label}</span>{checked ? <><Check aria-hidden="true" /><small>{detail(source, id)}</small></> : null}</button>;
      })}
    </div>
  </article>;
}
