import { CSSProperties, ReactNode, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
}

const VARIANT_STYLES = {
  primary: {
    base: {
      backgroundColor: '#0284c7',
      color: 'white',
      border: 'none',
    },
    hover: {
      backgroundColor: '#0369a1',
    },
  },
  secondary: {
    base: {
      backgroundColor: 'white',
      color: '#374151',
      border: '1px solid #d1d5db',
    },
    hover: {
      backgroundColor: '#f9fafb',
      borderColor: '#9ca3af',
    },
  },
  ghost: {
    base: {
      backgroundColor: 'transparent',
      color: '#475569',
      border: 'none',
    },
    hover: {
      backgroundColor: '#f1f5f9',
    },
  },
  danger: {
    base: {
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
    },
    hover: {
      backgroundColor: '#dc2626',
    },
  },
};

const SIZE_STYLES = {
  sm: {
    padding: '0.375rem 0.75rem',
    fontSize: '0.8125rem',
    gap: '0.375rem',
  },
  md: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    gap: '0.5rem',
  },
  lg: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    gap: '0.625rem',
  },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  loading = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const variantStyle = VARIANT_STYLES[variant];
  const sizeStyle = SIZE_STYLES[size];

  const baseStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: sizeStyle.gap,
    padding: sizeStyle.padding,
    fontSize: sizeStyle.fontSize,
    fontWeight: '500',
    borderRadius: '8px',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s ease',
    opacity: disabled || loading ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    ...variantStyle.base,
    ...style,
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      style={baseStyle}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, variantStyle.hover);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          Object.assign(e.currentTarget.style, variantStyle.base);
        }
      }}
    >
      {loading && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ animation: 'spin 1s linear infinite' }}
        >
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
      )}
      {icon && iconPosition === 'left' && !loading && icon}
      {children}
      {icon && iconPosition === 'right' && !loading && icon}
    </button>
  );
}

// Icon-only button
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
}

const ICON_BUTTON_SIZES = {
  sm: { size: '28px', iconSize: '14px' },
  md: { size: '36px', iconSize: '18px' },
  lg: { size: '44px', iconSize: '22px' },
};

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  tooltip,
  disabled,
  style,
  ...props
}: IconButtonProps) {
  const variantStyle = VARIANT_STYLES[variant];
  const sizeStyle = ICON_BUTTON_SIZES[size];

  return (
    <button
      {...props}
      disabled={disabled}
      title={tooltip}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: sizeStyle.size,
        height: sizeStyle.size,
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.15s ease',
        opacity: disabled ? 0.5 : 1,
        ...variantStyle.base,
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, variantStyle.hover);
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          Object.assign(e.currentTarget.style, variantStyle.base);
        }
      }}
    >
      {icon}
    </button>
  );
}
