import { api } from "./api";
import type { Lista } from "./types";

export const ListaService = {
  getAll: async () => {
    const response = await api.get<Lista[]>("/listas");
    return response.data;
  },
  create: async (nome: string) => {
    const response = await api.post<Lista>("/listas", { nome });
    return response.data;
  },
  getById: async (id: string | number) => {
    const response = await api.get<Lista>(`/listas/${id}`);
    return response.data;
  },
  fecharLista: async (id: string | number) => {
    await api.patch(`/listas/${id}/fechar`);
  },
};
