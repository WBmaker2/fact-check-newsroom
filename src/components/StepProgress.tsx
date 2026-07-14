import type { Stage } from '../app/newsroom-reducer';

const steps = [
  { label: '확인할 말', stages: ['claim'] },
  { label: '자료 보기', stages: ['sources', 'late'] },
  { label: '자료 비교', stages: ['evidence'] },
  { label: '판단하기', stages: ['initial', 'final'] },
  { label: '제목 고르기', stages: ['headline', 'result'] },
];

export function StepProgress({ stage }: { stage: Stage }) {
  return <nav className="step-progress" aria-label="활동 단계"><ol>
    {steps.map((step, index) => {
      const active = step.stages.includes(stage);
      return <li key={step.label} className={active ? 'active' : ''} aria-current={active ? 'step' : undefined}><span>{index + 1}</span>{step.label}</li>;
    })}
  </ol></nav>;
}
