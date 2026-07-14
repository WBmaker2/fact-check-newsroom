import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SourceCardView } from '../../src/components/SourceCard';
import { packRegistry } from '../../src/content/registry';

describe('SourceCardView', () => {
  const source = packRegistry[0].sources[0];
  it('shows publisher date method and scope without a trust score', () => {
    render(<SourceCardView source={source} inspected={[]} onInspect={vi.fn()} />);
    expect(screen.getByText(source.publisherLabel)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /언제 만들었나요/ })).toBeInTheDocument();
    expect(screen.queryByText(/신뢰 점수|별점/)).not.toBeInTheDocument();
  });

  it('labels a repost as sharing the original source', () => {
    const repost = packRegistry[0].sources[1];
    render(<SourceCardView source={repost} inspected={[]} onInspect={vi.fn()} />);
    expect(screen.getByText(/같은 원자료를 옮긴 자료/)).toBeInTheDocument();
  });
});
