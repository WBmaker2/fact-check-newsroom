import { ArrowRight, PenLine } from 'lucide-react';

export function HeadlineComposer({ options, selected, onSelect, onContinue }: { options: string[]; selected: string; onSelect: (headline: string) => void; onContinue: () => void }) {
  return <section className="page-section" data-od-id="headline-composer"><header className="section-heading"><p className="context-line">5 · 정확한 제목 만들기</p><h1>근거가 허용하는 범위만 제목에 담으세요.</h1><p>기간, 표본, 조건을 빠뜨리지 않은 검수된 표현을 골라요.</p></header>
    <div className="headline-paper"><PenLine aria-hidden="true" /><h2>제목 데스크</h2>{options.map((option) => <button key={option} aria-pressed={selected === option} onClick={() => onSelect(option)}>{selected === option ? '✓ 선택됨 · ' : ''}{option}</button>)}</div>
    <div className="action-row"><span>출처 이름은 결과 카드의 근거 목록에 따로 표시됩니다.</span><button className="button button-primary" disabled={!selected} onClick={onContinue}>결과 카드 완성하기<ArrowRight aria-hidden="true" /></button></div>
  </section>;
}
