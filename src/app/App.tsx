import { useReducer, useRef, useState } from 'react';
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

export function App() {
  const [state, dispatch] = useReducer(newsroomReducer, initialState);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [lateEvidence, setLateEvidence] = useState(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const pack = packRegistry.find((item) => item.id === state.packId);
  const caseFile = pack?.cases[0];

  const openModal = (kind: 'history' | 'reset') => { returnFocus.current = document.activeElement as HTMLElement; if (kind === 'history') setHistoryOpen(true); else setResetOpen(true); };
  const closeModal = (kind: 'history' | 'reset') => { if (kind === 'history') setHistoryOpen(false); else setResetOpen(false); window.setTimeout(() => returnFocus.current?.focus(), 0); };
  const reset = () => { dispatch({ type: 'RESET' }); setLateEvidence(false); setResetOpen(false); };

  const submitDecision = (checkpoint: 'initial' | 'final', verdict: Verdict, reasonIds: string[]) => {
    if (!caseFile || !pack) return;
    const sources = checkpoint === 'initial' ? pack.sources.filter((source) => caseFile.initialSourceIds.includes(source.id)) : pack.sources;
    const inspected = sources.filter((source) => (state.inspectedDimensions[source.id]?.length ?? 0) === dimensions.length).map((source) => source.id);
    const result = evaluateDecision({ caseFile, checkpoint, sources, relations: state.relations, selectedSourceIds: state.selectedSourceIds, inspectedSourceIds: inspected, verdict, reasonIds });
    if (!result.matched) dispatch({ type: 'FEEDBACK', message: result.feedback });
    else dispatch({ type: 'SAVE_DECISION', checkpoint, verdict, reasonIds });
  };

  let screen: React.ReactNode;
  if (state.stage === 'start') screen = <StartScreen onStart={() => dispatch({ type: 'GO', stage: 'desk' })} />;
  else if (state.stage === 'desk') screen = <DeskPicker packs={packRegistry} onSelect={(packId) => dispatch({ type: 'SELECT_PACK', packId })} />;
  else if (!pack || !caseFile) screen = <p role="alert">사건 자료를 불러오지 못했습니다.</p>;
  else if (state.stage === 'claim') screen = <ClaimAnalyzer caseFile={caseFile} selected={state.selectedAtomIds} onToggle={(atomId) => dispatch({ type: 'TOGGLE_ATOM', atomId })} onContinue={() => dispatch({ type: 'GO', stage: 'sources' })} />;
  else if (state.stage === 'sources') screen = <SourceCheckScreen sources={pack.sources.filter((source) => caseFile.initialSourceIds.includes(source.id))} inspected={state.inspectedDimensions} onInspect={(sourceId, dimension) => dispatch({ type: 'INSPECT', sourceId, dimension })} onContinue={() => dispatch({ type: 'GO', stage: 'evidence' })} />;
  else if (state.stage === 'evidence') screen = <EvidenceBoard atoms={caseFile.atoms} sources={pack.sources.filter((source) => caseFile.initialSourceIds.includes(source.id))} classified={state.relations} selectedSources={state.selectedSourceIds} onClassify={(sourceId, atomId, relation) => dispatch({ type: 'CLASSIFY', sourceId, atomId, relation })} onToggleEvidence={(sourceId) => dispatch({ type: 'TOGGLE_EVIDENCE', sourceId })} onContinue={() => dispatch({ type: 'GO', stage: 'initial' })} />;
  else if (state.stage === 'initial') screen = <VerdictConference caseFile={caseFile} checkpoint="initial" feedback={state.feedback} onSubmit={(verdict, reasonIds) => submitDecision('initial', verdict, reasonIds)} />;
  else if (state.stage === 'late' && !lateEvidence) screen = <SourceCheckScreen late sources={pack.sources.filter((source) => source.id === caseFile.lateSourceId)} inspected={state.inspectedDimensions} onInspect={(sourceId, dimension) => dispatch({ type: 'INSPECT', sourceId, dimension })} onContinue={() => setLateEvidence(true)} />;
  else if (state.stage === 'late') screen = <EvidenceBoard late atoms={caseFile.atoms} sources={pack.sources.filter((source) => source.id === caseFile.lateSourceId)} classified={state.relations} selectedSources={state.selectedSourceIds} onClassify={(sourceId, atomId, relation) => dispatch({ type: 'CLASSIFY', sourceId, atomId, relation })} onToggleEvidence={(sourceId) => dispatch({ type: 'TOGGLE_EVIDENCE', sourceId })} onContinue={() => dispatch({ type: 'GO', stage: 'final' })} />;
  else if (state.stage === 'final') screen = <VerdictConference caseFile={caseFile} checkpoint="final" initialVerdict={state.initialDecision?.verdict} feedback={state.feedback} onSubmit={(verdict, reasonIds) => submitDecision('final', verdict, reasonIds)} />;
  else if (state.stage === 'headline') screen = <HeadlineComposer options={caseFile.headlineOptions} selected={state.headline} onSelect={(headline) => dispatch({ type: 'SET_HEADLINE', headline })} onContinue={() => dispatch({ type: 'GO', stage: 'result' })} />;
  else screen = <FactCheckResultCard caseFile={caseFile} sources={pack.sources} first={state.initialDecision!.verdict} final={state.finalDecision!.verdict} headline={state.headline} selectedSourceIds={[...(state.initialDecision?.selectedSourceIds ?? []), ...(state.finalDecision?.selectedSourceIds ?? [])]} onRestart={reset} />;

  return <div className="app-shell"><AppHeader onHistory={() => openModal('history')} onReset={() => openModal('reset')} canReset={state.stage !== 'start'} />{!['start', 'desk'].includes(state.stage) ? <StepProgress stage={state.stage} /> : null}<div className="global-notice">교육용 가상 사건 · 합성 자료</div><main id="main">{screen}</main><footer>이 판정은 화면에 제시된 가상 자료를 기준으로 합니다.</footer>{historyOpen ? <UpdateHistoryDialog onClose={() => closeModal('history')} /> : null}{resetOpen ? <ResetDialog onCancel={() => closeModal('reset')} onConfirm={reset} /> : null}</div>;
}
