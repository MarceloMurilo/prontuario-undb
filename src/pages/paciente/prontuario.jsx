/**
 * Prontuário Completo - Paciente
 * Visualização detalhada do histórico médico
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { atendimentoService } from '../../services';
import { DashboardLayout } from '../../design-system/layouts/dashboard-layout';
import { Card, CardTitle, CardBody } from '../../design-system/organisms/card';
import { Badge } from '../../design-system/atoms/badge';
import { Spinner } from '../../design-system/atoms/spinner';
import { EmptyState } from '../../design-system/organisms/empty-state';
import { FileText, Calendar, User, Activity } from 'lucide-react';

const sidebarItems = [
  { path: '/paciente/dashboard', label: 'Dashboard', icon: Activity },
  { path: '/paciente/prontuario', label: 'Meu Prontuário', icon: FileText },
  { path: '/paciente/consultas', label: 'Minhas Consultas', icon: Calendar },
  { path: '/paciente/perfil', label: 'Meu Perfil', icon: User },
];

export default function PacienteProntuario() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [atendimentos, setAtendimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAtendimento, setSelectedAtendimento] = useState(null);

  useEffect(() => {
    carregarProntuario();
  }, [user]);

  const carregarProntuario = async () => {
    try {
      if (user?.id) {
        const data = await atendimentoService.getByPaciente(user.id);
        setAtendimentos(data);
      }
    } catch (error) {
      console.error('Erro ao carregar prontuário:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        userName={user?.nome}
        sidebarItems={sidebarItems}
        currentPath="/paciente/prontuario"
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
      currentPath="/paciente/prontuario"
      onLogout={() => {
        logout();
        navigate('/login');
      }}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Meu Prontuário Médico</h1>
          <p className="text-gray-600 mt-1">Histórico completo de atendimentos e consultas</p>
        </div>

        {atendimentos.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="Nenhum atendimento registrado"
            description="Você ainda não possui consultas ou atendimentos no sistema."
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Atendimentos */}
            <div className="lg:col-span-1">
              <Card>
                <CardTitle>Histórico ({atendimentos.length})</CardTitle>
                <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
                  {atendimentos.map((atendimento) => (
                    <button
                      key={atendimento.id}
                      onClick={() => setSelectedAtendimento(atendimento)}
                      className={`
                        w-full text-left p-3 rounded-lg border-2 transition-colors
                        ${selectedAtendimento?.id === atendimento.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                        }
                      `}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-medium text-sm">
                          {atendimento.tipo_atendimento || 'Consulta'}
                        </p>
                        <Badge variant="primary" className="text-xs">
                          {new Date(atendimento.data_atendimento || atendimento.criado_em).toLocaleDateString('pt-BR')}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">
                        {atendimento.nome_medico || 'Médico'}
                      </p>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Detalhes do Atendimento */}
            <div className="lg:col-span-2">
              {selectedAtendimento ? (
                <Card>
                  <CardTitle>Detalhes do Atendimento</CardTitle>
                  <CardBody>
                    <div className="space-y-4">
                      {/* Info Básica */}
                      <div className="grid grid-cols-2 gap-4 pb-4 border-b">
                        <div>
                          <p className="text-sm text-gray-600">Data</p>
                          <p className="font-medium">
                            {atendimentoService.formatarData(selectedAtendimento.data_atendimento)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Médico</p>
                          <p className="font-medium">{selectedAtendimento.nome_medico}</p>
                          {selectedAtendimento.especialidade_medico && (
                            <p className="text-sm text-gray-500">{selectedAtendimento.especialidade_medico}</p>
                          )}
                        </div>
                      </div>

                      {/* Queixa Principal */}
                      {selectedAtendimento.queixa_principal && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Queixa Principal</p>
                          <p className="text-gray-800">{selectedAtendimento.queixa_principal}</p>
                        </div>
                      )}

                      {/* Diagnóstico */}
                      {selectedAtendimento.diagnostico_definitivo && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Diagnóstico</p>
                          <p className="text-gray-800">{selectedAtendimento.diagnostico_definitivo}</p>
                        </div>
                      )}

                      {/* Prescrição */}
                      {selectedAtendimento.prescricao && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Prescrição Médica</p>
                          <p className="text-gray-800 whitespace-pre-line">{selectedAtendimento.prescricao}</p>
                        </div>
                      )}

                      {/* Orientações */}
                      {selectedAtendimento.orientacoes && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Orientações</p>
                          <p className="text-gray-800">{selectedAtendimento.orientacoes}</p>
                        </div>
                      )}

                      {/* Encaminhamento */}
                      {selectedAtendimento.encaminhamento && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Encaminhamento</p>
                          <p className="text-gray-800">{selectedAtendimento.encaminhamento}</p>
                        </div>
                      )}

                      {/* Observações */}
                      {selectedAtendimento.observacoes && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Observações</p>
                          <p className="text-gray-800">{selectedAtendimento.observacoes}</p>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ) : (
                <Card>
                  <div className="text-center py-12 text-gray-500">
                    Selecione um atendimento ao lado para ver os detalhes
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
