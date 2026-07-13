import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { VerdictConference } from '../../src/components/VerdictConference';
import { packRegistry } from '../../src/content/registry';

describe('VerdictConference', () => {
  const caseFile = packRegistry[0].cases[0];

  it('explains the three actions required to solve step four', () => {
    render(<VerdictConference caseFile={caseFile} checkpoint="initial" feedback="" onSubmit={vi.fn()} />);

    expect(screen.getByRole('heading', { name: '4단계는 이렇게 해결하세요' })).toBeInTheDocument();
    expect(screen.getByText(caseFile.claimText)).toBeInTheDocument();
    expect(screen.getByText('근거와 주장 조각을 비교하세요.')).toBeInTheDocument();
    expect(screen.getByText('판정 하나를 선택하세요.')).toBeInTheDocument();
    expect(screen.getByText('판정 이유를 모두 선택하고 확정하세요.')).toBeInTheDocument();
  });

  it('shows completion state as the learner selects a verdict and reasons', async () => {
    const user = userEvent.setup();
    render(<VerdictConference caseFile={caseFile} checkpoint="initial" feedback="" onSubmit={vi.fn()} />);

    expect(screen.getByText('판정 선택 필요')).toBeInTheDocument();
    expect(screen.getByText('이유 선택 필요')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /자료로 확인됨/ }));
    expect(screen.getByText('판정 선택 완료')).toBeInTheDocument();
    await user.click(screen.getByText('원문 안내의 대상·날짜·예정 상태가 주장과 일치해요.'));
    expect(screen.getByText('이유 1개 선택됨')).toBeInTheDocument();
  });
});
