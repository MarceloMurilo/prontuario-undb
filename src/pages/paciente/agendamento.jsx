/**
 * Agendamento de Consulta - Paciente
 * Tela para agendar consulta com médicos
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { usuarioService, agendamentoService } from '../../services';
import { DashboardLayout } from '../../design-system/layouts/dashboard-layout';
import { Card, CardTitle, CardBody } from '../../design-system/organisms/card';
import { Button } from '../../design-system/atoms/button';
import { Avatar } from '../../design-system/atoms/avatar';
import { Spinner } from '../../design-system/atoms/spinner';
import { EmptyState } from '../../design-system/organisms/empty-state';
import { FormField } from '../../design-system/molecules/form-field';
import { Select } from '../../design-system/molecules/select';
import { Textarea } from '../../design-system/molecules/textarea';
import { FileText, Calendar, User, Activity, Stethoscope } from 'lucide-react';

const sidebarItems = [
  { path: '/paciente/dashboard', label: 'Dashboard', icon: Activity },
  { path: '/paciente/prontuario', label: 'Meu Prontuário', icon: FileText },
  { path: '/paciente/consultas', label: 'Minhas Consultas', icon: Calendar },
  { path: '/paciente/perfil', label: 'Meu Perfil', icon: User },
];

export default function PacienteAgendamento() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [medicos, setMedicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedico, setSelectedMedico] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    data_hora: '',
    tipo_consulta: 'primeira_vez',
    motivo: '',
    observacoes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    carregarMedicos();
  }, []);

  const carregarMedicos = async () => {
    try {
      const data = await usuarioService.getMedicos();
      setMedicos(data);
    } catch (error) {
      console.error('Erro ao carregar médicos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMedico = (medico) => {
    setSelectedMedico(medico);
    setShowForm(true);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await agendamentoService.create({
        paciente_id: user.id,
        medico_id: selectedMedico.id,
        ...formData
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/paciente/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
      alert('Erro ao agendar consulta. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        userName={user?.nome}
        sidebarItems={sidebarItems}
        currentPath="/paciente/agendamento"
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

  if (success) {
    return (
      <DashboardLayout
        userName={user?.nome}
        sidebarItems={sidebarItems}
        currentPath="/paciente/agendamento"
        onLogout={() => {
          logout();
          navigate('/login');
        }}
      >
        <div className="text-center py-12">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Consulta Agendada com Sucesso!
          </h2>
          <p className="text-gray-600">
            Redirecionando para o dashboard...
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      userName={user?.nome}
      sidebarItems={sidebarItems}
      currentPath="/paciente/agendamento"
      onLogout={() => {
        logout();
        navigate('/login');
      }}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Agendar Consulta</h1>
          <p className="text-gray-600 mt-1">Escolha um médico e agende sua consulta</p>
        </div>

        {medicos.length === 0 ? (
          <EmptyState
            icon={Stethoscope}
            title="Nenhum médico disponível"
            description="No momento não há médicos cadastrados no sistema."
          />
        ) : !showForm ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {medicos.map((medico) => (
              <Card key={medico.id}>
                <div className="flex flex-col items-center text-center">
                  <Avatar
                    src={medico.foto_url}
                    name={medico.nome}
                    size="xl"
                    className="mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    Dr(a). {medico.nome}
                  </h3>
                  {medico.especialidade && (
                    <p className="text-sm text-gray-600 mb-2">{medico.especialidade}</p>
                  )}
                  {medico.crm && (
                    <p className="text-xs text-gray-500 mb-4">CRM: {medico.crm}</p>
                  )}
                  <Button
                    variant="primary"
                    onClick={() => handleSelectMedico(medico)}
                    fullWidth
                  >
                    Agendar Consulta
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardTitle>Agendar Consulta com Dr(a). {selectedMedico.nome}</CardTitle>
            <CardBody>
              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  label="Data e Hora"
                  type="datetime-local"
                  name="data_hora"
                  value={formData.data_hora}
                  onChange={handleChange}
                  required
                />

                <Select
                  label="Tipo de Consulta"
                  name="tipo_consulta"
                  value={formData.tipo_consulta}
                  onChange={handleChange}
                  options={[
                    { value: 'primeira_vez', label: 'Primeira Consulta' },
                    { value: 'retorno', label: 'Retorno' },
                    { value: 'exame', label: 'Avaliação de Exame' },
                  ]}
                  required
                />

                <Textarea
                  label="Motivo da Consulta"
                  name="motivo"
                  placeholder="Descreva brevemente o motivo da consulta..."
                  value={formData.motivo}
                  onChange={handleChange}
                  rows={3}
                  required
                />

                <Textarea
                  label="Observações (opcional)"
                  name="observacoes"
                  placeholder="Alguma informação adicional..."
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows={2}
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Voltar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={submitting}
                    disabled={submitting}
                  >
                    Confirmar Agendamento
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
