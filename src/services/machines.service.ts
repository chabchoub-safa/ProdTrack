import { http } from "./http";
import { API_BASE } from "../config/api";

export type MachineForm = {
  code: string;
  nom: string;
  actif?: boolean;
};

export async function listMachines(q?: string) {
  const res = await http.get(`${API_BASE}/api/machines`, { params: q ? { q } : {} });
  return res.data;
}

export async function getMachine(id: string) {
  const res = await http.get(`${API_BASE}/api/machines/${id}`);
  return res.data;
}

export async function createMachine(form: MachineForm) {
  const res = await http.post(`${API_BASE}/api/machines`, form);
  return res.data;
}

export async function updateMachine(id: string, form: MachineForm) {
  const res = await http.put(`${API_BASE}/api/machines/${id}`, form);
  return res.data;
}

export async function toggleMachine(id: string) {
  const res = await http.patch(`${API_BASE}/api/machines/${id}/toggle`, {});
  return res.data;
}

export async function softDeleteMachine(id: string) {
  const res = await http.delete(`${API_BASE}/api/machines/${id}`);
  return res.data;
}

export async function setMachineConsumption(id: string, waterLiters: number, currentWatts: number) {
  const res = await http.put(`${API_BASE}/api/machines/${id}/consumption`, { waterLiters, currentWatts });
  return res.data;
}
export async function listDeletedMachines() {
  const res = await http.get(`${API_BASE}/api/machines/deleted`);
  return res.data;
}

export async function restoreMachine(id: string) {
  const res = await http.patch(`${API_BASE}/api/machines/${id}/restore`, {});
  return res.data;
}

// machines.service.ts
export async function downloadMachineQr(id: string) {
  const res = await http.get(`${API_BASE}/api/machines/${id}/qr`, {
    responseType: "blob",
  });
  return res.data as Blob;
}