import { ArrowRight, FileSearch, Scale, ShieldCheck } from 'lucide-react';

export function StartScreen({ onStart }: { onStart: () => void }) {
  return <section className="start-screen" data-od-id="start-screen">
    <div className="start-copy">
      <p className="context-line">초등 5~6학년 · 사건 하나 약 18~22분</p>
      <h1>팩트체크 편집국</h1>
      <p className="start-lead">주장을 조각내고, 출처를 살피고, 근거가 허용하는 만큼만 제목을 쓰는 편집 활동입니다.</p>
      <div className="synthetic-notice"><ShieldCheck aria-hidden="true" /><div><strong>교육용 가상 사건 · 합성 자료</strong><span>실제 뉴스나 인물을 판정하지 않으며, 화면에 제시된 자료만 검토합니다.</span></div></div>
      <button className="button button-primary button-large" onClick={onStart}>편집 회의 시작<ArrowRight aria-hidden="true" /></button>
    </div>
    <div className="editorial-principles" aria-label="편집국 원칙">
      <article><FileSearch aria-hidden="true" /><h2>출처를 펼쳐 봐요</h2><p>누가, 언제, 어떤 방법과 범위로 만든 자료인지 확인합니다.</p></article>
      <article><Scale aria-hidden="true" /><h2>판정은 네 가지예요</h2><p>확인, 일부 확인, 자료와 불일치, 근거 부족을 구별합니다.</p></article>
      <p className="privacy-note">이름을 묻거나 활동을 저장하지 않습니다. 새로고침하면 처음으로 돌아갑니다.</p>
    </div>
  </section>;
}
