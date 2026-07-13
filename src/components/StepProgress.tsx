import type { Stage } from '../app/newsroom-reducer';

const steps = [
  { label: '주장 해부', stages: ['claim'] },
  { label: '출처 점검', stages: ['sources', 'late'] },
  { label: '근거 분류', stages: ['evidence'] },
  { label: '판정', stages: ['initial', 'final'] },
  { label: '결과 정리', stages: ['headline', 'result'] },
];

export function StepProgress({ stage }: { stage: Stage }) {
  return <nav className="step-progress" aria-label="활동 단계"><ol>
    {steps.map((step, index) => {
      const active = step.stages.includes(stage);
      return <li key={step.label} className={active ? 'active' : ''} aria-current={active ? 'step' : undefined}><span>{index + 1}</span>{step.label}</li>;
    })}
  </ol></nav>;
}
