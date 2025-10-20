/**
 * NotFound Page
 * Página 404
 */

import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../../design-system/organisms/empty-state';
import { Home } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <EmptyState
        icon={Home}
        title="Página não encontrada"
        description="A página que você está procurando não existe ou foi movida."
        action={() => navigate('/')}
        actionLabel="Voltar ao início"
      />
    </div>
  );
}
