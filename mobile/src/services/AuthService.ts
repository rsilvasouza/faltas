import { api } from './api';

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

export const AuthService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', {
      email,
      password,
    });
    
    return response.data;
  },
  
  logout: async () => {
    await api.post('/logout');
  }
};