/**
 * ProtectedRoute
 * Rota protegida que requer autenticação
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { Spinner } from '../design-system/atoms/spinner';

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Verificar se o usuário tem permissão para acessar
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.tipo_usuario)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
