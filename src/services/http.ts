import axios from "axios";
import { API_BASE } from "../config/api";

export const http = axios.create({
  baseURL: API_BASE,
});

// Ajoute automatiquement Bearer token
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
