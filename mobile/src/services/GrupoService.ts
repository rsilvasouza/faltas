import { api } from './api';

export interface Grupo {
  id: number;
  nome: string;
}

export const GrupoService = {
  getAll: async () => {
      const response = await api.get<Grupo[]>('/grupos');
      return response.data;
    },
};