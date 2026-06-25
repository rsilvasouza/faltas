import { api } from "./api";
import type { LoginResponse } from "./types";

export const AuthService = {
  login: async (email: string, password: string) => {
    const response = await api.post<LoginResponse>("/login", { email, password });
    return response.data;
  },
  loginWithGoogle: async (credential: string) => {
    const response = await api.post<LoginResponse>("/login/google", { credential });
    return response.data;
  },
};
