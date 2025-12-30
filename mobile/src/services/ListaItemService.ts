import { api } from './api';

export interface Produto {
  id: number;
  nome: string;
}

export interface Grupo {
  id: number;
  nome: string;
}

export interface Item {
  id: number;
  lista_id: number;
  produto_id: number;
  grupo_id: number;
  quantidade: number;
  comprado: boolean;
  preco_estimado: string | number | null;  
  produto: Produto; 
  grupo: Grupo;
}

export const ListaItemService = {
  getByLista: async (listaId: string | number): Promise<Item[]> => {
    const response = await api.get(`/listas/${listaId}/items`);
    return response.data;
  },

  create: async (listaId: string | number, nome: string): Promise<Item> => {
    const response = await api.post(`/listas/${listaId}/items`, {
      nome: nome
    });
    return response.data;
  },
  
  delete: async (itemId: number): Promise<void> => {
    await api.delete(`/items/${itemId}`);
  }
};