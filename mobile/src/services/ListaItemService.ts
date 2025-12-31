import { api } from "./api";
import { Grupo } from "./GrupoService";
import { Produto } from "./ProdutoService";

export interface Item {
  id: number;
  lista_id: number;
  produto_id: number;
  grupo_id: number;
  quantidade: number;
  comprado: boolean;
  preco_atual: string | number | null;
  created_at: Date;  
  observacao?: string;
  produto: Produto;
  grupo: Grupo;
}

export const ListaItemService = {
  getByLista: async (listaId: string | number): Promise<Item[]> => {
    const response = await api.get(`/listas/${listaId}/items`);
    return response.data;
  },

  create: async (data: {
    lista_id: number;
    produto_id: number;
    grupo_id: number;
    quantidade: number;
    preco_atual?: number;
    observacao?: string;
  }) => {
    const response = await api.post(`/listas/${data.lista_id}/items`, data);
    return response.data;
  },

  updateStatus: async (itemId: number, comprado: boolean): Promise<any> => {
    const response = await api.patch(`/listas/items/${itemId}`, { comprado });
    return response.data;
  },

  delete: async (itemId: number): Promise<any> => {
    const response = await api.delete(`/listas/items/${itemId}`);
    return response.data;
  },
};
