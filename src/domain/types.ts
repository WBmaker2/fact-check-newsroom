export type ClaimAtomKind = 'subject' | 'attribution' | 'measure' | 'time' | 'scope' | 'event' | 'relation' | 'opinion';
export type EvidenceRelation = 'supports' | 'contradicts' | 'limits' | 'irrelevant';
export type Verdict = 'confirmed' | 'partly-confirmed' | 'contradicted' | 'insufficient';
export type Checkpoint = 'initial' | 'final';

export interface ClaimAtom {
  id: string;
  kind: ClaimAtomKind;
  text: string;
  checkable: boolean;
  required: boolean;
}

export interface ReasonOption {
  id: string;
  label: string;
  correctAt: Checkpoint[];
}

export interface FactCheckCase {
  id: string;
  claimText: string;
  synthetic: true;
  atoms: ClaimAtom[];
  initialSourceIds: string[];
  lateSourceId: string;
  initialVerdict: Verdict;
  finalVerdict: Verdict;
  reasonOptions: ReasonOption[];
  headlineOptions: string[];
}

export interface SourceCard {
  id: string;
  caseId: string;
  synthetic: true;
  originId: string;
  derivedFromId?: string;
  publisherLabel: string;
  sourceType: string;
  publishedAt: string | null;
  periodLabel: string;
  methodSummary: string;
  scopeSummary: string;
  excerpt: string;
  accessibleSummary: string;
  assessments: Record<string, EvidenceRelation>;
  tableData?: { headers: string[]; rows: string[][] };
}

export interface FactCheckPack {
  id: string;
  subjectLabel: string;
  shortDescription: string;
  displayOrder: number;
  iconToken: 'file' | 'sun' | 'chart' | 'map';
  accentToken: 'red' | 'gold' | 'blue' | 'green';
  learningGoals: string[];
  cases: FactCheckCase[];
  sources: SourceCard[];
}

export interface DecisionSnapshot {
  checkpoint: Checkpoint;
  verdict: Verdict;
  selectedSourceIds: string[];
  reasonIds: string[];
}
