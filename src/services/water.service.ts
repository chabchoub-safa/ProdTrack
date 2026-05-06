import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_BASE } from "../config/api";

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

export async function getWaterHistoryByRange(
  start: string,
  end: string
): Promise<WaterMeasurement[]> {
  const res = await fetch(
    `${API_BASE}/api/water/history?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
  );

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