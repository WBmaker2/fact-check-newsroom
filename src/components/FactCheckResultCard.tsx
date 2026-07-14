import { Check, FileCheck2, RotateCcw } from 'lucide-react';
import type { FactCheckCase, SourceCard, Verdict } from '../domain/types';

const labels: Record<Verdict, string> = { confirmed: '맞아요 · 자료로 확인됨', 'partly-confirmed': '일부만 맞아요 · 일부만 확인됨', contradicted: '아니에요 · 자료와 맞지 않음', insufficient: '아직 몰라요 · 판단 보류' };
interface Props { caseFile: FactCheckCase; sources: SourceCard[]; first: Verdict; final: Verdict; headline: string; selectedSourceIds: string[]; onRestart: () => void }
export function FactCheckResultCard({ caseFile, sources, first, final, headline, selectedSourceIds, onRestart }: Props) {
  const cited = sources.filter((source) => selectedSourceIds.includes(source.id)).filter((source, index, all) => all.findIndex((item) => item.originId === source.originId) === index);
  return <section className="page-section result-page" data-od-id="result-card"><header className="section-heading"><p className="context-line">활동 완료</p><h1>팩트체크 결과 카드</h1><p>주장과 자료를 차근차근 비교한 결과예요.</p></header>
    <article className="result-card"><div className="result-seal"><FileCheck2 aria-hidden="true" /><span>교육용 가상 자료</span></div><p className="result-kicker">정확한 제목</p><h2>{headline}</h2><div className="result-claim"><span>원래 주장</span><p>{caseFile.claimText}</p></div><div className="verdict-compare"><div><span>첫 판정</span><strong>{labels[first]}</strong></div><div><span>최종 판정</span><strong>{labels[final]}</strong></div></div><div className="citations"><h3>판정에 사용한 고유 원자료</h3><ul>{cited.map((source) => <li key={source.id}><Check aria-hidden="true" /><span><strong>{source.publisherLabel}</strong>{source.sourceType} · {source.periodLabel}</span></li>)}</ul></div><p className="result-boundary">이 결과는 화면에 제시된 교육용 합성 자료를 기준으로 합니다. 실제 세상의 최종 진실을 뜻하지 않습니다.</p></article>
    <div className="action-row"><span>결과 카드는 읽기 전용이며 저장하거나 공유하지 않아요.</span><button className="button button-secondary" onClick={onRestart}><RotateCcw aria-hidden="true" />다른 사건 해 보기</button></div>
  </section>;
}
