/**
 * Spinner Component
 * Indicador de carregamento
 */

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-3',
};

export function Spinner({ size = 'md', className = '' }) {
  const sizeStyles = sizes[size] || sizes.md;

  return (
    <div
      className={`
        ${sizeStyles}
        border-blue-600
        border-t-transparent
        rounded-full
        animate-spin
        ${className}
      `}
    />
  );
}
