/**
 * Lista de Pacientes - Médico
 * Visualização de todos os pacientes
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { usuarioService, atendimentoService } from '../../services';
import { DashboardLayout } from '../../design-system/layouts/dashboard-layout';
import { Card, CardTitle } from '../../design-system/organisms/card';
import { Avatar } from '../../design-system/atoms/avatar';
import { Button } from '../../design-system/atoms/button';
import { SearchBar } from '../../design-system/molecules/search-bar';
import { Spinner } from '../../design-system/atoms/spinner';
import { EmptyState } from '../../design-system/organisms/empty-state';
import { Users, Calendar, FileText, Activity } from 'lucide-react';

const sidebarItems = [
  { path: '/medico/dashboard', label: 'Dashboard', icon: Activity },
  { path: '/medico/atendimentos', label: 'Atendimentos', icon: FileText },
  { path: '/medico/pacientes', label: 'Pacientes', icon: Users },
  { path: '/medico/agenda', label: 'Agenda', icon: Calendar },
];

export default function MedicoPacientes() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [filteredPacientes, setFilteredPacientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarPacientes();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = pacientes.filter(p =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.cpf?.includes(searchTerm)
      );
      setFilteredPacientes(filtered);
    } else {
      setFilteredPacientes(pacientes);
    }
  }, [searchTerm, pacientes]);

  const carregarPacientes = async () => {
    try {
      const data = await usuarioService.getPacientes();
      setPacientes(data);
      setFilteredPacientes(data);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    } finally {
      setLoading(false);
    }
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Pacientes</h1>
            <p className="text-gray-600 mt-1">Total: {pacientes.length} pacientes</p>
          </div>
          <Button variant="primary" onClick={() => navigate('/medico/atendimento/novo')}>
            + Novo Atendimento
          </Button>
        </div>

        <SearchBar
          placeholder="Buscar por nome, email ou CPF..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredPacientes.length === 0 ? (
          <EmptyState
            icon={Users}
            title={searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
            description={searchTerm ? 'Tente buscar com outros termos' : 'Aguardando cadastro de pacientes'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPacientes.map((paciente) => (
              <Card key={paciente.id}>
                <div className="flex items-start gap-4">
                  <Avatar
                    src={paciente.foto_url}
                    name={paciente.nome}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {paciente.nome}
                    </h3>
                    <p className="text-sm text-gray-600 truncate">{paciente.email}</p>
                    {paciente.telefone && (
                      <p className="text-sm text-gray-500">{paciente.telefone}</p>
                    )}
                    <div className="mt-3 flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/medico/paciente/${paciente.id}/prontuario`)}
                      >
                        Ver Prontuário
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/medico/atendimento/novo?paciente=${paciente.id}`)}
                      >
                        Atender
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
