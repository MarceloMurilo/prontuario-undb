/**
 * Lista de Atendimentos - Médico
 * Visualização de todos os atendimentos realizados
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth-context';
import { atendimentoService } from '../../services';
import { DashboardLayout } from '../../design-system/layouts/dashboard-layout';
import { Card, CardTitle } from '../../design-system/organisms/card';
import { Badge } from '../../design-system/atoms/badge';
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

export default function MedicoAtendimentos() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [atendimentos, setAtendimentos] = useState([]);
  const [filteredAtendimentos, setFilteredAtendimentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarAtendimentos();
  }, [user]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = atendimentos.filter((a) =>
        a.nome_paciente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.diagnostico?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.tipo_atendimento?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAtendimentos(filtered);
    } else {
      setFilteredAtendimentos(atendimentos);
    }
  }, [searchTerm, atendimentos]);

  const carregarAtendimentos = async () => {
    try {
      if (user?.id) {
        const data = await atendimentoService.getByMedico(user.id);
        // Ordena por data mais recente
        const sorted = data.sort((a, b) =>
          new Date(b.data_atendimento) - new Date(a.data_atendimento)
        );
        setAtendimentos(sorted);
        setFilteredAtendimentos(sorted);
      }
    } catch (error) {
      console.error('Erro ao carregar atendimentos:', error);
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
        currentPath="/medico/atendimentos"
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
      currentPath="/medico/atendimentos"
      onLogout={() => {
        logout();
        navigate('/login');
      }}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Atendimentos</h1>
            <p className="text-gray-600 mt-1">
              Total: {atendimentos.length} atendimentos realizados
            </p>
          </div>
          <Button variant="primary" onClick={() => navigate('/medico/atendimento/novo')}>
            + Novo Atendimento
          </Button>
        </div>

        <SearchBar
          placeholder="Buscar por paciente, diagnóstico ou tipo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredAtendimentos.length === 0 ? (
          <EmptyState
            icon={FileText}
            title={searchTerm ? 'Nenhum atendimento encontrado' : 'Nenhum atendimento realizado'}
            description={searchTerm ? 'Tente buscar com outros termos' : 'Comece registrando um novo atendimento'}
          />
        ) : (
          <div className="space-y-4">
            {filteredAtendimentos.map((atendimento) => {
              const tipoBadge = getTipoAtendimentoBadge(atendimento.tipo_atendimento);

              return (
                <Card key={atendimento.id}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {atendimento.nome_paciente}
                        </h3>
                        <Badge variant={tipoBadge.variant}>
                          {tipoBadge.label}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-600 mb-1">
                        Data: {new Date(atendimento.data_atendimento).toLocaleDateString('pt-BR')} às{' '}
                        {new Date(atendimento.data_atendimento).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>

                      {atendimento.queixa_principal && (
                        <p className="text-sm text-gray-700 mb-1">
                          <span className="font-medium">Queixa:</span> {atendimento.queixa_principal}
                        </p>
                      )}

                      {atendimento.diagnostico && (
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Diagnóstico:</span> {atendimento.diagnostico}
                        </p>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/medico/atendimento/${atendimento.id}`)}
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
