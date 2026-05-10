// src/services/auth.service.ts
import axios from "axios";
import { ENDPOINTS } from "../config/api";
import { API_BASE , API } from "../config/api";
import { http } from "./http";
export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  role: string; // ex: "ROLE_ADMIN" ou "ROLE_USER"
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await axios.post<LoginResponse>(ENDPOINTS.LOGIN, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}
// src/services/auth.service.ts

export type Role =
  | "ROLE_ADMIN"
  | "ROLE_CLIENT"
  | "ROLE_TECHNICIEN"
  | "ROLE_SECRETAIRE";

export interface RegisterPayload {
  nom: string;
  prenom: string;
  email: string;
  numero: string;
  pays: string;
  password: string;
  role: Role;
  dateNaissance: string; // format ISO ex: "2000-05-20"
  isNotRobot: boolean;
}

export async function register(payload: RegisterPayload) {
  const { data } = await axios.post(ENDPOINTS.REGISTER, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
}
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}


// const API = "http://localhost:8081/api/auth";

export async function forgotPassword(email: string) {
  // backend attend @RequestParam => x-www-form-urlencoded
  const body = new URLSearchParams();
  body.append("email", email);

  return axios.post(`${API}/forgot-password`, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}

export async function resetPassword(email: string, code: string, newPassword: string) {
  const body = new URLSearchParams();
  body.append("email", email);
  body.append("code", code);
  body.append("newPassword", newPassword);

  return axios.post(`${API}/reset-password`, body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}
export type User = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  numero?: string;
  role: string; // ROLE_CLIENT | ROLE_TECH | ...
  deleted?: boolean;
};
// export async function listUsersByRole(role: string, p0: boolean) {
//   const res = await http.get(`${API}`, { params: { role } });
//   return res.data;
// }
export async function listUsersByRole(role: string) {
  const res = await http.get(`${API}`, {
    params: { role },
  });
  return res.data;
}
export async function softDeleteUser(id: string) {
  const res = await http.put(`${API}/users/${id}/soft-delete`);
  return res.data;
}

export async function restoreUser(id: string) {
  const res = await http.put(`${API}/users/${id}/restore`);
  return res.data;
}
export async function listDeletedUsers(role: string) {
  const res = await http.get(`${API}/users/deleted`, { params: { role } });
  return res.data;
}

// export async function listUsers(role?: string, includeDeleted = false) {
//   const res = await http.get(`${API}`, {
//     params: {
//       role: role || undefined,
//       includeDeleted,
//     },
//   });
//   return res.data;
// }