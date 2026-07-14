import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

    expect(screen.getAllByText('자료 내용')).toHaveLength(sources.length);
    for (const source of sources) expect(screen.getByText(source.excerpt)).toBeInTheDocument();
  });

  it('points to a mismatched row before moving to the verdict', async () => {
    const user = userEvent.setup();
    const pack = packRegistry[0];
    const caseFile = pack.cases[0];
    const sources = pack.sources.filter((source) => caseFile.initialSourceIds.includes(source.id));
    const classified = Object.fromEntries(sources.map((source) => [source.id, { ...source.assessments }])) as Record<string, typeof sources[number]['assessments']>;
    classified[sources[0].id][caseFile.atoms.find((atom) => atom.checkable)!.id] = 'contradicts';
    const onContinue = vi.fn();

    render(<EvidenceBoard atoms={caseFile.atoms} sources={sources} classified={classified} selectedSources={[sources[0].id]} onClassify={vi.fn()} onToggleEvidence={vi.fn()} onContinue={onContinue} />);
    await user.click(screen.getByRole('button', { name: '첫 번째 판단하기' }));

    expect(onContinue).not.toHaveBeenCalled();
    expect(screen.getByText('자료 문장과 다시 비교해 보세요.')).toBeInTheDocument();
  });
});
