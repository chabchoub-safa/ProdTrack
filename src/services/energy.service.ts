import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { APIform7 } from "../config/api";
import { API_BASE } from "../config/api";
import { APIform9 } from "../config/api";

export interface EnergyMeasurement {
  id?: string;
  deviceId: string;
  voltage: number;
  current: number;
  power: number;
  energy: number;
  frequency: number;
  powerFactor: number;
  receivedAt: string;
}

export async function getEnergyHistoryByRange(
  start: string,
  end: string,
  deviceId: string = "ALL"
): Promise<EnergyMeasurement[]> {
  const params = new URLSearchParams();

  params.append("start", start);
  params.append("end", end);

  if (deviceId && deviceId !== "ALL") {
    params.append("deviceId", deviceId);
  }

  const token = localStorage.getItem("token");

  const res = await fetch(`${APIform7}/history?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) throw new Error("Erreur chargement historique énergie");

  return res.json();
}

export async function getEnergyStats(
  start: string,
  end: string,
  deviceId: string = "ALL"
) {
  const params = new URLSearchParams();

  params.append("start", start);
  params.append("end", end);

  if (deviceId && deviceId !== "ALL") {
    params.append("deviceId", deviceId);
  }

  const token = localStorage.getItem("token");

  const res = await fetch(`${APIform7}/stats?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) throw new Error("Erreur chargement stats énergie");

  return res.json();
}

export function connectEnergySocket(
  onMessage: (data: EnergyMeasurement) => void,
  onStateChange?: (connected: boolean) => void
) {
  const client = new Client({
    webSocketFactory: () => new SockJS(`${API_BASE}/ws-water`),
    reconnectDelay: 5000,
    onConnect: () => {
      onStateChange?.(true);
      client.subscribe("/topic/energy", (message) => {
        onMessage(JSON.parse(message.body));
      });
    },
    onWebSocketClose: () => onStateChange?.(false),
    onStompError: () => onStateChange?.(false),
  });

  client.activate();
  return client;
}
// export const getMonthlyEnergyTotal = async (
//   year: number,
//   month: number
// ) => {

//   const token = localStorage.getItem("token");

//   const response = await fetch(
//     `${APIform9}/energy/monthly?year=${year}&month=${month}`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Erreur API energy monthly");
//   }

//   return response.json();
// };