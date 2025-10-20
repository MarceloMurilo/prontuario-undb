/**
 * Login Page
 * Tela de login do sistema
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { AuthLayout } from '../../design-system/layouts/auth-layout';
import { FormField } from '../../design-system/molecules/form-field';
import { Button } from '../../design-system/atoms/button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, senha);

      // Redirecionar baseado no tipo de usuário
      const route = data.usuario.tipo_usuario === 'medico'
        ? '/medico/dashboard'
        : '/paciente/dashboard';

      navigate(route);
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Entrar
      </h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Email"
          type="email"
          name="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <FormField
          label="Senha"
          type="password"
          name="senha"
          placeholder="••••••••"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Entrar
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Não tem uma conta?{' '}
        <Link to="/registro" className="text-blue-600 hover:underline font-medium">
          Criar conta
        </Link>
      </p>
    </AuthLayout>
  );
}
