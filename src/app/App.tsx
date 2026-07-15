import { useEffect, useReducer, useRef, useState } from 'react';
import { AppHeader } from '../components/AppHeader';
import { ClaimAnalyzer } from '../components/ClaimAnalyzer';
import { DeskPicker } from '../components/DeskPicker';
import { EvidenceBoard } from '../components/EvidenceBoard';
import { FactCheckResultCard } from '../components/FactCheckResultCard';
import { HeadlineComposer } from '../components/HeadlineComposer';
import { ResetDialog } from '../components/ResetDialog';
import { SourceCheckScreen } from '../components/SourceCheckScreen';
import { StartScreen } from '../components/StartScreen';
import { StepProgress } from '../components/StepProgress';
import { TeacherGuideDialog } from '../components/TeacherGuideDialog';
import { UpdateHistoryDialog } from '../components/UpdateHistoryDialog';
import { VerdictConference } from '../components/VerdictConference';
import { packRegistry } from '../content/registry';
import { evaluateDecision } from '../domain/verdict-engine';
import type { Verdict } from '../domain/types';
import { dimensions } from '../components/source-dimensions';
import { initialState, newsroomReducer } from './newsroom-reducer';
import '../styles/tokens.css';
import '../styles/layout.css';
import '../styles/components.css';

const verdictLearningNote = (verdict: Verdict, clue: string) => {
  const explanation: Record<Verdict, string> = {
    confirmed: '중요한 내용이 모두 자료와 같아서 ‘맞아요’예요. 일부만 같을 때나 자료가 없을 때 쓰는 판정과 달라요.',
    'partly-confirmed': '일부는 같지만 숫자나 범위가 달라서 ‘일부만 맞아요’예요.',
    contradicted: '같은 대상과 때를 다룬 자료가 다르게 말해서 ‘아니에요’예요.',
    insufficient: '확인할 자료가 모자라서 ‘아직 몰라요’예요. 틀렸다는 뜻은 아니에요.',
  };
  return `${clue} ${explanation[verdict]}`;
};

export function App() {
  const [state, dispatch] = useReducer(newsroomReducer, initialState);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [teacherOpen, setTeacherOpen] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);
  const pack = packRegistry.find((item) => item.id === state.packId);
  const caseFile = pack?.cases[0];
  const viewKey = state.stage;

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    main.focus({ preventScroll: true });
    const frame = window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' }));
    return () => window.cancelAnimationFrame(frame);
  }, [viewKey]);

  const openModal = (kind: 'history' | 'reset' | 'teacher') => { returnFocus.current = document.activeElement as HTMLElement; if (kind === 'history') setHistoryOpen(true); else if (kind === 'reset') setResetOpen(true); else setTeacherOpen(true); };
  const closeModal = (kind: 'history' | 'reset' | 'teacher') => { if (kind === 'history') setHistoryOpen(false); else if (kind === 'reset') setResetOpen(false); else setTeacherOpen(false); window.setTimeout(() => returnFocus.current?.focus(), 0); };
  const reset = () => { dispatch({ type: 'RESET' }); setResetOpen(false); };
  const printSection = (target: 'teacher' | 'result') => { document.body.dataset.printTarget = target; window.print(); delete document.body.dataset.printTarget; };

  const submitDecision = (checkpoint: 'initial' | 'final', verdict: Verdict, reasonIds: string[]) => {
    if (!caseFile || !pack) return;
    const sources = checkpoint === 'initial' ? pack.sources.filter((source) => caseFile.initialSourceIds.includes(source.id)) : pack.sources;
    const inspected = sources.filter((source) => (state.inspectedDimensions[source.id]?.length ?? 0) === dimensions.length).map((source) => source.id);
    const result = evaluateDecision({ caseFile, checkpoint, sources, relations: state.relations, selectedSourceIds: state.selectedSourceIds, inspectedSourceIds: inspected, verdict, reasonIds });
    if (!result.matched) dispatch({ type: 'FEEDBACK', message: result.feedback });
    else dispatch({ type: 'SAVE_DECISION', checkpoint, verdict, reasonIds });
  };

  let screen: React.ReactNode;
  if (state.stage === 'start') screen = <StartScreen onStart={() => dispatch({ type: 'GO', stage: 'desk' })} onTeacherGuide={() => openModal('teacher')} />;
  else if (state.stage === 'desk') screen = <DeskPicker packs={packRegistry} onSelect={(packId) => dispatch({ type: 'SELECT_PACK', packId })} onBack={() => dispatch({ type: 'BACK' })} />;
  else if (!pack || !caseFile) screen = <p role="alert">사건 자료를 불러오지 못했습니다.</p>;
  else if (state.stage === 'claim') screen = <ClaimAnalyzer caseFile={caseFile} selected={state.selectedAtomIds} onToggle={(atomId) => dispatch({ type: 'TOGGLE_ATOM', atomId })} onContinue={() => dispatch({ type: 'GO', stage: 'sources' })} onBack={() => dispatch({ type: 'BACK' })} />;
  else if (state.stage === 'sources') screen = <SourceCheckScreen sources={pack.sources.filter((source) => caseFile.initialSourceIds.includes(source.id))} inspected={state.inspectedDimensions} onInspectMany={(sourceId, dimensionIds) => dispatch({ type: 'INSPECT_MANY', sourceId, dimensions: dimensionIds })} onContinue={() => dispatch({ type: 'GO', stage: 'evidence' })} onBack={() => dispatch({ type: 'BACK' })} />;
  else if (state.stage === 'evidence') screen = <EvidenceBoard atoms={caseFile.atoms} sources={pack.sources.filter((source) => caseFile.initialSourceIds.includes(source.id))} classified={state.relations} selectedSources={state.selectedSourceIds} onClassify={(sourceId, atomId, relation) => dispatch({ type: 'CLASSIFY', sourceId, atomId, relation })} onToggleEvidence={(sourceId) => dispatch({ type: 'TOGGLE_EVIDENCE', sourceId })} onContinue={() => dispatch({ type: 'GO', stage: 'initial' })} onBack={() => dispatch({ type: 'BACK' })} />;
  else if (state.stage === 'initial') screen = <VerdictConference caseFile={caseFile} checkpoint="initial" savedVerdict={state.initialDecision?.verdict} savedReasonIds={state.initialDecision?.reasonIds} feedback={state.feedback} onSubmit={(verdict, reasonIds) => submitDecision('initial', verdict, reasonIds)} onBack={() => dispatch({ type: 'BACK' })} />;
  else if (state.stage === 'late-source') screen = <SourceCheckScreen late sources={pack.sources.filter((source) => source.id === caseFile.lateSourceId)} inspected={state.inspectedDimensions} onInspectMany={(sourceId, dimensionIds) => dispatch({ type: 'INSPECT_MANY', sourceId, dimensions: dimensionIds })} onContinue={() => dispatch({ type: 'GO', stage: 'late-evidence' })} onBack={() => dispatch({ type: 'BACK' })} learningNote={verdictLearningNote(state.initialDecision!.verdict, caseFile.decisionClues.initial)} />;
  else if (state.stage === 'late-evidence') screen = <EvidenceBoard late atoms={caseFile.atoms} sources={pack.sources.filter((source) => source.id === caseFile.lateSourceId)} classified={state.relations} selectedSources={state.selectedSourceIds} onClassify={(sourceId, atomId, relation) => dispatch({ type: 'CLASSIFY', sourceId, atomId, relation })} onToggleEvidence={(sourceId) => dispatch({ type: 'TOGGLE_EVIDENCE', sourceId })} onContinue={() => dispatch({ type: 'GO', stage: 'final' })} onBack={() => dispatch({ type: 'BACK' })} />;
  else if (state.stage === 'final') screen = <VerdictConference caseFile={caseFile} checkpoint="final" initialVerdict={state.initialDecision?.verdict} savedVerdict={state.finalDecision?.verdict} savedReasonIds={state.finalDecision?.reasonIds} feedback={state.feedback} onSubmit={(verdict, reasonIds) => submitDecision('final', verdict, reasonIds)} onBack={() => dispatch({ type: 'BACK' })} />;
  else if (state.stage === 'headline') screen = <HeadlineComposer options={caseFile.headlineOptions} selected={state.headline} onSelect={(headline) => dispatch({ type: 'SET_HEADLINE', headline })} onContinue={() => dispatch({ type: 'GO', stage: 'result' })} onBack={() => dispatch({ type: 'BACK' })} learningNote={verdictLearningNote(state.finalDecision!.verdict, caseFile.decisionClues.final)} />;
  else screen = <FactCheckResultCard caseFile={caseFile} sources={pack.sources} first={state.initialDecision!.verdict} final={state.finalDecision!.verdict} headline={state.headline} selectedSourceIds={[...(state.initialDecision?.selectedSourceIds ?? []), ...(state.finalDecision?.selectedSourceIds ?? [])]} onRestart={reset} onBack={() => dispatch({ type: 'BACK' })} onPrint={() => printSection('result')} />;

  return <div className="app-shell"><AppHeader onHistory={() => openModal('history')} onReset={() => openModal('reset')} canReset={state.stage !== 'start'} />{!['start', 'desk'].includes(state.stage) ? <StepProgress stage={state.stage} /> : null}<div className="global-notice">교육용 가상 사건 · 합성 자료</div><main id="main" ref={mainRef} tabIndex={-1}>{screen}</main><footer>이 판정은 화면에 제시된 가상 자료를 기준으로 합니다.</footer>{historyOpen ? <UpdateHistoryDialog onClose={() => closeModal('history')} /> : null}{teacherOpen ? <TeacherGuideDialog packs={packRegistry} onClose={() => closeModal('teacher')} onPrint={() => printSection('teacher')} /> : null}{resetOpen ? <ResetDialog onCancel={() => closeModal('reset')} onConfirm={reset} /> : null}</div>;
}
