/**
 * Routes Configuration
 * Configuração de todas as rotas da aplicação
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { ProtectedRoute } from './protected-route';

// Pages
import Login from '../pages/auth/login';
import Register from '../pages/auth/register';
import MedicoDashboard from '../pages/medico/dashboard';
import MedicoAtendimentos from '../pages/medico/atendimentos';
import MedicoNovoAtendimento from '../pages/medico/novo-atendimento';
import MedicoPacientes from '../pages/medico/pacientes';
import MedicoAgenda from '../pages/medico/agenda';
import MedicoPacienteProntuario from '../pages/medico/paciente-prontuario';
import PacienteDashboard from '../pages/paciente/dashboard';
import PacienteProntuario from '../pages/paciente/prontuario';
import PacienteAgendamento from '../pages/paciente/agendamento';
import NotFound from '../pages/shared/not-found';

export function AppRoutes() {
  const { user } = useAuth();

  // Redireciona para o dashboard correto baseado no tipo de usuário
  const getDefaultRoute = () => {
    if (!user) return '/login';

    switch (user.tipo_usuario) {
      case 'medico':
        return '/medico/dashboard';
      case 'paciente':
        return '/paciente/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />

        {/* Protected Routes - Médico */}
        <Route
          path="/medico/dashboard"
          element={
            <ProtectedRoute allowedRoles={['medico']}>
              <MedicoDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medico/atendimentos"
          element={
            <ProtectedRoute allowedRoles={['medico']}>
              <MedicoAtendimentos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medico/atendimento/novo"
          element={
            <ProtectedRoute allowedRoles={['medico']}>
              <MedicoNovoAtendimento />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medico/pacientes"
          element={
            <ProtectedRoute allowedRoles={['medico']}>
              <MedicoPacientes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medico/agenda"
          element={
            <ProtectedRoute allowedRoles={['medico']}>
              <MedicoAgenda />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medico/paciente/:pacienteId/prontuario"
          element={
            <ProtectedRoute allowedRoles={['medico']}>
              <MedicoPacienteProntuario />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Paciente */}
        <Route
          path="/paciente/dashboard"
          element={
            <ProtectedRoute allowedRoles={['paciente']}>
              <PacienteDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/paciente/prontuario"
          element={
            <ProtectedRoute allowedRoles={['paciente']}>
              <PacienteProntuario />
            </ProtectedRoute>
          }
        />
        <Route
          path="/paciente/agendamento"
          element={
            <ProtectedRoute allowedRoles={['paciente']}>
              <PacienteAgendamento />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
