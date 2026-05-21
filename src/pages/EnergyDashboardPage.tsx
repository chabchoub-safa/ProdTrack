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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { IonSelect, IonSelectOption } from "@ionic/react";
import { useEnergyDashboard } from "../hook/useEnergyDashboard";
import "./WaterRealtimePage.light.css";
import "./WaterRealtimePage.dark.css";
import TopMenu from "../components/TopMenu";


import { PeriodType } from "../services/water.service";
import { predictenergyPeriod } from "../services/waterPredictionService";

const EnergyDashboardPage: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedMachine, setSelectedMachine] = useState("ALL");
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
  } = useEnergyDashboard(selectedMachine);
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
const downloadEnergyPdf = async () => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();

  const tableRows = chartData.slice(-30);

  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, pageWidth, 32, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("Rapport consommation électrique", 14, 14);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("Système IoT - Suivi énergie", 14, 23);

  pdf.setTextColor(30, 41, 59);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("Machine :", 14, 42);
  pdf.setFont("helvetica", "normal");
  pdf.text(selectedMachine === "ALL" ? "Toutes les machines" : selectedMachine, 38, 42);

  pdf.setFont("helvetica", "bold");
  pdf.text("Date export :", 14, 50);
  pdf.setFont("helvetica", "normal");
  pdf.text(new Date().toLocaleString(), 42, 50);

  const cards = [
    ["Consommation", `${stats?.totalConsumption?.toFixed?.(3) ?? "0.000"} kWh`],
    ["Puissance moy.", `${stats?.avgPower?.toFixed?.(2) ?? "0.00"} W`],
    ["Pic puissance", `${stats?.peakPower?.toFixed?.(2) ?? "0.00"} W`],
    ["Tension moy.", `${stats?.avgVoltage?.toFixed?.(2) ?? "0.00"} V`],
  ];

  let x = 14;
  cards.forEach(([title, value]) => {
    pdf.setFillColor(226, 232, 240);
    pdf.roundedRect(x, 60, 42, 20, 3, 3, "F");

    pdf.setTextColor(71, 85, 105);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, x + 4, 68);

    pdf.setTextColor(15, 23, 42);
    pdf.setFontSize(10);
    pdf.text(value, x + 4, 76);

    x += 46;
  });

  if (chartRef.current) {
    const canvas = await html2canvas(chartRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(15, 23, 42);
    pdf.text("Courbes de consommation électrique", 14, 92);

    pdf.addImage(imgData, "PNG", 14, 98, 182, 80);
  }

  autoTable(pdf, {
    startY: 188,
    head: [["Date", "Puissance (W)", "Énergie (kWh)", "Courant (A)", "Tension (V)"]],
    body: tableRows.map((row: any) => [
      row.time || "-",
      Number(row.power ?? 0).toFixed(2),
      Number(row.energy ?? 0).toFixed(3),
      Number(row.current ?? 0).toFixed(2),
      Number(row.voltage ?? 0).toFixed(2),
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    alternateRowStyles: {
      fillColor: [241, 245, 249],
    },
    styles: {
      cellPadding: 3,
      fontSize: 8,
    },
  });

  const pageCount = pdf.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Page ${i} / ${pageCount}`, pageWidth - 30, 290);
    pdf.text("Généré automatiquement par la plateforme CETTEX IoT", 14, 290);
  }

  pdf.save(`rapport-energie-${selectedMachine}.pdf`);
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
              <IonSelect
  className="machine-filter"
  value={selectedMachine}
  interface="popover"
  onIonChange={(e) => setSelectedMachine(e.detail.value)}
>
  <IonSelectOption value="ALL">Toutes les machines</IonSelectOption>
  <IonSelectOption value="PZEM_01">Machine 1</IonSelectOption>
  <IonSelectOption value="PZEM_02">Machine 2</IonSelectOption>
</IonSelect>
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
 <button className="pdf-btn" onClick={downloadEnergyPdf}>
  Télécharger PDF
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
<div ref={chartRef}>
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