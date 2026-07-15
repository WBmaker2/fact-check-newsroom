import { ArrowRight, PenLine } from 'lucide-react';
import { PreviousButton } from './PreviousButton';

export function HeadlineComposer({ options, selected, onSelect, onContinue, onBack, learningNote }: { options: string[]; selected: string; onSelect: (headline: string) => void; onContinue: () => void; onBack: () => void; learningNote: string }) {
  return <section className="page-section" data-od-id="headline-composer"><header className="section-heading"><p className="context-line">5 · 정확한 제목 만들기</p><h1>자료와 맞는 제목을 고르세요.</h1><p>자료에 나온 대상과 숫자를 그대로 담은 제목을 찾아보세요.</p></header>
    <aside className="learning-feedback"><strong>마지막 판단을 잘 마쳤어요.</strong><p>{learningNote}</p></aside>
    <div className="headline-paper"><PenLine aria-hidden="true" /><h2>제목 고르기</h2>{options.map((option) => <button key={option} aria-pressed={selected === option} onClick={() => onSelect(option)}>{selected === option ? '✓ 선택됨 · ' : ''}{option}</button>)}</div>
    <div className="action-row"><PreviousButton onClick={onBack} label="마지막 판단 다시 보기" /><span>자료 이름은 결과 카드에 따로 나와요.</span><button className="button button-primary" disabled={!selected} onClick={onContinue}>결과 카드 보기<ArrowRight aria-hidden="true" /></button></div>
  </section>;
}
