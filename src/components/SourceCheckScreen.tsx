import { ArrowRight, CheckCircle2 } from 'lucide-react';
import type { SourceCard } from '../domain/types';
import { SourceCardView } from './SourceCard';
import { dimensions } from './source-dimensions';

interface Props { sources: SourceCard[]; inspected: Record<string, string[]>; onInspect: (sourceId: string, dimension: string) => void; onContinue: () => void; late?: boolean }
export function SourceCheckScreen({ sources, inspected, onInspect, onContinue, late = false }: Props) {
  const completed = sources.filter((source) => dimensions.every((dimension) => inspected[source.id]?.includes(dimension.id))).length;
  return <section className="page-section source-check-screen" data-od-id={late ? 'late-source' : 'source-check'}>
    <header className="section-heading"><p className="context-line">2 · {late ? '후속 제보' : '출처 점검'}</p><h1>{late ? '새 자료가 도착했습니다.' : '출처의 네 가지 정보를 확인하세요.'}</h1><p>출처 이름만 보지 말고 작성 주체, 날짜, 방법, 범위를 모두 펼쳐 보세요.</p></header>
    <div className="workspace-layout"><div className="source-grid">{sources.map((source) => <SourceCardView key={source.id} source={source} inspected={inspected[source.id] ?? []} onInspect={(dimension) => onInspect(source.id, dimension)} />)}</div>
      <aside className="editor-rail"><CheckCircle2 aria-hidden="true" /><h2>진행 체크</h2><strong>{completed}/{sources.length}개 자료 완료</strong><p>네 렌즈를 모두 확인해야 근거 관계를 분류할 수 있어요.</p><button className="button button-primary" disabled={completed !== sources.length} onClick={onContinue}>{late ? '새 자료의 근거 관계 보기' : '이 자료로 근거 분류하기'}<ArrowRight aria-hidden="true" /></button></aside>
    </div>
  </section>;
}
