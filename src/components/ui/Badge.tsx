import { CSSProperties } from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';
  size?: 'sm' | 'md';
  dot?: boolean;
  style?: CSSProperties;
}

const VARIANT_STYLES = {
  default: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
    borderColor: '#e2e8f0',
  },
  success: {
    backgroundColor: '#f0fdf4',
    color: '#15803d',
    borderColor: '#bbf7d0',
  },
  warning: {
    backgroundColor: '#fffbeb',
    color: '#b45309',
    borderColor: '#fde68a',
  },
  error: {
    backgroundColor: '#fef2f2',
    color: '#dc2626',
    borderColor: '#fecaca',
  },
  info: {
    backgroundColor: '#eff6ff',
    color: '#1d4ed8',
    borderColor: '#bfdbfe',
  },
  purple: {
    backgroundColor: '#faf5ff',
    color: '#7c3aed',
    borderColor: '#e9d5ff',
  },
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  style,
}: BadgeProps) {
  const variantStyle = VARIANT_STYLES[variant];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: size === 'sm' ? '0.125rem 0.5rem' : '0.25rem 0.625rem',
        borderRadius: '6px',
        fontSize: size === 'sm' ? '0.6875rem' : '0.75rem',
        fontWeight: '500',
        backgroundColor: variantStyle.backgroundColor,
        color: variantStyle.color,
        border: `1px solid ${variantStyle.borderColor}`,
        ...style,
      }}
    >
      {dot && (
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: variantStyle.color,
          }}
        />
      )}
      {children}
    </span>
  );
}

// Stage badge specifically for candidate pipeline
interface StageBadgeProps {
  stage: string;
  count?: number;
  compact?: boolean;
}

const STAGE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  applied: { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' },
  screening: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  interviewing: { bg: '#fef3c7', text: '#b45309', border: '#fde68a' },
  offered: { bg: '#faf5ff', text: '#7c3aed', border: '#e9d5ff' },
  hired: { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  rejected: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
};

// Shorten stage names for compact mode
const COMPACT_STAGE_NAMES: Record<string, string> = {
  applied: 'App',
  screening: 'Scr',
  interviewing: 'Int',
  offered: 'Off',
  hired: 'Hire',
  rejected: 'Rej',
};

export function StageBadge({ stage, count, compact = false }: StageBadgeProps) {
  const colors = STAGE_COLORS[stage.toLowerCase()] || STAGE_COLORS.applied;
  const displayStage = compact ? (COMPACT_STAGE_NAMES[stage.toLowerCase()] || stage) : stage;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: compact ? '0.25rem' : '0.5rem',
        padding: compact ? '0.25rem 0.5rem' : '0.375rem 0.75rem',
        borderRadius: compact ? '6px' : '8px',
        fontSize: compact ? '0.6875rem' : '0.8125rem',
        fontWeight: '500',
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        textTransform: 'capitalize',
      }}
    >
      {displayStage}
      {count !== undefined && (
        <span
          style={{
            padding: '0.125rem 0.375rem',
            backgroundColor: colors.text,
            color: 'white',
            borderRadius: '4px',
            fontSize: '0.6875rem',
            fontWeight: '600',
          }}
        >
          {count}
        </span>
      )}
    </span>
  );
}

// Awaiting action indicator
export function AwaitingBadge() {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.25rem 0.625rem',
        borderRadius: '6px',
        fontSize: '0.6875rem',
        fontWeight: '600',
        backgroundColor: '#fef3c7',
        color: '#b45309',
        border: '1px solid #fde68a',
        animation: 'pulse 2s infinite',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#f59e0b',
        }}
      />
      Awaiting Action
    </span>
  );
}
