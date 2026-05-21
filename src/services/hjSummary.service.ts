// import axios from "axios";
// import { APIform6 } from "../config/api";
// import { http } from "./http";
// const API = "http://localhost:8081";

// export type HjSummaryRow = {
//   cat: string;
//   nature: string;
//   abdlhmid: number;
//   insaf: number;
//   rachida: number;
//   majdi: number;
//   chourouk: number;
// };

// export async function listHjSummary(): Promise<HjSummaryRow[]> {
//   const token = localStorage.getItem("token");

//   const res = await axios.get(`${APIform6}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return res.data;
// }
import axios from "axios";
import { APIform6 } from "../config/api";
import { APIform11 } from "../config/api";

export type HjSummaryRow = {
  cat: string;
  nature: string;
  valeurs: Record<string, number>;
};

export type ComplementOption = {
  id?: string;
  nom: string;
  deleted?: boolean;
};


function authHeader() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function listHjSummary(): Promise<HjSummaryRow[]> {
  const res = await axios.get(`${APIform6}`, {
    headers: authHeader(),
  });

  return res.data;
}


export async function listComplements(): Promise<ComplementOption[]> {
  const res = await axios.get(APIform11, {
    headers: authHeader(),
  });
  return res.data;
}

export async function createComplement(nom: string): Promise<ComplementOption> {
  const res = await axios.post(
    APIform11,
    { nom },
    { headers: authHeader() }
  );
  return res.data;
}

export async function softDeleteComplement(id: string) {
  const res = await axios.delete(`${APIform11}/${id}`, {
    headers: authHeader(),
  });
  return res.data;
}

export async function getDeletedComplements(): Promise<ComplementOption[]> {
  const res = await axios.get(`${APIform11}/trash`, {
    headers: authHeader(),
  });
  return res.data;
}

export async function restoreComplement(id: string) {
  const res = await axios.put(`${APIform11}/${id}/restore`, {}, {
    headers: authHeader(),
  });
  return res.data;
}