import { changelog } from '../data/changelog';
import { Modal } from './Modal';

export function UpdateHistoryDialog({ onClose }: { onClose: () => void }) {
  return <Modal title="업데이트 내역" onClose={onClose}><div className="changelog">{changelog.map((item) => <article key={`${item.date}-${item.title}`}><time>{item.date}</time><div><h3>{item.title}</h3><p>{item.details}</p></div></article>)}</div></Modal>;
}
