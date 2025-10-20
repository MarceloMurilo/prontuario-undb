/**
 * Novo Atendimento - Médico
 * Formulário para registrar nova consulta médica
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { atendimentoService, usuarioService } from '../../services';
import { DashboardLayout } from '../../design-system/layouts/dashboard-layout';
import { Card, CardTitle, CardBody } from '../../design-system/organisms/card';
import { Button } from '../../design-system/atoms/button';
import { FormField } from '../../design-system/molecules/form-field';
import { Select } from '../../design-system/molecules/select';
import { Textarea } from '../../design-system/molecules/textarea';
import { Spinner } from '../../design-system/atoms/spinner';
import { Users, Calendar, FileText, Activity } from 'lucide-react';

const sidebarItems = [
  { path: '/medico/dashboard', label: 'Dashboard', icon: Activity },
  { path: '/medico/atendimentos', label: 'Atendimentos', icon: FileText },
  { path: '/medico/pacientes', label: 'Pacientes', icon: Users },
  { path: '/medico/agenda', label: 'Agenda', icon: Calendar },
];

export default function MedicoNovoAtendimento() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pacienteIdParam = searchParams.get('paciente');
  const agendamentoIdParam = searchParams.get('agendamento');

  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    paciente_id: pacienteIdParam || '',
    tipo_atendimento: 'consulta',
    queixa_principal: '',
    historia_doenca: '',
    exame_fisico: '',
    pressao_arterial: '',
    frequencia_cardiaca: '',
    temperatura: '',
    peso: '',
    altura: '',
    diagnostico: '',
    prescricao: '',
    orientacoes: '',
    observacoes: '',
  });

  useEffect(() => {
    carregarPacientes();
  }, []);

  const carregarPacientes = async () => {
    try {
      const data = await usuarioService.getPacientes();
      setPacientes(data);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const atendimentoData = {
        ...formData,
        medico_id: user.id,
        data_atendimento: new Date().toISOString(),
      };

      await atendimentoService.create(atendimentoData);
      alert('Atendimento registrado com sucesso!');
      navigate('/medico/atendimentos');
    } catch (error) {
      console.error('Erro ao criar atendimento:', error);
      alert('Erro ao registrar atendimento. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout
        userName={user?.nome}
        sidebarItems={sidebarItems}
        currentPath="/medico/atendimento/novo"
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
      currentPath="/medico/atendimento/novo"
      onLogout={() => {
        logout();
        navigate('/login');
      }}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Novo Atendimento</h1>
          <p className="text-gray-600 mt-1">Registrar nova consulta médica</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardTitle>Informações Básicas</CardTitle>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Paciente"
                  name="paciente_id"
                  value={formData.paciente_id}
                  onChange={handleChange}
                  options={pacientes.map((p) => ({
                    value: p.id,
                    label: p.nome,
                  }))}
                  required
                />
                <Select
                  label="Tipo de Atendimento"
                  name="tipo_atendimento"
                  value={formData.tipo_atendimento}
                  onChange={handleChange}
                  options={[
                    { value: 'consulta', label: 'Consulta' },
                    { value: 'retorno', label: 'Retorno' },
                    { value: 'emergencia', label: 'Emergência' },
                  ]}
                  required
                />
              </div>
            </CardBody>
          </Card>

          {/* Anamnese */}
          <Card>
            <CardTitle>Anamnese</CardTitle>
            <CardBody>
              <div className="space-y-4">
                <Textarea
                  label="Queixa Principal"
                  name="queixa_principal"
                  value={formData.queixa_principal}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Descreva a queixa principal do paciente..."
                  required
                />
                <Textarea
                  label="História da Doença Atual"
                  name="historia_doenca"
                  value={formData.historia_doenca}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Descreva a história da doença atual..."
                />
              </div>
            </CardBody>
          </Card>

          {/* Sinais Vitais */}
          <Card>
            <CardTitle>Sinais Vitais</CardTitle>
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <FormField
                  label="Pressão Arterial"
                  name="pressao_arterial"
                  placeholder="120/80"
                  value={formData.pressao_arterial}
                  onChange={handleChange}
                />
                <FormField
                  label="Freq. Cardíaca"
                  name="frequencia_cardiaca"
                  placeholder="75 bpm"
                  value={formData.frequencia_cardiaca}
                  onChange={handleChange}
                />
                <FormField
                  label="Temperatura"
                  name="temperatura"
                  placeholder="36.5°C"
                  value={formData.temperatura}
                  onChange={handleChange}
                />
                <FormField
                  label="Peso (kg)"
                  name="peso"
                  type="number"
                  step="0.1"
                  placeholder="70.0"
                  value={formData.peso}
                  onChange={handleChange}
                />
                <FormField
                  label="Altura (m)"
                  name="altura"
                  type="number"
                  step="0.01"
                  placeholder="1.75"
                  value={formData.altura}
                  onChange={handleChange}
                />
              </div>
            </CardBody>
          </Card>

          {/* Exame Físico */}
          <Card>
            <CardTitle>Exame Físico</CardTitle>
            <CardBody>
              <Textarea
                label="Exame Físico"
                name="exame_fisico"
                value={formData.exame_fisico}
                onChange={handleChange}
                rows={3}
                placeholder="Descreva os achados do exame físico..."
              />
            </CardBody>
          </Card>

          {/* Diagnóstico e Conduta */}
          <Card>
            <CardTitle>Diagnóstico e Conduta</CardTitle>
            <CardBody>
              <div className="space-y-4">
                <Textarea
                  label="Diagnóstico"
                  name="diagnostico"
                  value={formData.diagnostico}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Hipótese diagnóstica ou diagnóstico definitivo..."
                  required
                />
                <Textarea
                  label="Prescrição Médica"
                  name="prescricao"
                  value={formData.prescricao}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Medicamentos, dosagem, via de administração..."
                />
                <Textarea
                  label="Orientações"
                  name="orientacoes"
                  value={formData.orientacoes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Orientações gerais para o paciente..."
                />
                <Textarea
                  label="Observações"
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Observações adicionais..."
                />
              </div>
            </CardBody>
          </Card>

          {/* Botões de Ação */}
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/medico/dashboard')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={submitting}
              disabled={submitting}
            >
              Registrar Atendimento
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
