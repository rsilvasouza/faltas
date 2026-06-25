import { api } from "./api";
import type { Grupo } from "./types";

export const GrupoService = {
  getAll: async () => {
    const response = await api.get<Grupo[]>("/grupos");
    return response.data;
  },
};
