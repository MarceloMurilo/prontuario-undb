/**
 * Agendamento Service
 * Serviço para gerenciar agendamentos de consultas
 */

import { api } from './api';

export const agendamentoService = {
  // Criar novo agendamento
  async create(agendamentoData) {
    const response = await api.post('/api/agendamentos', agendamentoData);
    return response.data;
  },

  // Listar todos os agendamentos
  async getAll() {
    const response = await api.get('/api/agendamentos');
    return response.data;
  },

  // Obter agendamentos de um paciente
  async getByPaciente(pacienteId) {
    const response = await api.get(`/api/agendamentos/paciente/${pacienteId}`);
    return response.data;
  },

  // Obter agendamentos de um médico
  async getByMedico(medicoId) {
    const response = await api.get(`/api/agendamentos/medico/${medicoId}`);
    return response.data;
  },

  // Atualizar agendamento
  async update(id, agendamentoData) {
    const response = await api.put(`/api/agendamentos/${id}`, agendamentoData);
    return response.data;
  },

  // Cancelar agendamento
  async cancel(id) {
    const response = await api.put(`/api/agendamentos/${id}`, { status: 'cancelado' });
    return response.data;
  },
};
