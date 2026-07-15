import { useState } from 'react';
import { ArrowRight, CheckCircle2, HelpCircle, MinusCircle, PauseCircle, XCircle } from 'lucide-react';
import type { Checkpoint, FactCheckCase, Verdict } from '../domain/types';
import { PreviousButton } from './PreviousButton';

const verdicts: { id: Verdict; easyLabel: string; learningLabel: string; description: string; icon: typeof CheckCircle2 }[] = [
  { id: 'confirmed', easyLabel: '맞아요', learningLabel: '자료로 확인됨', description: '중요한 내용이 자료와 같아요.', icon: CheckCircle2 },
  { id: 'partly-confirmed', easyLabel: '일부만 맞아요', learningLabel: '일부만 확인됨', description: '일부는 같지만 숫자나 범위가 달라요.', icon: MinusCircle },
  { id: 'contradicted', easyLabel: '아니에요', learningLabel: '자료와 맞지 않음', description: '믿을 만한 자료가 다르게 말해요.', icon: XCircle },
  { id: 'insufficient', easyLabel: '아직 몰라요', learningLabel: '판단 보류', description: '확인할 자료가 모자라요.', icon: PauseCircle },
];

interface Props { caseFile: FactCheckCase; checkpoint: Checkpoint; initialVerdict?: Verdict; savedVerdict?: Verdict; savedReasonIds?: string[]; feedback: string; onSubmit: (verdict: Verdict, reasonIds: string[]) => void; onBack: () => void }
export function VerdictConference({ caseFile, checkpoint, initialVerdict, savedVerdict, savedReasonIds = [], feedback, onSubmit, onBack }: Props) {
  const [verdict, setVerdict] = useState<Verdict | null>(savedVerdict ?? null);
  const [reasonIds, setReasonIds] = useState<string[]>(savedReasonIds);
  return <section className="page-section" data-od-id={`${checkpoint}-verdict`}>
    <header className="section-heading"><p className="context-line">4 · {checkpoint === 'initial' ? '첫 번째 판단' : '다시 판단하기'}</p><h1>{checkpoint === 'initial' ? '이 주장은 맞을까요?' : '새 자료를 보고 다시 판단해 보세요.'}</h1><p>쉬운 판정 하나와 이유 하나를 고르세요.</p></header>
    {initialVerdict ? <div className="previous-verdict"><span>첫 번째 판단</span><strong>{verdicts.find((item) => item.id === initialVerdict)?.easyLabel}</strong><p>새 자료를 보기 전 생각과 비교해 볼 수 있어요.</p></div> : null}
    <section className="verdict-guide" aria-labelledby="verdict-guide-title">
      <div><p className="context-line">해결 순서</p><h2 id="verdict-guide-title">세 가지만 하면 돼요</h2></div>
      <div className="verdict-claim"><span>확인할 주장</span><blockquote>{caseFile.claimText}</blockquote></div>
      <div className="verdict-clue"><strong>핵심 비교</strong><p>{caseFile.decisionClues[checkpoint]}</p></div>
      <ol>
        <li><span>1</span><div><strong>핵심 비교를 읽어요.</strong><p>자료와 주장에서 같은 점과 다른 점을 찾아요.</p></div></li>
        <li><span>2</span><div><strong>판정 하나를 골라요.</strong><p>큰 글씨로 적힌 쉬운 말을 먼저 읽어요.</p></div></li>
        <li><span>3</span><div><strong>이유 하나를 골라요.</strong><p>자료에 실제로 적힌 내용인지 확인해요.</p></div></li>
      </ol>
    </section>
    <fieldset className="verdict-grid"><legend className="sr-only">판정 선택</legend>{verdicts.map(({ id, easyLabel, learningLabel, description, icon: Icon }) => <button type="button" key={id} aria-label={`${easyLabel} (${learningLabel})`} aria-pressed={verdict === id} onClick={() => setVerdict(id)}><Icon aria-hidden="true" /><strong>{easyLabel}</strong><small>{learningLabel}</small><span>{description}</span></button>)}</fieldset>
    <fieldset className="reason-list"><legend>왜 그렇게 생각했나요? 하나만 고르세요.</legend>{caseFile.reasonOptions.map((reason) => <label key={reason.id}><input type="radio" name={`${checkpoint}-reason`} checked={reasonIds[0] === reason.id} onChange={() => setReasonIds([reason.id])} /><span>{reason.label}</span></label>)}</fieldset>
    <div className="verdict-selection-status" role="status" aria-live="polite" aria-label="판정 진행 상태"><span data-complete={Boolean(verdict)}>{verdict ? '판정 선택 완료' : '판정 선택 필요'}</span><span data-complete={reasonIds.length === 1}>{reasonIds.length === 1 ? '이유 선택 완료' : '이유 선택 필요'}</span></div>
    {feedback ? <div className="feedback" role="status"><HelpCircle aria-hidden="true" />{feedback}</div> : null}
    <div className="action-row"><PreviousButton onClick={onBack} label={checkpoint === 'initial' ? '자료 다시 보기' : '새 자료 다시 보기'} /><span>틀려도 괜찮아요. 힌트를 보고 다시 고를 수 있어요.</span><button className="button button-primary" disabled={!verdict || reasonIds.length !== 1} onClick={() => verdict && onSubmit(verdict, reasonIds)}>{checkpoint === 'initial' ? '첫 판단 확인하기' : '마지막 판단 확인하기'}<ArrowRight aria-hidden="true" /></button></div>
  </section>;
}
