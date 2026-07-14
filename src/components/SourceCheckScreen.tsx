import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { SourceCard } from '../domain/types';
import { SourceCardView } from './SourceCard';
import { dimensions } from './source-dimensions';

interface Props { sources: SourceCard[]; inspected: Record<string, string[]>; onInspect: (sourceId: string, dimension: string) => void; onContinue: () => void; late?: boolean }
export function SourceCheckScreen({ sources, inspected, onInspect, onContinue, late = false }: Props) {
  const completed = sources.filter((source) => dimensions.every((dimension) => inspected[source.id]?.includes(dimension.id))).length;
  return <section className="page-section source-check-screen" data-od-id={late ? 'late-source' : 'source-check'}>
    <header className="section-heading"><p className="context-line">2 · {late ? '새 자료' : '자료 살펴보기'}</p><h1>{late ? '새 자료가 도착했어요.' : '자료에서 네 가지 단서를 찾아보세요.'}</h1><p>버튼을 눌러 누가, 언제, 어떻게, 어디에 대해 만든 자료인지 확인하세요.</p></header>
    <div className="workspace-layout"><div className="source-grid">{sources.map((source) => <SourceCardView key={source.id} source={source} inspected={inspected[source.id] ?? []} onInspect={(dimension) => onInspect(source.id, dimension)} />)}</div>
      <aside className="editor-rail"><CheckCircle2 aria-hidden="true" /><h2>얼마나 했나요?</h2><strong>{completed}/{sources.length}개 자료 완료</strong><p>자료마다 네 가지 단서를 모두 열어 보세요.</p><button className="button button-primary" disabled={completed !== sources.length} onClick={onContinue}>{late ? '새 자료 비교하기' : '자료와 주장 비교하기'}<ArrowRight aria-hidden="true" /></button></aside>
    </div>
  </section>;
}
