import { APIform3 } from "../config/api";
import { http } from "./http";
export type Complement = {
  nom: string;
  valeur: string;
};
export type Diagnostic = {
  id?: string;
  cat?: string;
  entreprise?: string;
  objet?: string;
  hj?: number;
  caDtHt?: number;
  devis?: string;
  date?: string;
  dateSign?: string;
  dateInterv?: string;
  dateDemarrage?: string;
  dateFinPrev?: string;
   complements?: Complement[];
  pourcentageTech?: string;
  pourcentageRh?: string;
  pourcentageFin?: string;
  pourcentagePos?: string;
  dateDepotMan?: string;
  adhesion?: string;
  facture30?: string;
  dateFacture30?: string;
  facture70?: string;
  dateFacture70?: string;
  observations?: string;
};

export const listDiagnostics = async (q?: string): Promise<Diagnostic[]> => {
  const { data } = await http.get(`${APIform3}`, {
    params: q ? { q } : {},
  });
  return data;
};

export const getDiagnosticById = async (id: string): Promise<Diagnostic> => {
  const { data } = await http.get(`${APIform3}/${id}`);
  return data;
};

export const createDiagnostic = async (payload: Diagnostic): Promise<Diagnostic> => {
  const { data } = await http.post(`${APIform3}`, payload);
  return data;
};

export const updateDiagnostic = async (id: string, payload: Diagnostic): Promise<Diagnostic> => {
  const { data } = await http.put(`${APIform3}/${id}`, payload);
  return data;
};

export const deleteDiagnostic = async (id: string): Promise<void> => {
  await http.delete(`${APIform3}/${id}`);
};