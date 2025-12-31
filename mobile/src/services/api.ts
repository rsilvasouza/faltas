import axios from "axios";
import { useAuth } from "../store/auth";
import { router } from "expo-router";

export const api = axios.create({
  // baseURL: "https://apifaltas.pnsfatima.com.br/api",
  baseURL: "http://192.168.1.101:8000/api",
});

api.interceptors.request.use((config) => {
  const token = useAuth.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  config.headers.Accept = 'application/json';
  return config;
});

api.interceptors.response.use(
  (response) => {    
    return response;
  },
  async (error) => {    
    if (error.response && error.response.status === 401) {
      useAuth.getState().logout?.();
      router.replace("/login" as any);
    }

    return Promise.reject(error);
  }
);