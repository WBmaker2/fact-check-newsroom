import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { SourceCard } from '../domain/types';
import { SourceCardView } from './SourceCard';
import { dimensions } from './source-dimensions';
import { PreviousButton } from './PreviousButton';

interface Props { sources: SourceCard[]; inspected: Record<string, string[]>; onInspectMany: (sourceId: string, dimensionIds: string[]) => void; onContinue: () => void; onBack: () => void; learningNote?: string; late?: boolean }
export function SourceCheckScreen({ sources, inspected, onInspectMany, onContinue, onBack, learningNote, late = false }: Props) {
  const completed = sources.filter((source) => dimensions.every((dimension) => inspected[source.id]?.includes(dimension.id))).length;
  return <section className="page-section source-check-screen" data-od-id={late ? 'late-source' : 'source-check'}>
    <header className="section-heading"><p className="context-line">2 · {late ? '새 자료' : '자료 살펴보기'}</p><h1>{late ? '새 자료가 도착했어요.' : '자료에서 네 가지 단서를 찾아보세요.'}</h1><p>버튼을 눌러 누가, 언제, 어떻게, 어디에 대해 만든 자료인지 확인하세요.</p></header>
    {learningNote ? <aside className="learning-feedback"><strong>첫 판단을 잘 마쳤어요.</strong><p>{learningNote}</p></aside> : null}
    <div className="workspace-layout"><div className="source-grid">{sources.map((source, index) => <SourceCardView key={source.id} source={source} positionLabel={`자료 ${index + 1}/${sources.length}`} inspected={inspected[source.id] ?? []} onInspectAll={() => onInspectMany(source.id, dimensions.map((dimension) => dimension.id))} />)}</div>
      <aside className="editor-rail"><CheckCircle2 aria-hidden="true" /><h2>얼마나 했나요?</h2><strong>{completed}/{sources.length}개 자료 완료</strong><p>자료마다 버튼 한 번으로 네 가지 단서를 확인하세요.</p><button className="button button-primary" disabled={completed !== sources.length} onClick={onContinue}>{late ? '새 자료 비교하기' : '자료와 주장 비교하기'}<ArrowRight aria-hidden="true" /></button></aside>
    </div>
    <div className="stage-back-row"><PreviousButton onClick={onBack} label={late ? '첫 판단 다시 보기' : '확인할 말 다시 보기'} /></div>
  </section>;
}
