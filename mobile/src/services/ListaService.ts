import { api } from './api';

export interface Lista {
  id: number;
  nome: string;
  fechamento: Date | null;
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

  getById: async (id: string): Promise<Lista> => {
    const response = await api.get(`/listas/${id}`);
    return response.data;
  },
  
  fecharLista: async (id: string): Promise<void> => {
    await api.patch(`/listas/${id}/fechar`);
  },

  delete: async (id: string) => {
    await api.delete(`/listas/${id}`);
  }
};