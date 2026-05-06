import { APIform8 } from "../config/api";
import { API_BASE } from "../config/api";

export type WaterPredictionResponse = {
  deviceId: string;
  predictedWaterLiters: number;
  predictionDate: string;
  modelName: string;
};

// remplace par ton IP backend si tu testes sur téléphone
// ex: http://192.168.8.106:8081

export async function fetchWaterPrediction(
  deviceId: string = "ESP32S3_EAU_01"
): Promise<WaterPredictionResponse> {
  const response = await fetch(
    `${APIform8}//next-day?deviceId=${encodeURIComponent(deviceId)}`
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Erreur lors de la récupération de la prédiction");
  }

  return response.json();
}
export async function predictWaterPeriod(startDate: string, endDate: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API_BASE}/api/prediction/water/period?start=${startDate}&end=${endDate}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}
export async function predictenergyPeriod(startDate: string, endDate: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${API_BASE}/api/prediction/energy/period?start=${startDate}&end=${endDate}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}