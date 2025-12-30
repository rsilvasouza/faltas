// src/services/ProdutoService.ts
import { api } from './api';

export interface Produto {
  id: number;
  nome: string;
}

export const ProdutoService = {
  search: async (term: string): Promise<Produto[]> => {
    const response = await api.get(`/produtos/search?term=${term}`);
    return response.data;
  }
};