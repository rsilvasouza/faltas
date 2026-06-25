import { api } from "./api";
import type { Produto } from "./types";

export const ProdutoService = {
  search: async (term: string) => {
    const response = await api.get<Produto[]>("/produtos/search", {
      params: { term },
    });
    return response.data;
  },
  create: async (nome: string) => {
    const response = await api.post<Produto>("/produtos", { nome });
    return response.data;
  },
};
