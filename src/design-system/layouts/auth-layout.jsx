/**
 * AuthLayout
 * Layout para páginas de autenticação (login, registro)
 */

export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            🏥 Prontuário UNDB
          </h1>
          <p className="text-gray-600">
            Sistema de Gestão de Prontuários Médicos
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          © 2025 Prontuário UNDB. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}
