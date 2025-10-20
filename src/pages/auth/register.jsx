/**
 * Register Page
 * Tela de registro de novos usuários
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { AuthLayout } from '../../design-system/layouts/auth-layout';
import { FormField } from '../../design-system/molecules/form-field';
import { Select } from '../../design-system/molecules/select';
import { Button } from '../../design-system/atoms/button';

export default function Register() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo_usuario: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout>
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Conta criada com sucesso!
          </h2>
          <p className="text-gray-600">
            Redirecionando para o login...
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Criar Conta
      </h2>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Nome Completo"
          name="nome"
          placeholder="João Silva"
          value={formData.nome}
          onChange={handleChange}
          required
        />

        <FormField
          label="Email"
          type="email"
          name="email"
          placeholder="seu@email.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <FormField
          label="Senha"
          type="password"
          name="senha"
          placeholder="••••••••"
          value={formData.senha}
          onChange={handleChange}
          required
        />

        <Select
          label="Tipo de Usuário"
          name="tipo_usuario"
          value={formData.tipo_usuario}
          onChange={handleChange}
          options={[
            { value: 'medico', label: 'Médico' },
            { value: 'paciente', label: 'Paciente' },
          ]}
          placeholder="Selecione..."
          required
        />

        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={loading}
        >
          Criar Conta
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Já tem uma conta?{' '}
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Entrar
        </Link>
      </p>
    </AuthLayout>
  );
}
