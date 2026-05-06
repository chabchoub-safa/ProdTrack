import { APIScan } from "../config/api"; // adapte selon ton projet
import { http } from "./http";


export interface StartScanRequest {
  tissuId: string;
  machineId: string;
  estimatedMinutes?: number | null;
}

export interface StopScanRequest {
  tissuId: string;
  machineId: string;
}

export const getWorkflowByTissu = async (tissuId: string) => {
  const res = await http.get(`${APIScan}/tissu/${tissuId}/workflow`);
  return res.data;
};


export const startScan = async (body: StartScanRequest) => {
  const res = await http.post(`${APIScan}/start`, body);
  return res.data;
};

export const stopScan = async (body: StopScanRequest) => {
  const res = await http.post(`${APIScan}/stop`, body);
  return res.data;
};


