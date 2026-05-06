import axios from "axios";
import { APIform5 } from "../config/api";
import { http } from "./http";
export type GeneralResumeRow = {
  cat: string;
  nature: string;
  hj: number;
  dt: number;
  total: number;
};

export async function getGeneralSummary(multiplicateur = 350): Promise<GeneralResumeRow[]> {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token manquant. Reconnectez-vous.");
  }

  const res = await axios.get(`${APIform5}`, {
    params: { multiplicateur },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}