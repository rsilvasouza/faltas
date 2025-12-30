import { api } from './api';

export interface Item {
  id: number;
  lista_id: number;
  nome: string;
  comprado: boolean;
}

export const ItemService = {
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