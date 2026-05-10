import React, { useState } from "react";
import { IonContent, IonPage } from "@ionic/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

import { useEnergyDashboard } from "../hook/useEnergyDashboard";
import "./WaterRealtimePage.light.css";
import "./WaterRealtimePage.dark.css";
import TopMenu from "../components/TopMenu";


import { PeriodType } from "../services/water.service";
import { predictenergyPeriod } from "../services/waterPredictionService";

const EnergyDashboardPage: React.FC = () => {
  const {
    period,
    setPeriod,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    latest,
    connected,
    stats,
    chartData,
    reload,
  } = useEnergyDashboard();
const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");
const [prediction, setPrediction] = useState<any>(null);
const [loadingPrediction, setLoadingPrediction] = useState(false);
const handlePredictWaterPeriod = async () => {
  if (!startDate || !endDate) {
    alert("Choisir date début et date fin");
    return;
  }

  try {
    setLoadingPrediction(true);

    const data = await predictenergyPeriod(startDate, endDate);
    setPrediction(data);
  } catch (err: any) {
    alert(err.message);
  } finally {
    setLoadingPrediction(false);
  }
};
  return (
    <IonPage>
      <IonContent fullscreen className="water-page">
        <TopMenu title="Consommation électrique " />
        <div className="water-container">
          <div className="water-header">
            

           
          </div>

          <div className="filters-card">
            <div className="filters-top">
              <button className={period === "today" ? "active" : ""} onClick={() => setPeriod("today")}>Aujourd’hui</button>
              <button className={period === "7d" ? "active" : ""} onClick={() => setPeriod("7d")}>7 jours</button>
              <button className={period === "30d" ? "active" : ""} onClick={() => setPeriod("30d")}>30 jours</button>
             
              <button className={period === "custom" ? "active" : ""} onClick={() => setPeriod("custom")}>Personnalisée</button>
              <button
  className={period === "prediction" ? "active" : ""}
  onClick={() => setPeriod("prediction")}
>
  Prédiction IA - Énergie
</button>
               <div className={`status-chip ${connected ? "online" : "offline"}`}>
              {connected ? "Capteur connecté" : "Capteur déconnecté"}
            </div>
            </div>

            {period === "custom" && (
              <div className="custom-range">
                <div className="field">
                  <label>Date début</label>
                  <input type="datetime-local" value={customStart} onChange={(e) => setCustomStart(e.target.value)} />
                </div>

                <div className="field">
                  <label>Date fin</label>
                  <input type="datetime-local" value={customEnd} onChange={(e) => setCustomEnd(e.target.value)} />
                </div>

                <div className="field button-field">
                  <button className="reload-btn" onClick={reload}>Appliquer</button>
                </div>
              </div>
            )}
            {period === "prediction" && (
  <div className="custom-range">
    <div className="field">
      <label>Date début</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
    </div>

    <div className="field">
      <label>Date fin</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
    </div>

    <div className="field button-field">
      <button className="reload-btn" onClick={handlePredictWaterPeriod}>
        {loadingPrediction ? "Prédiction..." : "Prédire"}
      </button>
    </div>

    {prediction && (
      <div className="prediction-result">
        <p>Consommation énergie prédite</p>
        <h2>
          {prediction.predictedValue} {prediction.unit}
        </h2>
        <span>
          Du {prediction.startDate} au {prediction.endDate}
        </span>
      </div>
    )}
  </div>
)}
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <span>Appareil</span>
              <strong>{latest?.deviceId ?? "--"}</strong>
            </div>
            <div className="stat-card">
              <span>Consommation totale</span>
              <strong>{stats.totalConsumption.toFixed(3)} kWh</strong>
            </div>
            <div className="stat-card">
              <span>Pic de puissance</span>
              <strong>{stats.peakPower.toFixed(2)} W</strong>
            </div>
            <div className="stat-card">
              <span>Dernière puissance</span>
              <strong>{latest?.power?.toFixed(2) ?? "0.00"} W</strong>
            </div>
          </div>

          <div className="main-grid">
            <div className="card">
              <div className="card-head">
                <h3>Puissance tout au long de la journée</h3>
                <p>Suivi instantané de la consommation électrique</p>
              </div>

              <div className="chart-box">
                <ResponsiveContainer width="100%" height={340}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#ffffff" }} stroke="#ffffff" />
                    <YAxis tick={{ fontSize: 11, fill: "#ffffff" }} stroke="#ffffff" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#102342",
                        border: "1px solid #ffffff",
                        borderRadius: "10px",
                        color: "#ffffff",
                      }}
                      labelStyle={{ color: "#ffffff" }}
                      itemStyle={{ color: "#ffffff" }}
                    />
                    <Line type="monotone" dataKey="power" stroke="#22c55e" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <div className="card-head">
                <h3>Énergie cumulée</h3>
                <p>Total d’énergie consommée sur la période</p>
              </div>

              <div className="chart-box">
                <ResponsiveContainer width="100%" height={340}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" />
                    <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#ffffff" }} stroke="#ffffff" />
                    <YAxis tick={{ fontSize: 11, fill: "#ffffff" }} stroke="#ffffff" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#102342",
                        border: "1px solid #ffffff",
                        borderRadius: "10px",
                        color: "#ffffff",
                      }}
                      labelStyle={{ color: "#ffffff" }}
                      itemStyle={{ color: "#ffffff" }}
                    />
                    <Area type="monotone" dataKey="energy" stroke="#f59e0b" fill="#f59e0b66" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="bottom-grid">
            <div className="card">
              <div className="card-head">
                <h3>Résumé rapide</h3>
              </div>

              <div className="resume-list">
                <div className="resume-item">
                  <span>Tension moyenne</span>
                  <strong>{stats.avgVoltage.toFixed(1)} V</strong>
                </div>
                <div className="resume-item">
                  <span>Courant moyen</span>
                  <strong>{stats.avgCurrent.toFixed(2)} A</strong>
                </div>
                <div className="resume-item">
                  <span>Fréquence</span>
                  <strong>{latest?.frequency?.toFixed(1) ?? "0.0"} Hz</strong>
                </div>
                <div className="resume-item">
                  <span>Facteur de puissance</span>
                  <strong>{latest?.powerFactor?.toFixed(2) ?? "0.00"}</strong>
                </div>
              </div>
            </div>

            {/* <div className="card">
              <div className="card-head">
                <h3>État</h3>
              </div>

              <div className="state-box">
                <div className={`state-dot ${connected ? "online" : "offline"}`}></div>
                <p>
                  {connected
                    ? "Le flux électrique temps réel est actif."
                    : "Le capteur est déconnecté, mais l’historique reste affiché."}
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EnergyDashboardPage;