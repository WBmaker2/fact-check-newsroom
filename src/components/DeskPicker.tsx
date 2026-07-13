import { BarChart3, FileText, Map, Sun } from 'lucide-react';
import type { FactCheckPack } from '../domain/types';

const icons = { file: FileText, sun: Sun, chart: BarChart3, map: Map };
export function DeskPicker({ packs, onSelect }: { packs: FactCheckPack[]; onSelect: (id: string) => void }) {
  return <section className="page-section" data-od-id="desk-picker">
    <header className="section-heading"><p className="context-line">편집 회의</p><h1>어느 사건부터 살펴볼까요?</h1><p>교과마다 다른 종류의 주장과 자료를 다룹니다.</p></header>
    <div className="desk-list">
      {packs.map((pack) => { const Icon = icons[pack.iconToken]; return <article className="desk-row" key={pack.id}>
        <div className={`desk-icon accent-${pack.accentToken}`}><Icon aria-hidden="true" /></div>
        <div><span className="synthetic-tag">가상 자료</span><h2>{pack.subjectLabel}</h2><p>{pack.shortDescription}</p><small>예상 시간 18~22분</small></div>
        <button className="button button-secondary" onClick={() => onSelect(pack.id)}>{pack.subjectLabel} 사건 선택</button>
      </article>; })}
    </div>
  </section>;
}
