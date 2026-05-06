import { APIform } from "../config/api";
import { http } from "./http";
export type SuiviITP = {
  id?: string;
  categorie?: string;
  entreprise?: string;
  objet?: string;
  dossierRecu?: string;
  hj?: number;
  decisionCopil?: string;
  devis?: string;
  date?: string;
  dateSignature?: string;
  dateIntervention?: string;
  dateRemiseRapport?: string;
  depotBmn?: string;
   complements?: Complement[];
  //  abdlhmid?: string;
  // insaf?: string;
  // rachida?: string;
  // majdi?: string;
  // chourouk?: string;
  observations?: string;
};
export type Complement = {
  nom: string;
  valeur: string;
};
export const listSuiviITP = async (q?: string): Promise<SuiviITP[]> => {
  const { data } = await http.get(`${APIform}`, {
    params: q ? { q } : {},
  });
  return data;
};


export const getSuiviITPById = async (id: string): Promise<SuiviITP> => {
  const { data } = await http.get(`${APIform}/${id}`);
  return data;
};

export const createSuiviITP = async (payload: SuiviITP): Promise<SuiviITP> => {
  const { data } = await http.post(`${APIform}`, payload);
  return data;
};

export const updateSuiviITP = async (
  id: string,
  payload: SuiviITP
): Promise<SuiviITP> => {
  const { data } = await http.put(`${APIform}/${id}`, payload);
  return data;
};

export const deleteSuiviITP = async (id: string): Promise<void> => {
  await http.delete(`${APIform}/${id}`);
};