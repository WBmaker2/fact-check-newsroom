import { BarChart3, FileText, Map, Sun } from 'lucide-react';
import type { FactCheckPack } from '../domain/types';
import { PreviousButton } from './PreviousButton';

const icons = { file: FileText, sun: Sun, chart: BarChart3, map: Map };
export function DeskPicker({ packs, onSelect, onBack }: { packs: FactCheckPack[]; onSelect: (id: string) => void; onBack: () => void }) {
  return <section className="page-section" data-od-id="desk-picker">
    <header className="section-heading"><p className="context-line">편집 회의</p><h1>어느 사건부터 살펴볼까요?</h1><p>모든 사건은 가상 자료를 사용하며 약 10~15분 걸려요.</p></header>
    <div className="desk-list">
      {packs.map((pack, index) => { const Icon = icons[pack.iconToken]; return <article className="desk-row" key={pack.id}>
        <div className={`desk-icon accent-${pack.accentToken}`}><Icon aria-hidden="true" /></div>
        <div>{index === 0 ? <span className="recommend-tag">처음이라면 추천</span> : null}<h2>{pack.subjectLabel}</h2><p>{pack.shortDescription}</p><small>배울 점 · {pack.learningGoals[0]}</small></div>
        <button className="button button-secondary" onClick={() => onSelect(pack.id)}>{pack.subjectLabel} 사건 선택</button>
      </article>; })}
    </div>
    <div className="stage-back-row"><PreviousButton onClick={onBack} label="소개 화면으로" /></div>
  </section>;
}
