import type { Checkpoint, EvidenceRelation, Verdict } from '../domain/types';

export type Stage = 'start' | 'desk' | 'claim' | 'sources' | 'evidence' | 'initial' | 'late-source' | 'late-evidence' | 'final' | 'headline' | 'result';
type RelationMap = Record<string, Record<string, EvidenceRelation>>;

interface Snapshot {
  checkpoint: Checkpoint;
  verdict: Verdict;
  reasonIds: string[];
  selectedSourceIds: string[];
  relations: RelationMap;
}

export interface NewsroomState {
  stage: Stage;
  packId: string | null;
  selectedAtomIds: string[];
  inspectedDimensions: Record<string, string[]>;
  relations: RelationMap;
  selectedSourceIds: string[];
  initialDecision: Snapshot | null;
  finalDecision: Snapshot | null;
  headline: string;
  feedback: string;
}

export const initialState: NewsroomState = {
  stage: 'start', packId: null, selectedAtomIds: [], inspectedDimensions: {}, relations: {}, selectedSourceIds: [], initialDecision: null, finalDecision: null, headline: '', feedback: '',
};

type Action =
  | { type: 'GO'; stage: Stage }
  | { type: 'SELECT_PACK'; packId: string }
  | { type: 'TOGGLE_ATOM'; atomId: string }
  | { type: 'INSPECT_MANY'; sourceId: string; dimensions: string[] }
  | { type: 'CLASSIFY'; sourceId: string; atomId: string; relation: EvidenceRelation }
  | { type: 'TOGGLE_EVIDENCE'; sourceId: string }
  | { type: 'SAVE_DECISION'; checkpoint: Checkpoint; verdict: Verdict; reasonIds: string[] }
  | { type: 'SET_HEADLINE'; headline: string }
  | { type: 'FEEDBACK'; message: string }
  | { type: 'BACK' }
  | { type: 'RESET' };

const cloneRelations = (relations: RelationMap): RelationMap => Object.fromEntries(Object.entries(relations).map(([sourceId, atoms]) => [sourceId, { ...atoms }]));

export function newsroomReducer(state: NewsroomState, action: Action): NewsroomState {
  switch (action.type) {
    case 'GO': return { ...state, stage: action.stage, feedback: '' };
    case 'SELECT_PACK': return { ...initialState, stage: 'claim', packId: action.packId };
    case 'TOGGLE_ATOM': return { ...state, selectedAtomIds: state.selectedAtomIds.includes(action.atomId) ? state.selectedAtomIds.filter((id) => id !== action.atomId) : [...state.selectedAtomIds, action.atomId] };
    case 'INSPECT_MANY': {
      const current = state.inspectedDimensions[action.sourceId] ?? [];
      const next = [...new Set([...current, ...action.dimensions])];
      return { ...state, inspectedDimensions: { ...state.inspectedDimensions, [action.sourceId]: next } };
    }
    case 'CLASSIFY': return { ...state, relations: { ...state.relations, [action.sourceId]: { ...state.relations[action.sourceId], [action.atomId]: action.relation } } };
    case 'TOGGLE_EVIDENCE': {
      if (state.selectedSourceIds.includes(action.sourceId)) return { ...state, selectedSourceIds: state.selectedSourceIds.filter((id) => id !== action.sourceId) };
      if (state.selectedSourceIds.length >= 2) return { ...state, feedback: '판정에 사용할 자료는 2개까지 고를 수 있어요.' };
      return { ...state, selectedSourceIds: [...state.selectedSourceIds, action.sourceId], feedback: '' };
    }
    case 'SAVE_DECISION': {
      const snapshot = { checkpoint: action.checkpoint, verdict: action.verdict, reasonIds: [...action.reasonIds], selectedSourceIds: [...state.selectedSourceIds], relations: cloneRelations(state.relations) };
      return action.checkpoint === 'initial' ? { ...state, initialDecision: snapshot, selectedSourceIds: [], stage: 'late-source', feedback: '' } : { ...state, finalDecision: snapshot, stage: 'headline', feedback: '' };
    }
    case 'SET_HEADLINE': return { ...state, headline: action.headline };
    case 'FEEDBACK': return { ...state, feedback: action.message };
    case 'BACK': {
      if (state.stage === 'late-source' && state.initialDecision) return { ...state, stage: 'initial', selectedSourceIds: [...state.initialDecision.selectedSourceIds], relations: cloneRelations(state.initialDecision.relations), feedback: '' };
      if (state.stage === 'headline' && state.finalDecision) return { ...state, stage: 'final', selectedSourceIds: [...state.finalDecision.selectedSourceIds], relations: cloneRelations(state.finalDecision.relations), feedback: '' };
      const previous: Partial<Record<Stage, Stage>> = {
        desk: 'start', claim: 'desk', sources: 'claim', evidence: 'sources', initial: 'evidence',
        'late-evidence': 'late-source', final: 'late-evidence', result: 'headline',
      };
      return previous[state.stage] ? { ...state, stage: previous[state.stage]!, feedback: '' } : state;
    }
    case 'RESET': return initialState;
  }
}
