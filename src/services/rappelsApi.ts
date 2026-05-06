import { http } from "./http";
import { API_BASE } from "../config/api";

export type RappelForm = {
  nom: string;
  description: string;
  adminEmail: string;
  technicienEmail?: string;
  prochaineDate: string;      // "2026-02-26"
  frequenceJours: number;     // 365
};

export async function listRappels(q?: string) {
  const res = await http.get(`${API_BASE}/api/rappels`, { params: q ? { q } : {} });
  return res.data;
}

export async function createRappel(form: RappelForm) {
  const res = await http.post(`${API_BASE}/api/rappels`, form);
  return res.data;
}

export async function updateRappel(id: string, form: RappelForm) {
  const res = await http.put(`${API_BASE}/api/rappels/${id}`, form);
  return res.data;
}

export async function deleteRappel(id: string) {
  await http.delete(`${API_BASE}/api/rappels/${id}`);
}

export async function markDoneRappel(id: string, value: boolean) {
  const res = await http.patch(`${API_BASE}/api/rappels/${id}/done`, null, { params: { value } });
  return res.data;
}