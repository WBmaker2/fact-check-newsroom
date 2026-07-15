import type { Stage } from '../app/newsroom-reducer';

const steps = [
  { label: '확인할 말', stages: ['claim'] },
  { label: '자료 보기', stages: ['sources', 'late-source'] },
  { label: '자료 비교', stages: ['evidence', 'late-evidence'] },
  { label: '판단하기', stages: ['initial', 'final'] },
  { label: '제목 고르기', stages: ['headline', 'result'] },
];

export function StepProgress({ stage }: { stage: Stage }) {
  const currentIndex = Math.max(0, steps.findIndex((step) => step.stages.includes(stage)));
  return <nav className="step-progress" aria-label="활동 단계">
    <div className="mobile-step-summary"><span>{currentIndex + 1}/{steps.length}</span><strong>{steps[currentIndex].label}</strong><progress max={steps.length} value={currentIndex + 1} aria-label={`${steps.length}단계 중 ${currentIndex + 1}단계`} /></div>
    <ol>
    {steps.map((step, index) => {
      const active = step.stages.includes(stage);
      return <li key={step.label} className={active ? 'active' : ''} aria-current={active ? 'step' : undefined}><span>{index + 1}</span>{step.label}</li>;
    })}
    </ol>
  </nav>;
}
