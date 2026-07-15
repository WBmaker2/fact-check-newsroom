import { Printer } from 'lucide-react';
import type { FactCheckPack } from '../domain/types';
import { Modal } from './Modal';

export function TeacherGuideDialog({ packs, onClose, onPrint }: { packs: FactCheckPack[]; onClose: () => void; onPrint: () => void }) {
  return <Modal title="교사용 수업 안내" onClose={onClose}>
    <div className="teacher-guide">
      <p className="teacher-guide-lead">초등 4~6학년이 사건 하나를 약 10~15분 동안 해결하는 활동입니다. 이름과 활동 결과는 저장하지 않습니다.</p>
      <section><h3>수업 진행 순서</h3><ol><li>느낌을 나타낸 말과 확인할 말을 나눕니다.</li><li>자료의 네 단서를 한눈에 확인합니다.</li><li>도움 되는 자료를 먼저 고르고 주장과 비교합니다.</li><li>판정 하나와 이유 하나를 고릅니다.</li><li>새 자료를 보고 다시 판단한 뒤 정확한 제목을 고릅니다.</li></ol></section>
      <section><h3>판정 발문</h3><dl><div><dt>맞아요</dt><dd>중요한 내용이 자료에 모두 있나요?</dd></div><div><dt>일부만 맞아요</dt><dd>숫자나 범위 중 다른 부분이 있나요?</dd></div><div><dt>아니에요</dt><dd>같은 대상과 때의 자료가 다르게 말하나요?</dd></div><div><dt>아직 몰라요</dt><dd>판단할 직접 자료가 충분한가요?</dd></div></dl></section>
      <section><h3>사건별 학습 목표</h3><ul>{packs.map((pack) => <li key={pack.id}><strong>{pack.subjectLabel}</strong> · {pack.learningGoals[0]}</li>)}</ul></section>
      <section><h3>힌트 원칙</h3><p>정답을 바로 말하기보다 “누가 만든 원문인가요?”, “숫자와 범위가 모두 같은가요?”처럼 다시 볼 위치를 알려 주세요.</p></section>
    </div>
    <div className="modal-actions"><button className="button button-secondary" onClick={onClose}>닫기</button><button className="button button-primary" onClick={onPrint}><Printer aria-hidden="true" />한 장으로 인쇄</button></div>
  </Modal>;
}
