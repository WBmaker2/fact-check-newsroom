import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { VerdictConference } from '../../src/components/VerdictConference';
import { packRegistry } from '../../src/content/registry';

describe('VerdictConference', () => {
  const caseFile = packRegistry[0].cases[0];

  it('explains the three simple actions required to solve step four', () => {
    render(<VerdictConference caseFile={caseFile} checkpoint="initial" feedback="" onSubmit={vi.fn()} onBack={vi.fn()} />);

    expect(screen.getByRole('heading', { name: '세 가지만 하면 돼요' })).toBeInTheDocument();
    expect(screen.getByText(caseFile.claimText)).toBeInTheDocument();
    expect(screen.getByText(caseFile.decisionClues.initial)).toBeInTheDocument();
    expect(screen.getByText('핵심 비교를 읽어요.')).toBeInTheDocument();
    expect(screen.getByText('판정 하나를 골라요.')).toBeInTheDocument();
    expect(screen.getByText('이유 하나를 골라요.')).toBeInTheDocument();
  });

  it('shows completion state as the learner selects a verdict and reasons', async () => {
    const user = userEvent.setup();
    render(<VerdictConference caseFile={caseFile} checkpoint="initial" feedback="" onSubmit={vi.fn()} onBack={vi.fn()} />);

    expect(screen.getByText('판정 선택 필요')).toBeInTheDocument();
    expect(screen.getByText('이유 선택 필요')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /맞아요.*자료로 확인됨/ }));
    expect(screen.getByText('판정 선택 완료')).toBeInTheDocument();
    await user.click(screen.getByText('도서관 원문에 어린이 열람실과 첫째 토요일이 모두 적혀 있어요.'));
    expect(screen.getByText('이유 선택 완료')).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(caseFile.reasonOptions.length);
  });
});
