/**
 * Usuario Service
 * Serviço para gerenciar usuários
 */

import { api } from './api';

export const usuarioService = {
  // Listar todos os médicos
  async getMedicos() {
    const response = await api.get('/api/usuarios/medicos');
    return response.data;
  },

  // Listar todos os pacientes
  async getPacientes() {
    const response = await api.get('/api/usuarios/pacientes');
    return response.data;
  },

  // Obter usuário por ID
  async getById(id) {
    const response = await api.get(`/api/usuarios/${id}`);
    return response.data;
  },
};
