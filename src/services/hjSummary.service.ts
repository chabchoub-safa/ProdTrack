import axios from "axios";
import { APIform6 } from "../config/api";
import { http } from "./http";
const API = "http://localhost:8081";

export type HjSummaryRow = {
  cat: string;
  nature: string;
  abdlhmid: number;
  insaf: number;
  rachida: number;
  majdi: number;
  chourouk: number;
};

export async function listHjSummary(): Promise<HjSummaryRow[]> {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${APIform6}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}