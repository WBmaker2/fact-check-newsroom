import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { App } from '../../src/app/App';

describe('App shell and intake', () => {
  it('explains the synthetic evidence boundary on the start screen', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: '팩트체크 편집국' })).toBeInTheDocument();
    expect(screen.getAllByText(/교육용 가상 사건/).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: '편집 회의 시작' })).toBeEnabled();
  });

  it('opens the update history as a named dialog', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '업데이트 내역' }));
    expect(screen.getByRole('dialog', { name: '업데이트 내역' })).toBeInTheDocument();
    expect(screen.getAllByText('2026. 7. 14.')).toHaveLength(4);
    expect(screen.getByText('4단계 판정 안내 개선')).toBeInTheDocument();
    expect(screen.getByText('근거 분류 자료 다시 보기')).toBeInTheDocument();
    expect(screen.getByText('공개 배포 준비')).toBeInTheDocument();
  });

  it('renders four subject desks from the registry', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '편집 회의 시작' }));
    expect(screen.getAllByRole('button', { name: /사건 선택/ })).toHaveLength(4);
  });

  it('keeps opinion atoms outside truth selection', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '편집 회의 시작' }));
    await user.click(screen.getByRole('button', { name: /국어·매체 사건 선택/ }));
    expect(screen.getByRole('button', { name: /반가운 소식/ })).toBeDisabled();
    expect(screen.getByText(/의견이라 자료로 참·거짓을 가리지 않아요/)).toBeInTheDocument();
  });
});
