/**
 * Avatar Component
 * Componente de avatar/foto de perfil
 */

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export function Avatar({ src, alt, name, size = 'md', className = '' }) {
  const sizeStyles = sizes[size] || sizes.md;
  const baseStyles = 'rounded-full flex items-center justify-center font-medium';

  // Se não tiver imagem, mostra iniciais
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={`${baseStyles} ${sizeStyles} ${className} object-cover`}
      />
    );
  }

  return (
    <div className={`${baseStyles} ${sizeStyles} ${className} bg-blue-500 text-white`}>
      {getInitials(name)}
    </div>
  );
}
