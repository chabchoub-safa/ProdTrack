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
import { predictWaterPeriod  } from "../services/waterPredictionService";
import { getWaterHistoryByRange  } from "../services/water.service";

import TopMenu from "../components/TopMenu";
import { IonSelect, IonSelectOption, IonButton } from "@ionic/react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { useWaterDashboard } from "../hook/useWaterRealtime";
import "./WaterRealtimePage.light.css";
import "./WaterRealtimePage.dark.css";

const WaterRealtimePage: React.FC = () => {
  const [selectedMachine, setSelectedMachine] = useState("ALL");

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
  } = useWaterDashboard(selectedMachine);
  const chartRef = useRef<HTMLDivElement>(null);


const machineOptions = [
  { id: "ALL", label: "Toutes les machines" },
  { id: "ESP32S3__01", label: "Machine 1" },
  { id: "ESP32S3_EAU_01", label: "Machine 2" },
  
];
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
const downloadWaterPdf = async () => {
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();

  const getValue = (row: any, keys: string[]) => {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== null) {
        return Number(row[key]).toFixed(3);
      }
    }
    return "-";
  };

  const tableRows = chartData.slice(-30);

  // ===== Header =====
  pdf.setFillColor(15, 23, 42);
  pdf.rect(0, 0, pageWidth, 32, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont("helvetica", "bold");
  pdf.text("Rapport consommation d'eau", 14, 14);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("Système IoT - Suivi consommation eau", 14, 23);

  // ===== Infos =====
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

  // ===== Cartes stats =====
  const cards = [
    ["Consommation", `${stats?.totalConsumption?.toFixed?.(3) ?? "0.000"} L`],
    ["Débit moyen", `${stats?.avgFlow?.toFixed?.(3) ?? "0.000"} L/min`],
    // ["Pic débit", `${stats?.maxFlow?.toFixed?.(3) ?? "0.000"} L/min`],
    ["Mesures", `${stats?.count ?? chartData.length}`],
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
    pdf.setFontSize(11);
    pdf.text(value, x + 4, 76);

    x += 46;
  });

  // ===== Graphique =====
  if (chartRef.current) {
    const canvas = await html2canvas(chartRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");

    pdf.setFontSize(13);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(15, 23, 42);
    pdf.text("Courbes de consommation", 14, 92);

    pdf.addImage(imgData, "PNG", 14, 98, 182, 80);
  }

  // ===== Tableau =====
  autoTable(pdf, {
    startY: 188,
    head: [["Date", "Débit (L/min)", "Total litres"]],
    body: tableRows.map((row: any) => [
      row.time || row.date || "-",
      getValue(row, ["flow", "flowLMin", "debit"]),
      getValue(row, ["total", "totalLiters", "cumulative", "consumption"]),
    ]),
    theme: "grid",
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      textColor: [30, 41, 59],
      fontSize: 9,
    },
    alternateRowStyles: {
      fillColor: [241, 245, 249],
    },
    styles: {
      cellPadding: 3,
      lineColor: [203, 213, 225],
      lineWidth: 0.2,
    },
  });

  // ===== Footer =====
  const pageCount = pdf.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`Page ${i} / ${pageCount}`, pageWidth - 30, 290);
    pdf.text("Généré automatiquement par la plateforme CETTEX IoT", 14, 290);
  }

  pdf.save(`rapport-eau-${selectedMachine}.pdf`);
};
// const downloadWaterPdf = async () => {
//   const pdf = new jsPDF("p", "mm", "a4");

//   pdf.setFontSize(16);
//   pdf.text("Rapport consommation d'eau", 14, 15);

//   pdf.setFontSize(10);
//   pdf.text(
//     `Machine : ${
//       selectedMachine === "ALL" ? "Toutes les machines" : selectedMachine
//     }`,
//     14,
//     23
//   );

//   if (chartRef.current) {
//     const canvas = await html2canvas(chartRef.current);
//     const imgData = canvas.toDataURL("image/png");
//     pdf.addImage(imgData, "PNG", 10, 35, 190, 80);
//   }

//  const getValue = (row: any, keys: string[]) => {
//   for (const key of keys) {
//     if (row[key] !== undefined && row[key] !== null) {
//       return Number(row[key]).toFixed(3);
//     }
//   }
//   return "-";
// };

// const tableRows = chartData.slice(-30);

// autoTable(pdf, {
//   startY: 125,
//   head: [["Date", "Débit (L/min)", "Total litres"]],
//   body: tableRows.map((row: any) => [
//     row.time || row.date || "-",
//     getValue(row, ["flow", "flowLMin", "debit"]),
//     getValue(row, ["total", "totalLiters", "cumulative", "consumption"]),
//   ]),
// });

//   pdf.save("rapport-eau.pdf");
// };
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
              <IonSelect
  className="machine-filter"
  value={selectedMachine}
  interface="popover"
  onIonChange={(e) => setSelectedMachine(e.detail.value)}
>
  {machineOptions.map((m) => (
    <IonSelectOption key={m.id} value={m.id}>
      {m.label}
    </IonSelectOption>
  ))}
</IonSelect>
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
<button className="pdf-btn" onClick={downloadWaterPdf}>
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
<div ref={chartRef}>
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