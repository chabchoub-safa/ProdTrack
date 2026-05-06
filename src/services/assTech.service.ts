import { APIform2 } from "../config/api";
import { http } from "./http";
export type Complement = {
  nom: string;
  valeur: string;
};
export type AssTech = {
  id?: string;
  cat?: string;
  entreprise?: string;
  objet?: string;
  hj?: number;
  caDt?: number;
  devis?: string;
  date?: string;
  dateSig?: string;
  dateInterv?: string;
  dateFinPrev?: string;
  pourcentageAv?: string;
  dossierItp?: string;
  complements?: Complement[];
  nb?: string;

  facture?: string;
  dateFacture?: string;
  observations?: string;
};

export const listAssTech = async (q?: string): Promise<AssTech[]> => {
  const { data } = await http.get(`${APIform2}`, {
    params: q ? { q } : {},
  });
  return data;
};

export const getAssTechById = async (id: string): Promise<AssTech> => {
  const { data } = await http.get(`${APIform2}/${id}`);
  return data;
};

export const createAssTech = async (payload: AssTech): Promise<AssTech> => {
  const { data } = await http.post(`${APIform2}`, payload);
  return data;
};

export const updateAssTech = async (id: string, payload: AssTech): Promise<AssTech> => {
  const { data } = await http.put(`${APIform2}/${id}`, payload);
  return data;
};

export const deleteAssTech = async (id: string): Promise<void> => {
  await http.delete(`${APIform2}/${id}`);
};