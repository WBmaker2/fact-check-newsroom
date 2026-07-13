import { History, RotateCcw } from 'lucide-react';

interface Props { onHistory: () => void; onReset: () => void; canReset: boolean }
export function AppHeader({ onHistory, onReset, canReset }: Props) {
  return <header className="app-header">
    <div className="brand-mark" aria-hidden="true">F</div>
    <a className="brand" href="#main">팩트체크 편집국</a>
    <div className="header-actions">
      <button className="button button-quiet" onClick={onHistory}><History size={18} aria-hidden="true" />업데이트 내역</button>
      {canReset ? <button className="button button-quiet" onClick={onReset}><RotateCcw size={18} aria-hidden="true" />처음부터</button> : null}
    </div>
  </header>;
}
