import { CSSProperties, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

const PADDING_MAP = {
  none: '0',
  sm: '1rem',
  md: '1.5rem',
  lg: '2rem',
};

export default function Card({
  children,
  style,
  padding = 'md',
  hover = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        padding: PADDING_MAP[padding],
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        transition: hover ? 'all 0.2s ease' : undefined,
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
          e.currentTarget.style.borderColor = '#cbd5e1';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
          e.currentTarget.style.borderColor = '#e2e8f0';
        }
      }}
    >
      {children}
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: ReactNode;
  color?: 'blue' | 'green' | 'amber' | 'purple' | 'rose';
  compact?: boolean;
}

const COLOR_MAP = {
  blue: { bg: '#eff6ff', icon: '#3b82f6', border: '#bfdbfe' },
  green: { bg: '#f0fdf4', icon: '#22c55e', border: '#bbf7d0' },
  amber: { bg: '#fffbeb', icon: '#f59e0b', border: '#fde68a' },
  purple: { bg: '#faf5ff', icon: '#a855f7', border: '#e9d5ff' },
  rose: { bg: '#fff1f2', icon: '#f43f5e', border: '#fecdd3' },
};

export function KPICard({ title, value, change, icon, color = 'blue', compact = false }: KPICardProps) {
  const colors = COLOR_MAP[color];

  return (
    <Card hover style={compact ? { padding: '0.875rem' } : undefined}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{
            fontSize: compact ? '0.6875rem' : '0.8125rem',
            fontWeight: '500',
            color: '#64748b',
            marginBottom: compact ? '0.25rem' : '0.5rem',
          }}>
            {title}
          </p>
          <p style={{
            fontSize: compact ? '1.375rem' : '1.75rem',
            fontWeight: '700',
            color: '#0f172a',
            letterSpacing: '-0.025em',
            marginBottom: change ? (compact ? '0.25rem' : '0.5rem') : 0,
          }}>
            {value}
          </p>
          {change && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: compact ? '0.625rem' : '0.75rem',
              fontWeight: '500',
              color: change.trend === 'up' ? '#22c55e' : change.trend === 'down' ? '#ef4444' : '#64748b',
            }}>
              {change.trend === 'up' && '↑'}
              {change.trend === 'down' && '↓'}
              {change.value}%{compact ? '' : ' from last week'}
            </div>
          )}
        </div>
        {icon && (
          <div style={{
            width: compact ? '36px' : '44px',
            height: compact ? '36px' : '44px',
            borderRadius: compact ? '8px' : '10px',
            backgroundColor: colors.bg,
            border: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.icon,
          }}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
