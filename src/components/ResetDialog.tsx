import { Modal } from './Modal';
export function ResetDialog({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return <Modal title="처음부터 다시 시작할까요?" onClose={onCancel}><p>현재 사건의 선택과 판정은 저장되지 않고 모두 사라집니다.</p><div className="modal-actions"><button className="button button-secondary" onClick={onCancel}>계속 편집하기</button><button className="button button-danger" onClick={onConfirm}>처음부터 시작</button></div></Modal>;
}
