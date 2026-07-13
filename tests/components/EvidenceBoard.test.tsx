import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EvidenceBoard } from '../../src/components/EvidenceBoard';
import { packRegistry } from '../../src/content/registry';

describe('EvidenceBoard', () => {
  it('repeats each source excerpt while learners classify evidence', () => {
    const pack = packRegistry[0];
    const caseFile = pack.cases[0];
    const sources = pack.sources.filter((source) => caseFile.initialSourceIds.includes(source.id));

    render(
      <EvidenceBoard
        atoms={caseFile.atoms}
        sources={sources}
        classified={{}}
        selectedSources={[]}
        onClassify={vi.fn()}
        onToggleEvidence={vi.fn()}
        onContinue={vi.fn()}
      />,
    );

    expect(screen.getAllByText('자료 내용 다시 보기')).toHaveLength(sources.length);
    for (const source of sources) expect(screen.getByText(source.excerpt)).toBeInTheDocument();
  });
});
