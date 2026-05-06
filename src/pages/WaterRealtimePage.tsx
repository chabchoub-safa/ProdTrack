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
import { predictWaterPeriod } from "../services/waterPredictionService";
import TopMenu from "../components/TopMenu";

import { useWaterDashboard } from "../hook/useWaterRealtime";
import "./WaterRealtimePage.css";

const WaterRealtimePage: React.FC = () => {
  const {
    
    period,
    setPeriod,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    latest,
    loading,
    connected,
    stats,
    chartData,
    reload,
  } = useWaterDashboard();
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

    const data = await predictWaterPeriod(startDate, endDate);
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
           <TopMenu title="Consommation d’eau" />
        <div className="water-container">
          <div className="water-header">
            {/* <div>
              
              <span className="subtitle">
                Visualisation journalière et historique
              </span>
            </div> */}

           
          </div>

          <div className="filters-card">
            <div className="filters-top">
              <button
                className={period === "today" ? "active" : ""}
                onClick={() => setPeriod("today")}
              >
                Aujourd’hui
              </button>
              <button
                className={period === "7d" ? "active" : ""}
                onClick={() => setPeriod("7d")}
              >
                7 jours
              </button>
              <button
                className={period === "30d" ? "active" : ""}
                onClick={() => setPeriod("30d")}
              >
                30 jours
              </button>
           
              <button
                className={period === "custom" ? "active" : ""}
                onClick={() => setPeriod("custom")}
              >
                Personnalisée
              </button>
              <button
  className={period === "prediction" ? "active" : ""}
  onClick={() => setPeriod("prediction")}
>
  Prédiction IA - Eau
</button>


              <div className={`status-chip ${connected ? "online" : "offline"}`}>
              {connected ? "Capteur connecté" : "Capteur déconnecté"}
            </div>
            </div>

            {period === "custom" && (
              <div className="custom-range">
                <div className="field">
                  <label>Date début</label>
                  <input
                    type="datetime-local"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label>Date fin</label>
                  <input
                    type="datetime-local"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                  />
                </div>

                <div className="field button-field">
                  <button className="reload-btn" onClick={reload}>
                    Appliquer
                  </button>
                  
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
        <p>Consommation eau prédite</p>
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
              {/* <strong>{stats.avgFlow.toFixed(2)} L/min</strong> */}
              <strong>{latest?.deviceId ?? "--"}</strong>
            </div>
            <div className="stat-card">
              <span>Consommation totale</span>
              <strong>{stats.totalConsumption.toFixed(3)} L</strong>
            </div>

           

            <div className="stat-card">
              <span>Pic de consommation</span>
              <strong>{stats.peakFlow.toFixed(2)} L/min</strong>
            </div>

            <div className="stat-card">
              <span>Dernière mesure</span>
              <strong>{latest ? latest.flowLMin.toFixed(2) : "0.00"} L/min</strong>
            </div>
          </div>

          <div className="main-grid">
            <div className="card">
              <div className="card-head">
                <h3>
                  {period === "today"
                    ? "Consommation tout au long de la journée"
                    : "Historique de consommation"}
                </h3>
                {/* <p>
                  {loading
                    ? "Chargement..."
                    : "Les données restent affichées même en cas de déconnexion"}
                </p> */}
              </div>

              <div className="chart-box">
                <ResponsiveContainer width="100%" height={340}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#ffffff" />
                    <YAxis tick={{ fontSize: 11 }} stroke="#ffffff"/>
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="flow"
                      stroke="#2563eb"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <div className="card-head">
                <h3>Courbe cumulée</h3>
                {/* <p>Total enregistré sur la période sélectionnée</p> */}
              </div>

              <div className="chart-box">
                <ResponsiveContainer width="100%" height={340}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#ffffff"/>
                    <YAxis tick={{ fontSize: 11 }} stroke="#ffffff"/>
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#051e4d"
                      fill="#80cadd"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* <div className="bottom-grid">
            <div className="card">
              <div className="card-head">
                <h3>Résumé rapide</h3>
              </div>

              <div className="resume-list">
                <div className="resume-item">
                  <span>Appareil</span>
                  <strong>{latest?.deviceId ?? "--"}</strong>
                </div>
                <div className="resume-item">
                  <span>Total période</span>
                  <strong>{stats.totalConsumption.toFixed(3)} L</strong>
                </div>
                <div className="resume-item">
                  <span>Pic période</span>
                  <strong>{stats.peakFlow.toFixed(2)} L/min</strong>
                </div>
                <div className="resume-item">
                  <span>Dernière impulsion</span>
                  <strong>{latest?.pulseCount ?? 0}</strong>
                </div>
              </div>
            </div> */}

            {/* <div className="card">
              <div className="card-head">
                <h3>État</h3>
              </div>

              <div className="state-box">
                <div className={`state-dot ${connected ? "online" : "offline"}`}></div>
                <p>
                  {connected
                    ? "Le flux temps réel est actif."
                    : "Le capteur est déconnecté, mais les valeurs déjà reçues restent affichées."}
                </p>
              </div>
            </div> */}
          {/* </div> */}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default WaterRealtimePage;