/**
 * Textarea Component
 * Campo de texto multi-linha
 */

export function Textarea({
  label,
  name,
  placeholder = '',
  value,
  onChange,
  rows = 4,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        className={`
          px-4
          py-2
          border
          rounded-lg
          transition-colors
          duration-200
          resize-none
          ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          focus:border-blue-500
          focus:outline-none
          focus:ring-2
        `}
        {...props}
      />

      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
}
