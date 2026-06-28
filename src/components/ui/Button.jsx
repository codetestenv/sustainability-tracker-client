import React from 'react';
import Spinner from './Spinner';

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  className = '',
  ...props
}, ref) => {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    danger: 'btn-danger',
    success: 'btn-success',
    ghost: 'btn inline-flex text-gray-600 hover:bg-gray-100',
  }[variant] || 'btn-primary';

  const sizeClass = size === 'sm' ? 'btn-sm' : '';

  return (
    <button
      ref={ref}
      className={`${variantClass} ${sizeClass} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <Spinner size="sm" />
      ) : icon ? (
        <span className="text-base leading-none">{icon}</span>
      ) : null}
      {children}
      {iconRight && !loading && (
        <span className="text-base leading-none">{iconRight}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
