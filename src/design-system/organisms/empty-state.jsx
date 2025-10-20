/**
 * EmptyState Component
 * Estado vazio para listas/tabelas
 */

import { FileX } from 'lucide-react';
import { Button } from '../atoms/button';

export function EmptyState({
  icon: Icon = FileX,
  title = 'Nenhum item encontrado',
  description = '',
  action,
  actionLabel = 'Criar novo',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>

      <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>

      {description && (
        <p className="text-gray-600 mb-6 max-w-sm">{description}</p>
      )}

      {action && (
        <Button onClick={action}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
