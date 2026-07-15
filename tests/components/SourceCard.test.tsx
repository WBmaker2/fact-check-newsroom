import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SourceCardView } from '../../src/components/SourceCard';
import { packRegistry } from '../../src/content/registry';

describe('SourceCardView', () => {
  const source = packRegistry[0].sources[0];
  it('reveals publisher date method and scope together without a trust score', async () => {
    const user = userEvent.setup();
    const onInspectAll = vi.fn();
    const { rerender } = render(<SourceCardView source={source} inspected={[]} onInspectAll={onInspectAll} />);
    expect(screen.getByText(source.publisherLabel)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: '네 가지 단서 한눈에 보기' }));
    expect(onInspectAll).toHaveBeenCalledOnce();
    rerender(<SourceCardView source={source} inspected={['publisher', 'date', 'method', 'scope']} onInspectAll={onInspectAll} />);
    expect(screen.getByText('언제 만들었나요?')).toBeInTheDocument();
    expect(screen.getByText(source.methodSummary)).toBeInTheDocument();
    expect(screen.queryByText(/신뢰 점수|별점/)).not.toBeInTheDocument();
  });

  it('labels a repost as sharing the original source', () => {
    const repost = packRegistry[0].sources[1];
    render(<SourceCardView source={repost} inspected={[]} onInspectAll={vi.fn()} />);
    expect(screen.getByText(/같은 원자료를 옮긴 자료/)).toBeInTheDocument();
  });
});
