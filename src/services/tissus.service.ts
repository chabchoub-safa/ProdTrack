import { http } from "./http";
import { API_BASE } from "../config/api";

export type Statut = "EN_STOCK" | "EN_TRAITEMENT" | "LIVRE";

export type TissuForm = {
  code: string;
  clientEmail:string;
  // pas statut ici (auto côté backend)
  demande: {
    numeroDemande: string;
    client: string;
    support: string;
    referenceSupportClient: string;
    Recette: string;
    ColorantDemandee: string;
    Quantite: string;
    remarques: string;
    dateReception?: string;
     Composition: string;
     Process: string;
    Disignateur: string;
    couleurEnvoyee: string;
    StandardClient: string;
    Prix: string;

    // auto (lecture seule)
    dateLancement?: string | null;
    delai?: string | null;
  };
  routeMachineIds: string[]; // ✅ workflow
};
export type ClientUser = {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
};
export type DemandeDetails = {
  numeroDemande?: string;
  client?: string;
  support?: string;
  referenceSupportClient?: string;
  dateReception?: string;
  dateLancement?: string | null;
  delai?: string | null;
  Composition?: string;
  Process?: string;
  Disignateur?: string;
  couleurEnvoyee?: string;
  StandardClient?: string;
  Prix?: string;
  Recette?: string;
  ColorantDemandee?: string;
  Quantite?: string;
  remarques?: string;
};

export type TissuDetailsResponse = {
  tissu: {
    id: string;
    code: string;
    statut: string;
    clientEmail?: string;
    demande?: DemandeDetails;
  };
  secondsByMachine: any;
  events: any[];
};



export async function downloadDemandePdf(id: string, code?: string) {
  const blob = await generateDemandePdf(id);

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `demande_${code || id}.pdf`;
  document.body.appendChild(a);
  a.click();

  a.remove();
  window.URL.revokeObjectURL(url);
}
export async function listClients() {
  const res = await http.get(`${API_BASE}/api/auth/users`);

  return res.data.filter((u: ClientUser) =>
    u.role === "ROLE_USER" || u.role === "ROLE_CLIENT"
  ) as ClientUser[];
}

export async function listTissus(q?: string) {
  const res = await http.get(`${API_BASE}/api/tissus`, { params: q ? { q } : {} });
  return res.data;
}

export async function getTissuDetails(id: string) {
  const res = await http.get(`${API_BASE}/api/tissus/${id}/details`);
  return res.data;
}

export async function createTissu(form: TissuForm, file?: File | null) {
  const fd = new FormData();
  fd.append("data", new Blob([JSON.stringify(form)], { type: "application/json" }));
  if (file) fd.append("file", file);
  // ⚠️ ne pas mettre Content-Type manuellement
  const res = await http.post(`${API_BASE}/api/tissus`, fd);

  return res.data;
}

export async function downloadTissuQr(id: string) {
  const res = await http.get(`${API_BASE}/api/tissus/${id}/qr`, { responseType: "blob" });
  return res.data as Blob;
}

export async function generateDemandePdf(id: string) {
  const res = await http.get(`${API_BASE}/api/tissus/${id}/demande-pdf`, { responseType: "blob" });
  return res.data as Blob;
}
export async function createTissuSmart(form: TissuForm, file?: File | null) {
  if (!file) {
    // JSON simple
    const res = await http.post(`${API_BASE}/api/tissus`, form, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  }

  // multipart si fichier
  const fd = new FormData();
  fd.append("data", new Blob([JSON.stringify(form)], { type: "application/json" }));
  fd.append("file", file);

  const res = await http.post(`${API_BASE}/api/tissus`, fd); // ne pas forcer Content-Type
  return res.data;
}
export async function updateTissu(id: string, form: TissuForm, file?: File | null) {
  if (file) {
    const fd = new FormData();
    fd.append("data", new Blob([JSON.stringify(form)], { type: "application/json" }));
    fd.append("file", file);

    const res = await http.put(`${API_BASE}/api/tissus/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } else {
    const res = await http.put(`${API_BASE}/api/tissus/${id}`, form);
    return res.data;
  }
}
export type TissuLite = {
  id: string;
  code: string;
  statut: string; // EN_STOCK / EN_COURS / TERMINE ...
};

export async function listTissusByClient(clientId: string) {
  const res = await http.get(`${API_BASE}/api/tissus/by-client/${clientId}`);
  return res.data as TissuLite[];
}

export async function listTissusByTechnicien() {
  const res = await http.get(`${API_BASE}/api/tissus/for-technicien`);
  return res.data as TissuLite[];
}
export async function listMyTissus(q?: string) {
  const res = await http.get(`${API_BASE}/api/tissus/my`, {
    params: q ? { q } : undefined,
  });
  return res.data;
}

export async function getTissuDetailsClient(id: string) {
  const res = await http.get(`${API_BASE}/api/tissus/${id}/details-client`);
  return res.data;
}