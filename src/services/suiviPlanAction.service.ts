import { APIform1 } from "../config/api";
import { http } from "./http";
export type Complement = {
  nom: string;
  valeur: string;
};
export type SuiviPlanAction = {
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
  delais?: string;
  realisation?: string;
  observations?: string;
};


export const listSuiviPlanAction = async (q?: string): Promise<SuiviPlanAction[]> => {
  const { data } = await http.get(`${APIform1}`, {
    params: q ? { q } : {},
  });
  return data;
};

export const getSuiviPlanActionById = async (id: string): Promise<SuiviPlanAction> => {
  const { data } = await http.get(`${APIform1}/${id}`);
  return data;
};

export const createSuiviPlanAction = async (
  payload: SuiviPlanAction
): Promise<SuiviPlanAction> => {
  const { data } = await http.post(`${APIform1}`, payload);
  return data;
};

export const updateSuiviPlanAction = async (
  id: string,
  payload: SuiviPlanAction
): Promise<SuiviPlanAction> => {
  const { data } = await http.put(`${APIform1}/${id}`, payload);
  return data;
};

export const deleteSuiviPlanAction = async (id: string): Promise<void> => {
  await http.delete(`${APIform1}/${id}`);
};