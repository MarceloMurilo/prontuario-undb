/**
 * Paciente Dashboard
 * Dashboard principal do paciente
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { atendimentoService } from '../../services';
import { DashboardLayout } from '../../design-system/layouts/dashboard-layout';
import { Card, CardTitle, CardBody } from '../../design-system/organisms/card';
import { Badge } from '../../design-system/atoms/badge';
import { Button } from '../../design-system/atoms/button';
import { Spinner } from '../../design-system/atoms/spinner';
import { FileText, Calendar, User, Activity } from 'lucide-react';

const sidebarItems = [
  { path: '/paciente/dashboard', label: 'Dashboard', icon: Activity },
  { path: '/paciente/prontuario', label: 'Meu Prontuário', icon: FileText },
  { path: '/paciente/consultas', label: 'Minhas Consultas', icon: Calendar },
  { path: '/paciente/perfil', label: 'Meu Perfil', icon: User },
];

export default function PacienteDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [atendimentos, setAtendimentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarHistorico();
  }, [user]);

  const carregarHistorico = async () => {
    try {
      if (user?.id) {
        const data = await atendimentoService.getByPaciente(user.id);
        setAtendimentos(data);
      }
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  const hoje = new Date().toISOString().split('T')[0];
  const proximasConsultas = atendimentos.filter(
    (a) => a.status === 'agendado' && a.data_atendimento?.split('T')[0] >= hoje
  );

  const ultimaConsulta = atendimentos
    .filter(a => a.status === 'concluido')
    .sort((a, b) => new Date(b.data_atendimento) - new Date(a.data_atendimento))[0];

  if (loading) {
    return (
      <DashboardLayout
        userName={user?.nome}
        sidebarItems={sidebarItems}
        currentPath="/paciente/dashboard"
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
      currentPath="/paciente/dashboard"
      onLogout={() => {
        logout();
        navigate('/login');
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Olá, {user?.nome}!
          </h1>
          <p className="text-gray-600 mt-1">
            Bem-vindo ao seu prontuário eletrônico
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 text-white p-3 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Consultas</p>
                <p className="text-2xl font-bold text-gray-800">{atendimentos.length}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="bg-green-500 text-white p-3 rounded-lg">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Consultas Agendadas</p>
                <p className="text-2xl font-bold text-gray-800">{proximasConsultas.length}</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-4">
              <div className="bg-purple-500 text-white p-3 rounded-lg">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Última Consulta</p>
                <p className="text-lg font-bold text-gray-800">
                  {ultimaConsulta
                    ? new Date(ultimaConsulta.data_atendimento).toLocaleDateString('pt-BR')
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Histórico Recente */}
        <Card>
          <CardTitle>Histórico Recente de Consultas</CardTitle>
          <CardBody>
            {atendimentos.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Você ainda não possui consultas registradas
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                {atendimentos.slice(0, 5).map((consulta) => (
                  <div
                    key={consulta.id}
                    className="border-l-4 border-blue-500 pl-4 py-2"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {consulta.tipo_atendimento || 'Consulta'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {consulta.nome_medico || 'Médico não informado'}
                          {consulta.especialidade_medico && ` - ${consulta.especialidade_medico}`}
                        </p>
                      </div>
                      <Badge
                        variant={
                          consulta.status === 'concluido' ? 'success' :
                          consulta.status === 'agendado' ? 'primary' : 'gray'
                        }
                      >
                        {consulta.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {atendimentoService.formatarData(consulta.data_atendimento || consulta.criado_em)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Ações Rápidas */}
        <Card>
          <CardTitle>Acesso Rápido</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Button variant="primary" onClick={() => navigate('/paciente/prontuario')}>
              Ver Prontuário Completo
            </Button>
            <Button variant="secondary" onClick={() => navigate('/paciente/agendamento')}>
              Agendar Consulta
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
