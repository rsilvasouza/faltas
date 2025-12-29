import { api } from './api';

export interface Item {
  id: string;
  nome: string;
  status: 'aberto' | 'fechado';
  created_at: string;
}

export const ItemService = {
  getAll: async () => {
    const response = await api.get<Item[]>('/items');
    return response.data;
  },
  
  create: async (nome: string) => {
    const response = await api.post<Item>('/items', { nome });
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/items/${id}`);
  }
};