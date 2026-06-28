import React from 'react';

const Input = React.forwardRef(({
  label,
  error,
  required,
  hint,
  className = '',
  type = 'text',
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`form-input ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
      {error && (
        <p className="form-error">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export const Select = React.forwardRef(({
  label,
  error,
  required,
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={`form-select ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="form-error">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export const Textarea = React.forwardRef(({
  label,
  error,
  required,
  rows = 3,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={`form-input resize-none ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`}
        {...props}
      />
      {error && (
        <p className="form-error">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Input;
