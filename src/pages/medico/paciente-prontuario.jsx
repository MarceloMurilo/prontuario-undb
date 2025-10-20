/**
 * Prontuário do Paciente - Médico
 * Visualização completa do histórico médico do paciente
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { atendimentoService, usuarioService } from '../../services';
import { DashboardLayout } from '../../design-system/layouts/dashboard-layout';
import { Card, CardTitle, CardBody } from '../../design-system/organisms/card';
import { Avatar } from '../../design-system/atoms/avatar';
import { Badge } from '../../design-system/atoms/badge';
import { Button } from '../../design-system/atoms/button';
import { Spinner } from '../../design-system/atoms/spinner';
import { EmptyState } from '../../design-system/organisms/empty-state';
import { Divider } from '../../design-system/atoms/divider';
import { Users, Calendar, FileText, Activity } from 'lucide-react';

const sidebarItems = [
  { path: '/medico/dashboard', label: 'Dashboard', icon: Activity },
  { path: '/medico/atendimentos', label: 'Atendimentos', icon: FileText },
  { path: '/medico/pacientes', label: 'Pacientes', icon: Users },
  { path: '/medico/agenda', label: 'Agenda', icon: Calendar },
];

export default function MedicoPacienteProntuario() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pacienteId } = useParams();
  const [paciente, setPaciente] = useState(null);
  const [atendimentos, setAtendimentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, [pacienteId]);

  const carregarDados = async () => {
    try {
      const [pacienteData, atendimentosData] = await Promise.all([
        usuarioService.getById(pacienteId),
        atendimentoService.getByPaciente(pacienteId),
      ]);

      setPaciente(pacienteData);
      const sorted = atendimentosData.sort((a, b) =>
        new Date(b.data_atendimento) - new Date(a.data_atendimento)
      );
      setAtendimentos(sorted);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar prontuário do paciente.');
    } finally {
      setLoading(false);
    }
  };

  const getTipoAtendimentoBadge = (tipo) => {
    const tipos = {
      consulta: { variant: 'primary', label: 'Consulta' },
      retorno: { variant: 'success', label: 'Retorno' },
      emergencia: { variant: 'danger', label: 'Emergência' },
    };
    return tipos[tipo] || { variant: 'default', label: tipo };
  };

  if (loading) {
    return (
      <DashboardLayout
        userName={user?.nome}
        sidebarItems={sidebarItems}
        currentPath="/medico/pacientes"
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
      currentPath="/medico/pacientes"
      onLogout={() => {
        logout();
        navigate('/login');
      }}
    >
      <div className="space-y-6">
        {/* Informações do Paciente */}
        <Card>
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-4">
              <Avatar src={paciente?.foto_url} name={paciente?.nome} size="xl" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{paciente?.nome}</h1>
                <p className="text-gray-600">{paciente?.email}</p>
                {paciente?.telefone && (
                  <p className="text-sm text-gray-500">{paciente.telefone}</p>
                )}
                {paciente?.data_nascimento && (
                  <p className="text-sm text-gray-500 mt-1">
                    Nascimento: {new Date(paciente.data_nascimento).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="primary"
              onClick={() => navigate(`/medico/atendimento/novo?paciente=${pacienteId}`)}
            >
              + Novo Atendimento
            </Button>
          </div>
        </Card>

        {/* Histórico de Atendimentos */}
        <Card>
          <CardTitle>Histórico de Atendimentos ({atendimentos.length})</CardTitle>
          <CardBody>
            {atendimentos.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="Nenhum atendimento registrado"
                description="Este paciente ainda não possui atendimentos registrados."
              />
            ) : (
              <div className="space-y-6">
                {atendimentos.map((atendimento, index) => {
                  const tipoBadge = getTipoAtendimentoBadge(atendimento.tipo_atendimento);

                  return (
                    <div key={atendimento.id}>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <p className="text-sm font-semibold text-gray-700">
                              {new Date(atendimento.data_atendimento).toLocaleDateString('pt-BR')} às{' '}
                              {new Date(atendimento.data_atendimento).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                            <Badge variant={tipoBadge.variant}>{tipoBadge.label}</Badge>
                          </div>
                          <p className="text-xs text-gray-500">Dr(a). {atendimento.nome_medico}</p>
                        </div>

                        {atendimento.queixa_principal && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase">Queixa Principal</p>
                            <p className="text-sm text-gray-800">{atendimento.queixa_principal}</p>
                          </div>
                        )}

                        {atendimento.diagnostico && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase">Diagnóstico</p>
                            <p className="text-sm text-gray-800">{atendimento.diagnostico}</p>
                          </div>
                        )}

                        {atendimento.prescricao && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase">Prescrição</p>
                            <p className="text-sm text-gray-800 whitespace-pre-line">{atendimento.prescricao}</p>
                          </div>
                        )}

                        {atendimento.orientacoes && (
                          <div>
                            <p className="text-xs font-semibold text-gray-600 uppercase">Orientações</p>
                            <p className="text-sm text-gray-800">{atendimento.orientacoes}</p>
                          </div>
                        )}

                        {(atendimento.pressao_arterial || atendimento.peso || atendimento.altura) && (
                          <div className="flex gap-4 text-xs text-gray-600 pt-2">
                            {atendimento.pressao_arterial && <span>PA: {atendimento.pressao_arterial}</span>}
                            {atendimento.peso && <span>Peso: {atendimento.peso}kg</span>}
                            {atendimento.altura && <span>Altura: {atendimento.altura}m</span>}
                            {atendimento.imc && <span>IMC: {atendimento.imc}</span>}
                          </div>
                        )}
                      </div>

                      {index < atendimentos.length - 1 && <Divider className="my-6" />}
                    </div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </DashboardLayout>
  );
}
