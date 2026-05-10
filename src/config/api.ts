// src/config/api.ts
export const API_HOST = "http://192.168.0.71";
export const API_PORT = 8081;

export const API_BASE = `${API_HOST}:${API_PORT}`;
export const API = `${API_BASE}/api/auth`;
export const APIform = `${API_BASE}/api/suivi-itp`;
export const APIform1 = `${API_BASE}/api/suivi-plan-action`;
export const APIform2 = `${API_BASE}/api/ass-tech`;
export const APIform3 = `${API_BASE}/api/diagnostics`;
export const APIform4 = `${API_BASE}/api/formations`;
export const APIform5 = `${API_BASE}/api/general-resume`;
export const APIform6 = `${API_BASE}/api/hj-summary`;
export const APIform7 = `${API_BASE}/api/energy`;
export const APIform8 = `${API_BASE}/api/water/prediction`;
export const APIform9 = `${API_BASE}/api`;

export const APIScan = `${API_BASE}/api/scan`;
export const ENDPOINTS = {
  LOGIN: `${API_BASE}/api/auth/login`,
    REGISTER: `${API_BASE}/api/auth/register`,
  // ✅ TISSUS
  TISSUS: `${API_BASE}/api/tissus`,
  TISSU_DETAILS: (id: string) => `${API_BASE}/api/tissus/${id}/details`,
  TISSU_QR: (id: string) => `${API_BASE}/api/tissus/${id}/qr`,
  TISSU_DEMANDE_FILE: (id: string) => `${API_BASE}/api/tissus/${id}/demande-file`,

  // ✅ SCAN (technicien)
  SCAN_START: `${API_BASE}/api/scan/start`,
  SCAN_STOP: `${API_BASE}/api/scan/stop`,
 
};
