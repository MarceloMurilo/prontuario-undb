/**
 * Agenda - Médico
 * Visualização de agendamentos e consultas
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { agendamentoService } from '../../services';
import { DashboardLayout } from '../../design-system/layouts/dashboard-layout';
import { Card, CardTitle } from '../../design-system/organisms/card';
import { Badge } from '../../design-system/atoms/badge';
import { Button } from '../../design-system/atoms/button';
import { Spinner } from '../../design-system/atoms/spinner';
import { EmptyState } from '../../design-system/organisms/empty-state';
import { Users, Calendar, FileText, Activity, Clock } from 'lucide-react';

const sidebarItems = [
  { path: '/medico/dashboard', label: 'Dashboard', icon: Activity },
  { path: '/medico/atendimentos', label: 'Atendimentos', icon: FileText },
  { path: '/medico/pacientes', label: 'Pacientes', icon: Users },
  { path: '/medico/agenda', label: 'Agenda', icon: Calendar },
];

export default function MedicoAgenda() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAgenda();
  }, [user]);

  const carregarAgenda = async () => {
    try {
      if (user?.id) {
        const data = await agendamentoService.getByMedico(user.id);
        setAgendamentos(data);
      }
    } catch (error) {
      console.error('Erro ao carregar agenda:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = async (id) => {
    if (!confirm('Deseja realmente cancelar este agendamento?')) return;

    try {
      await agendamentoService.cancel(id);
      carregarAgenda();
    } catch (error) {
      console.error('Erro ao cancelar:', error);
      alert('Erro ao cancelar agendamento');
    }
  };

  const hoje = new Date().toISOString().split('T')[0];
  const agendamentosHoje = agendamentos.filter(a =>
    a.data_hora?.split('T')[0] === hoje && a.status !== 'cancelado'
  );
  const proximosAgendamentos = agendamentos.filter(a =>
    a.data_hora?.split('T')[0] > hoje && a.status !== 'cancelado'
  );

  if (loading) {
    return (
      <DashboardLayout
        userName={user?.nome}
        sidebarItems={sidebarItems}
        currentPath="/medico/agenda"
        onLogout={() => {
          logout();
          navigate('/login');
        }}
      >
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userName={user?.nome}
      sidebarItems={sidebarItems}
      currentPath="/medico/agenda"
      onLogout={() => {
        logout();
        navigate('/login');
      }}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Agenda</h1>
          <p className="text-gray-600 mt-1">Seus agendamentos e consultas</p>
        </div>

        {/* Hoje */}
        <Card>
          <CardTitle>Hoje ({agendamentosHoje.length})</CardTitle>
          {agendamentosHoje.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Nenhum agendamento para hoje
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {agendamentosHoje.map((agendamento) => (
                <div
                  key={agendamento.id}
                  className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r flex justify-between items-start"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <p className="font-semibold text-gray-800">
                        {new Date(agendamento.data_hora).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <p className="text-gray-800 font-medium">{agendamento.nome_paciente}</p>
                    <p className="text-sm text-gray-600">{agendamento.motivo}</p>
                    {agendamento.telefone_paciente && (
                      <p className="text-xs text-gray-500 mt-1">{agendamento.telefone_paciente}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => navigate(`/medico/atendimento/novo?paciente=${agendamento.paciente_id}&agendamento=${agendamento.id}`)}
                    >
                      Iniciar Atendimento
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancelar(agendamento.id)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Próximos */}
        <Card>
          <CardTitle>Próximos Agendamentos ({proximosAgendamentos.length})</CardTitle>
          {proximosAgendamentos.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Nenhum agendamento futuro
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {proximosAgendamentos.slice(0, 10).map((agendamento) => (
                <div
                  key={agendamento.id}
                  className="border-l-4 border-green-500 pl-4 py-3 bg-gray-50 rounded-r flex justify-between items-start"
                >
                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      {new Date(agendamento.data_hora).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(agendamento.data_hora).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-gray-800 font-medium">{agendamento.nome_paciente}</p>
                    <p className="text-sm text-gray-600">{agendamento.tipo_consulta}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelar(agendamento.id)}
                  >
                    Cancelar
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
