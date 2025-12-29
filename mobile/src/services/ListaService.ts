import { api } from './api';

export interface Lista {
  id: string;
  nome: string;
  status: 'aberto' | 'fechado';
  created_at: string;
}

export const ListaService = {
  getAll: async () => {
    const response = await api.get<Lista[]>('/listas');
    return response.data;
  },
  
  create: async (nome: string) => {
    const response = await api.post<Lista>('/listas', { nome });
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/listas/${id}`);
  }
};