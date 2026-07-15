import { History, RotateCcw } from 'lucide-react';

interface Props { onHistory: () => void; onReset: () => void; canReset: boolean }
export function AppHeader({ onHistory, onReset, canReset }: Props) {
  return <header className="app-header">
    <div className="brand-mark" aria-hidden="true">F</div>
    <a className="brand" href="#main">팩트체크 편집국</a>
    <div className="header-actions">
      <button className="button button-quiet" onClick={onHistory} aria-label="업데이트 내역"><History size={18} aria-hidden="true" /><span className="header-action-label">업데이트 내역</span></button>
      {canReset ? <button className="button button-quiet reset-trigger" onClick={onReset} aria-label="처음부터"><RotateCcw size={18} aria-hidden="true" /><span className="header-action-label">처음부터</span></button> : null}
    </div>
  </header>;
}
