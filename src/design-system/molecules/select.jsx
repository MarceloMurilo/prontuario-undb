/**
 * Select Component
 * Campo de seleção dropdown
 */

export function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Selecione...',
  error,
  required = false,
  disabled = false,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          px-4
          py-2
          border
          rounded-lg
          transition-colors
          duration-200
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          focus:border-blue-500
          focus:outline-none
          focus:ring-2
          focus:ring-blue-200
        `}
      >
        {placeholder && (
          <option value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  );
}
