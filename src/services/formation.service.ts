import { APIform4 } from "../config/api";
import { http } from "./http";
export type Complement = {
  nom: string;
  valeur: string;
};
export type Formation = {
  id?: string;
  catThemes?: string;
  entreprise?: string;
  themes?: string;
  suitesEntreprises?: string;
  avancement?: string;
  nombreModulesApprouves?: number;
  facture?: string;
  date?: string;
  montantDt?: number;
  hj?: number;
  complements?: Complement[];
};

export const listFormations = async (q?: string): Promise<Formation[]> => {
  const { data } = await http.get(`${APIform4}`, {
    params: q ? { q } : {},
  });
  return data;
};

export const getFormationById = async (id: string): Promise<Formation> => {
  const { data } = await http.get(`${APIform4}/${id}`);
  return data;
};

export const createFormation = async (payload: Formation): Promise<Formation> => {
  const { data } = await http.post(`${APIform4}`, payload);
  return data;
};

export const updateFormation = async (id: string, payload: Formation): Promise<Formation> => {
  const { data } = await http.put(`${APIform4}/${id}`, payload);
  return data;
};

export const deleteFormation = async (id: string): Promise<void> => {
  await http.delete(`${APIform4}/${id}`);
};