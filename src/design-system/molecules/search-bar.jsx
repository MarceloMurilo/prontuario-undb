/**
 * SearchBar Component
 * Barra de busca com ícone
 */

import { Search } from 'lucide-react';

export function SearchBar({
  placeholder = 'Buscar...',
  value,
  onChange,
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full
          pl-10
          pr-4
          py-2
          border
          border-gray-300
          rounded-lg
          focus:border-blue-500
          focus:outline-none
          focus:ring-2
          focus:ring-blue-200
          transition-colors
          duration-200
        "
      />
    </div>
  );
}
