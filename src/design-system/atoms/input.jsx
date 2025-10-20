/**
 * Input Component
 * Campo de entrada de texto reutilizável
 */

export function Input({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  disabled = false,
  error = false,
  fullWidth = true,
  className = '',
  ...props
}) {
  const baseStyles = 'px-4 py-2 border rounded-lg transition-colors duration-200';
  const normalStyles = 'border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200';
  const errorStyles = 'border-red-500 focus:border-red-600 focus:ring-red-200';
  const disabledStyles = 'bg-gray-100 cursor-not-allowed';
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${error ? errorStyles : normalStyles}
        ${disabled ? disabledStyles : ''}
        ${widthStyles}
        ${className}
      `}
      {...props}
    />
  );
}
