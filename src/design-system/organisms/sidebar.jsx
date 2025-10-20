/**
 * Sidebar Component
 * Menu lateral de navegação
 */

import { X } from 'lucide-react';

export function Sidebar({
  items = [],
  isOpen,
  onClose,
  currentPath = '',
}) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          lg:sticky
          top-0
          left-0
          h-screen
          bg-white
          border-r
          border-gray-200
          w-64
          transform
          transition-transform
          duration-200
          z-50
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <h2 className="font-semibold text-gray-800">Menu</h2>
          <button onClick={onClose} className="text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-2">
          {items.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <a
                key={item.path}
                href={item.path}
                className={`
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-lg
                  transition-colors
                  ${isActive
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {item.icon && <item.icon className="w-5 h-5" />}
                {item.label}
              </a>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
