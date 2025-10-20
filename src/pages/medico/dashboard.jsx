/**
 * Médico Dashboard
 * Dashboard principal do médico
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { atendimentoService } from '../../services';
import { DashboardLayout } from '../../design-system/layouts/dashboard-layout';
import { Card, CardTitle } from '../../design-system/organisms/card';
import { Button } from '../../design-system/atoms/button';
import { Badge } from '../../design-system/atoms/badge';
import { Spinner } from '../../design-system/atoms/spinner';
import { Users, Calendar, FileText, Activity } from 'lucide-react';

const sidebarItems = [
  { path: '/medico/dashboard', label: 'Dashboard', icon: Activity },
  { path: '/medico/atendimentos', label: 'Atendimentos', icon: FileText },
  { path: '/medico/pacientes', label: 'Pacientes', icon: Users },
  { path: '/medico/agenda', label: 'Agenda', icon: Calendar },
];

export default function MedicoDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [atendimentos, setAtendimentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAtendimentos();
  }, []);

  const carregarAtendimentos = async () => {
    try {
      const data = await atendimentoService.getAll();
      setAtendimentos(data);
    } catch (error) {
      console.error('Erro ao carregar atendimentos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar atendimentos do médico atual
  const meusAtendimentos = atendimentos.filter(
    (a) => a.medico_id === user?.id
  );

  const hoje = new Date().toISOString().split('T')[0];
  const atendimentosHoje = meusAtendimentos.filter(
    (a) => a.data_atendimento?.split('T')[0] === hoje
  );

  // Contar pacientes únicos
  const pacientesUnicos = new Set(meusAtendimentos.map(a => a.paciente_id));

  const stats = [
    {
      title: 'Atendimentos Hoje',
      value: atendimentosHoje.length.toString(),
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Total de Pacientes',
      value: pacientesUnicos.size.toString(),
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Total Atendimentos',
      value: meusAtendimentos.length.toString(),
      icon: FileText,
      color: 'bg-purple-500'
    },
    {
      title: 'Concluídos Hoje',
      value: atendimentosHoje.filter(a => a.status === 'concluido').length.toString(),
      icon: Activity,
      color: 'bg-orange-500'
    },
  ];

  if (loading) {
    return (
      <DashboardLayout
        userName={user?.nome}
        sidebarItems={sidebarItems}
        currentPath="/medico/dashboard"
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
      currentPath="/medico/dashboard"
      onLogout={() => {
        logout();
        navigate('/login');
      }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Bem-vindo, Dr(a). {user?.nome}!
          </h1>
          <p className="text-gray-600 mt-1">
            Aqui está um resumo do seu dia
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <div className="flex items-center gap-4">
                <div className={`${stat.color} text-white p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Ações Rápidas */}
        <Card>
          <CardTitle>Ações Rápidas</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Button variant="primary" onClick={() => navigate('/medico/atendimento/novo')}>
              + Novo Atendimento
            </Button>
            <Button variant="secondary" onClick={() => navigate('/medico/agenda')}>
              Ver Agenda
            </Button>
            <Button variant="outline" onClick={() => navigate('/medico/pacientes')}>
              Buscar Paciente
            </Button>
          </div>
        </Card>

        {/* Atendimentos Recentes */}
        <Card>
          <CardTitle>Atendimentos Recentes</CardTitle>
          <div className="mt-4">
            {meusAtendimentos.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Nenhum atendimento registrado ainda
              </div>
            ) : (
              <div className="space-y-3">
                {meusAtendimentos.slice(0, 5).map((atendimento) => (
                  <div
                    key={atendimento.id}
                    className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {atendimento.nome_paciente || 'Paciente'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {atendimento.queixa_principal || atendimento.tipo_exame || 'Sem queixa registrada'}
                        </p>
                      </div>
                      <Badge
                        variant={
                          atendimento.status === 'concluido' ? 'success' :
                          atendimento.status === 'agendado' ? 'primary' : 'gray'
                        }
                      >
                        {atendimento.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {atendimentoService.formatarData(atendimento.data_atendimento || atendimento.criado_em)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
