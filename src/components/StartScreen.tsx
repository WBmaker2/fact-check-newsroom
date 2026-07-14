import { ArrowRight, FileSearch, Scale, ShieldCheck } from 'lucide-react';

export function StartScreen({ onStart }: { onStart: () => void }) {
  return <section className="start-screen" data-od-id="start-screen">
    <div className="start-copy">
      <p className="context-line">초등 4~6학년 · 사건 하나 약 10~15분</p>
      <h1>팩트체크 편집국</h1>
      <p className="start-lead">자료를 읽고, 주장이 맞는지 살펴보고, 정확한 제목을 만드는 활동입니다.</p>
      <div className="synthetic-notice"><ShieldCheck aria-hidden="true" /><div><strong>교육용 가상 사건 · 합성 자료</strong><span>실제 뉴스나 인물을 판정하지 않으며, 화면에 제시된 자료만 검토합니다.</span></div></div>
      <button className="button button-primary button-large" onClick={onStart}>편집 회의 시작<ArrowRight aria-hidden="true" /></button>
    </div>
    <div className="editorial-principles" aria-label="편집국 원칙">
      <article><FileSearch aria-hidden="true" /><h2>자료를 살펴봐요</h2><p>누가, 언제, 어떻게 만든 자료인지 버튼을 눌러 확인해요.</p></article>
      <article><Scale aria-hidden="true" /><h2>쉬운 말로 판단해요</h2><p>맞아요, 일부만 맞아요, 아니에요, 아직 몰라요 중에서 골라요.</p></article>
      <p className="privacy-note">이름을 묻거나 활동을 저장하지 않습니다. 새로고침하면 처음으로 돌아갑니다.</p>
    </div>
  </section>;
}
