import { ArrowLeft } from 'lucide-react';

export function PreviousButton({ onClick, label = '이전 단계' }: { onClick: () => void; label?: string }) {
  return <button className="button button-quiet previous-button" onClick={onClick}><ArrowLeft aria-hidden="true" />{label}</button>;
}
