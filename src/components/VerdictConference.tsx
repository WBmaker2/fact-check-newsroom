import { useState } from 'react';
import { ArrowRight, CheckCircle2, HelpCircle, MinusCircle, PauseCircle, XCircle } from 'lucide-react';
import type { Checkpoint, FactCheckCase, Verdict } from '../domain/types';

const verdicts: { id: Verdict; label: string; description: string; icon: typeof CheckCircle2 }[] = [
  { id: 'confirmed', label: '자료로 확인됨', description: '핵심 주장이 적합한 자료로 지지돼요.', icon: CheckCircle2 },
  { id: 'partly-confirmed', label: '일부만 확인됨', description: '일부는 지지되지만 수치나 범위가 달라요.', icon: MinusCircle },
  { id: 'contradicted', label: '제시된 자료와 맞지 않음', description: '같은 대상과 시점의 직접 자료가 반박해요.', icon: XCircle },
  { id: 'insufficient', label: '근거가 부족해 판단 보류', description: '직접 자료나 적합한 범위가 부족해요.', icon: PauseCircle },
];

interface Props { caseFile: FactCheckCase; checkpoint: Checkpoint; initialVerdict?: Verdict; feedback: string; onSubmit: (verdict: Verdict, reasonIds: string[]) => void }
export function VerdictConference({ caseFile, checkpoint, initialVerdict, feedback, onSubmit }: Props) {
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [reasonIds, setReasonIds] = useState<string[]>([]);
  return <section className="page-section" data-od-id={`${checkpoint}-verdict`}>
    <header className="section-heading"><p className="context-line">4 · {checkpoint === 'initial' ? '첫 판정 회의' : '재검토 회의'}</p><h1>{checkpoint === 'initial' ? '현재 자료로 어떤 판정이 알맞을까요?' : '새 자료 뒤에도 첫 판정을 유지할까요?'}</h1><p>아래 해결 순서대로 판정 하나와 알맞은 이유를 고르세요.</p></header>
    {initialVerdict ? <div className="previous-verdict"><span>첫 판정</span><strong>{verdicts.find((item) => item.id === initialVerdict)?.label}</strong><p>첫 판단은 보존되며 새 자료로 덮어쓰지 않습니다.</p></div> : null}
    <section className="verdict-guide" aria-labelledby="verdict-guide-title">
      <div><p className="context-line">해결 순서</p><h2 id="verdict-guide-title">4단계는 이렇게 해결하세요</h2></div>
      <div className="verdict-claim"><span>지금 판정할 주장</span><blockquote>{caseFile.claimText}</blockquote></div>
      <ol>
        <li><span>1</span><div><strong>근거와 주장 조각을 비교하세요.</strong><p>3단계에서 고른 근거가 핵심 주장 전체를 지지하는지, 일부만 지지하는지, 반박하는지, 아직 부족한지 생각하세요.</p></div></li>
        <li><span>2</span><div><strong>판정 하나를 선택하세요.</strong><p>아래 네 판정의 설명을 읽고 가장 알맞은 하나를 누르세요.</p></div></li>
        <li><span>3</span><div><strong>판정 이유를 모두 선택하고 확정하세요.</strong><p>선택한 판정을 뒷받침하는 이유를 빠짐없이 고른 뒤 확정 버튼을 누르세요.</p></div></li>
      </ol>
    </section>
    <fieldset className="verdict-grid"><legend className="sr-only">판정 선택</legend>{verdicts.map(({ id, label, description, icon: Icon }) => <button type="button" key={id} aria-pressed={verdict === id} onClick={() => setVerdict(id)}><Icon aria-hidden="true" /><strong>{label}</strong><span>{description}</span></button>)}</fieldset>
    <fieldset className="reason-list"><legend>그렇게 판단한 이유를 모두 고르세요.</legend>{caseFile.reasonOptions.map((reason) => <label key={reason.id}><input type="checkbox" checked={reasonIds.includes(reason.id)} onChange={() => setReasonIds((current) => current.includes(reason.id) ? current.filter((id) => id !== reason.id) : [...current, reason.id])} /><span>{reason.label}</span></label>)}</fieldset>
    <div className="verdict-selection-status" role="status" aria-live="polite" aria-label="판정 진행 상태"><span data-complete={Boolean(verdict)}>{verdict ? '판정 선택 완료' : '판정 선택 필요'}</span><span data-complete={reasonIds.length > 0}>{reasonIds.length > 0 ? `이유 ${reasonIds.length}개 선택됨` : '이유 선택 필요'}</span></div>
    {feedback ? <div className="feedback" role="status"><HelpCircle aria-hidden="true" />{feedback}</div> : null}
    <div className="action-row"><span>이 판정은 제시된 가상 자료 기준입니다.</span><button className="button button-primary" disabled={!verdict || reasonIds.length === 0} onClick={() => verdict && onSubmit(verdict, reasonIds)}>{checkpoint === 'initial' ? '첫 판정 확정하기' : '최종 판정 확정하기'}<ArrowRight aria-hidden="true" /></button></div>
  </section>;
}
