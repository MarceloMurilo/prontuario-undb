/**
 * Atendimento Service
 * Serviço para gerenciar atendimentos/prontuários
 */

import { api } from './api';

export const atendimentoService = {
  // Criar novo atendimento completo
  async create(atendimentoData) {
    const response = await api.post('/api/atendimentos', atendimentoData);
    return response.data;
  },

  // Listar todos os atendimentos
  async getAll() {
    const response = await api.get('/api/atendimentos');
    return response.data;
  },

  // Obter atendimento por ID com todos os dados
  async getById(id) {
    const response = await api.get(`/api/atendimentos/${id}`);
    return response.data;
  },

  // Atualizar atendimento
  async update(id, atendimentoData) {
    const response = await api.put(`/api/atendimentos/${id}`, atendimentoData);
    return response.data;
  },

  // Obter histórico completo de um paciente
  async getByPaciente(pacienteId) {
    const response = await api.get(`/api/atendimentos/paciente/${pacienteId}`);
    return response.data;
  },

  // Calcular IMC
  calcularIMC(peso, altura) {
    if (!peso || !altura) return null;
    return (peso / (altura * altura)).toFixed(2);
  },

  // Formatar data de atendimento
  formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },
};
