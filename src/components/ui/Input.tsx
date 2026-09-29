import React from 'react';
import type { InputProps } from '../../types';
import './Input.css';

export const Input: React.FC<InputProps> = ({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  required = false,
  value,
  onChange,
  error,
  disabled = false,
  rows = 4,
  maxLength,
  className = '',
  autoComplete,
  inputMode,
  pattern,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`input-wrapper ${className}`}>
      <label htmlFor={id} className="input-label">
        {label}
        {required && <span className="input-required">*</span>}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={`input-field input-textarea ${error ? 'input-error' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete={autoComplete}
          inputMode={inputMode}
          pattern={pattern}
          className={`input-field ${error ? 'input-error' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}

      {error && (
        <span id={`${id}-error`} className="input-error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
