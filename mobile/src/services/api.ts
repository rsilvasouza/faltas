import axios from "axios";
import { useAuth } from "../store/auth";

export const api = axios.create({
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
