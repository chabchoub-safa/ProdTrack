import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_BASE } from "../config/api";
import { APIform9} from "../config/api";

export interface WaterMeasurement {
  id?: string;
  deviceId: string;
  flowLMin: number;
  totalLiters: number;
  pulseCount: number;
  receivedAt: string;
}

export type PeriodType = "today" | "7d" | "30d" | "custom"| "prediction";

export interface DateRange {
  start: string;
  end: string;
}

// export async function getWaterHistoryByRange(
//   start: string,
//   end: string
// ): Promise<WaterMeasurement[]> {
//   const res = await fetch(
//     `${API_BASE}/api/water/history?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
//   );

//   if (!res.ok) {
//     throw new Error("Erreur chargement historique eau");
//   }

//   return res.json();
// }
export async function getWaterHistoryByRange(
  start: string,
  end: string,
  deviceId: string = "ALL"
): Promise<WaterMeasurement[]> {
  const params = new URLSearchParams();

  params.append("start", start);
  params.append("end", end);

  if (deviceId && deviceId !== "ALL") {
    params.append("deviceId", deviceId);
  }

  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}/api/water/history?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    throw new Error("Erreur chargement historique eau");
  }

  return res.json();
}

export function connectWaterSocket(
  onMessage: (data: WaterMeasurement) => void,
  onStateChange?: (connected: boolean) => void
) {
  const client = new Client({
    webSocketFactory: () => new SockJS(`${API_BASE}/ws-water`),
    reconnectDelay: 5000,
    debug: (str) => console.log("[STOMP]", str),
    onConnect: () => {
      onStateChange?.(true);

      client.subscribe("/topic/water", (message) => {
        const body: WaterMeasurement = JSON.parse(message.body);
        onMessage(body);
      });
    },
    onWebSocketClose: () => {
      onStateChange?.(false);
    },
    onStompError: (frame) => {
      console.error("STOMP error", frame);
      onStateChange?.(false);
    },
  });

  client.activate();
  return client;
}
// export const getMonthlyWaterTotal = async (
//   year: number,
//   month: number
// ) => {

//   const token = localStorage.getItem("token");

//   const response = await fetch(
//     `${APIform9}/water/monthly?year=${year}&month=${month}`,
//     {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Erreur API water monthly");
//   }

//   return response.json();
// };
export async function getWaterTodayHistory(
  deviceId: string = "ALL"
): Promise<WaterMeasurement[]> {
  const params = new URLSearchParams();

  if (deviceId && deviceId !== "ALL") {
    params.append("deviceId", deviceId);
  }

  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API_BASE}/api/water/history/today${params.toString() ? `?${params.toString()}` : ""}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  if (!res.ok) {
    throw new Error("Erreur chargement historique eau aujourd'hui");
  }

  return res.json();
}