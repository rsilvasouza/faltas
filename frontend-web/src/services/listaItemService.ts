import { api } from "./api";
import type { ListaItem } from "./types";

export const ListaItemService = {
  getByLista: async (listaId: string | number) => {
    const response = await api.get<ListaItem[]>(`/listas/${listaId}/items`);
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
  updateStatus: async (itemId: number, comprado: boolean) => {
    await api.patch(`/listas/items/${itemId}`, { comprado });
  },
  delete: async (itemId: number) => {
    await api.delete(`/listas/items/${itemId}`);
  },
};
