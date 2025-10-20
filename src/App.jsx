/**
 * App Component
 * Componente raiz da aplicação
 */

import { AuthProvider } from './context/auth-context';
import { AppRoutes } from './routes';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
