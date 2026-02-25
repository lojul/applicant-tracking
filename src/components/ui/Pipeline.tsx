'use client';

interface PipelineStage {
  name: string;
  count: number;
  percentage?: number;
}

interface PipelineProps {
  stages: PipelineStage[];
  showFunnel?: boolean;
}

const STAGE_COLORS = [
  { bg: '#f1f5f9', bar: '#64748b', text: '#475569' },
  { bg: '#eff6ff', bar: '#3b82f6', text: '#1d4ed8' },
  { bg: '#fef3c7', bar: '#f59e0b', text: '#b45309' },
  { bg: '#faf5ff', bar: '#a855f7', text: '#7c3aed' },
  { bg: '#f0fdf4', bar: '#22c55e', text: '#15803d' },
];

export default function Pipeline({ stages, showFunnel = false }: PipelineProps) {
  const maxCount = Math.max(...stages.map((s) => s.count));

  if (showFunnel) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {stages.map((stage, index) => {
          const colors = STAGE_COLORS[index % STAGE_COLORS.length];
          const widthPercent = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;

          return (
            <div key={stage.name} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '100px', fontSize: '0.8125rem', color: '#64748b', fontWeight: '500' }}>
                {stage.name}
              </div>
              <div style={{ flex: 1, position: 'relative', height: '28px' }}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '100%',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '6px',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${widthPercent}%`,
                    backgroundColor: colors.bar,
                    borderRadius: '6px',
                    transition: 'width 0.5s ease',
                    minWidth: stage.count > 0 ? '24px' : '0',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.8125rem',
                    fontWeight: '600',
                    color: widthPercent > 20 ? 'white' : colors.text,
                  }}
                >
                  {stage.count}
                </div>
              </div>
              {stage.percentage !== undefined && (
                <div style={{ width: '50px', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'right' }}>
                  {stage.percentage}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal chip pipeline
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {stages.map((stage, index) => {
        const colors = STAGE_COLORS[index % STAGE_COLORS.length];

        return (
          <div
            key={stage.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0.875rem',
              backgroundColor: colors.bg,
              borderRadius: '8px',
              border: `1px solid ${colors.bar}20`,
            }}
          >
            <span style={{ fontSize: '0.8125rem', fontWeight: '500', color: colors.text }}>
              {stage.name}
            </span>
            <span
              style={{
                padding: '0.125rem 0.5rem',
                backgroundColor: colors.bar,
                color: 'white',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: '600',
              }}
            >
              {stage.count}
            </span>
            {index < stages.length - 1 && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke={colors.bar}
                strokeWidth="2"
                style={{ marginLeft: '0.25rem' }}
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Mini pipeline for table rows
interface MiniPipelineProps {
  current: string;
  stages?: string[];
}

export function MiniPipeline({ current, stages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'] }: MiniPipelineProps) {
  const currentIndex = stages.findIndex((s) => s.toLowerCase() === current.toLowerCase());

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
      {stages.map((stage, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={stage} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              title={stage}
              style={{
                width: isCurrent ? 'auto' : '8px',
                height: '8px',
                padding: isCurrent ? '0.25rem 0.5rem' : 0,
                borderRadius: isCurrent ? '4px' : '50%',
                backgroundColor: isCompleted ? '#0284c7' : '#e2e8f0',
                fontSize: '0.6875rem',
                fontWeight: '500',
                color: 'white',
              }}
            >
              {isCurrent && stage}
            </div>
            {index < stages.length - 1 && (
              <div
                style={{
                  width: '12px',
                  height: '2px',
                  backgroundColor: index < currentIndex ? '#0284c7' : '#e2e8f0',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
