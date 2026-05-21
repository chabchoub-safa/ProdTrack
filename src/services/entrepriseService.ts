// import { API_BASE } from "../config/api";

// export interface Entreprise {
//   id?: string;
//   nomEntreprise: string;
//   adresse: string;
//   contact: string;
//   specialite: string;
//   extensions: string[];
// }

// export interface EntrepriseStats extends Entreprise {
//   nombreFormations: number;
//   nombreAssTech: number;
//   nombreDiagnostics: number;
//   nombreITS: number;
//   nombrePlansAction: number;
//   totalCollaborations: number;
// }

// const API = `${API_BASE}/api/entreprises`;

// export async function getEntreprises(): Promise<EntrepriseStats[]> {
//   const res = await fetch(API);
//   if (!res.ok) throw new Error("Erreur chargement entreprises");
//   return res.json();
// }

// export async function searchEntreprises(q: string): Promise<EntrepriseStats[]> {
//   const res = await fetch(`${API}/search?q=${encodeURIComponent(q)}`);
//   if (!res.ok) throw new Error("Erreur recherche entreprises");
//   return res.json();
// }

// export async function createEntreprise(data: Entreprise) {
//   const res = await fetch(API, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) throw new Error("Erreur ajout entreprise");
//   return res.json();
// }

// export async function updateEntreprise(id: string, data: Entreprise) {
//   const res = await fetch(`${API}/${id}`, {
//     method: "PUT",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) throw new Error("Erreur modification entreprise");
//   return res.json();
// }

// export async function deleteEntreprise(id: string) {
//   const res = await fetch(`${API}/${id}`, {
//     method: "DELETE",
//   });

//   if (!res.ok) throw new Error("Erreur suppression entreprise");
// }
import { API_BASE } from "../config/api";

export interface Entreprise {
  id?: string;
  nomEntreprise: string;
  adresse: string;
  contact: string;
  specialite: string;
  extensions: string[];
  deleted?: boolean;
  deletedAt?: string | null;
}

export interface EntrepriseStats extends Entreprise {
  nombreFormations: number;
  nombreAssTech: number;
  nombreDiagnostics: number;
  nombreITS: number;
  nombrePlansAction: number;
  totalCollaborations: number;
}

const API = `${API_BASE}/api/entreprises`;

const authHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export async function getEntreprises(showTrash = false): Promise<EntrepriseStats[]> {
  const res = await fetch(`${API}?trash=${showTrash}`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Erreur chargement entreprises");
  return res.json();
}

export async function searchEntreprises(q: string): Promise<EntrepriseStats[]> {
  const res = await fetch(`${API}/search?q=${encodeURIComponent(q)}`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Erreur recherche entreprises");
  return res.json();
}

export async function createEntreprise(data: Entreprise) {
  const res = await fetch(API, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erreur ajout entreprise");
  return res.json();
}

export async function updateEntreprise(id: string, data: Entreprise) {
  const res = await fetch(`${API}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Erreur modification entreprise");
  return res.json();
}

export async function deleteEntreprise(id: string) {
  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Erreur suppression entreprise");
}
export async function restoreEntreprise(id: string) {
  const res = await fetch(`${API}/${id}/restore`, {
    method: "PUT",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Erreur restauration entreprise");
  return res.json();
}