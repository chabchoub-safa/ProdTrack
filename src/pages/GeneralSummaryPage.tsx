// import React, { useEffect, useMemo, useState } from "react";
// import {
//   IonPage,
//   IonContent,
//   IonTitle,
//   IonInput,
//   IonSpinner,
//   IonText,
// } from "@ionic/react";
// import { getGeneralSummary, GeneralResumeRow } from "../services/general.service";
// import "./GeneralSummaryPage.css";
// import Menusec from "../components/Menusec";

// const formatNumber = (value: number) => {
//   return new Intl.NumberFormat("fr-FR", {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 3,
//   }).format(value || 0);
// };

// const GeneralSummaryPage: React.FC = () => {
//   const [rows, setRows] = useState<GeneralResumeRow[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [multiplier, setMultiplier] = useState<number>(350);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     loadData(350);
//   }, []);

//   const loadData = async (mult: number) => {
//     try {
//       setLoading(true);
//       setError("");
//       const data = await getGeneralSummary(mult);
//       setRows(Array.isArray(data) ? data : []);
//     } catch (e) {
//       console.error(e);
//       setError("Erreur lors du chargement du résumé général");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const totals = useMemo(() => {
//     const totalHj = rows.reduce((s, r) => s + (r.hj || 0), 0);
//     const totalDt = rows.reduce((s, r) => s + (r.dt || 0), 0);
//     const totalDt350 = rows.reduce((s, r) => s + (r.total || 0), 0);

//     return { totalHj, totalDt, totalDt350 };
//   }, [rows]);

//   const applyMultiplier = async () => {
//     await loadData(multiplier || 350);
//   };

//   return (
//     <IonPage>
//       <IonContent fullscreen className="general-page">
//         <Menusec title="General Dashboard" />

//         <div className="general-container">
//           <div className="general-header">
//             <IonTitle>Résumé Général</IonTitle>

//             <div className="multiplier-box">
//               <label>Multiplicateur DT</label>
//               <IonInput
//                 type="number"
//                 value={multiplier}
//                 min={0}
//                 onIonInput={(e) => setMultiplier(Number(e.detail.value || 350))}
//                 onIonBlur={applyMultiplier}
//                 className="multiplier-input"
//               />
//             </div>
//           </div>

//           {loading && (
//             <div className="center-box">
//               <IonSpinner />
//             </div>
//           )}

//           {!loading && error && (
//             <IonText color="danger">
//               <p>{error}</p>
//             </IonText>
//           )}

//           {!loading && !error && (
//             <div className="table-card">
//               <table className="general-table simple-table">
//                 <thead>
//                   <tr>
//                     <th>CAT</th>
//                     <th>NATURE</th>
//                     <th>J/H</th>
//                     <th>DT</th>
//                     <th>DT*{multiplier}</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {rows.map((row, index) => (
//                     <tr key={index}>
//                       <td>{row.cat}</td>
//                       <td>{row.nature}</td>
//                       <td>{formatNumber(row.hj)}</td>
//                       <td>{formatNumber(row.dt)}</td>
//                       <td>{formatNumber(row.total)}</td>
//                     </tr>
//                   ))}
//                 </tbody>

//                 <tfoot>
//                   <tr className="total-row">
//                     <td colSpan={2}>TOTAL</td>
//                     <td>{formatNumber(totals.totalHj)}</td>
//                     <td>{formatNumber(totals.totalDt)}</td>
//                     <td>{formatNumber(totals.totalDt350)}</td>
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           )}
//         </div>
//       </IonContent>
//     </IonPage>
//   );
// };

// export default GeneralSummaryPage;

import React, { useEffect, useMemo, useState } from "react";
import {
  IonPage,
  IonContent,
  IonTitle,
  IonInput,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { getGeneralSummary, GeneralResumeRow } from "../services/general.service";
import "./GeneralSummaryPage.css";
import Menusec from "../components/Menusec";

const formatNumber = (value: number) => {
  if (!value || value === 0) return "--";

  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(value);
};

const GeneralSummaryPage: React.FC = () => {
  const [rows, setRows] = useState<GeneralResumeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [multiplier, setMultiplier] = useState<number>(350);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData(350);
  }, []);

  const loadData = async (mult: number) => {
    try {
      setLoading(true);
      setError("");
      const data = await getGeneralSummary(mult);
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("Erreur lors du chargement du résumé général");
    } finally {
      setLoading(false);
    }
  };

  const totals = useMemo(() => {
    const totalHj = rows.reduce((s, r) => s + (r.hj || 0), 0);
    const totalDt = rows.reduce((s, r) => s + (r.dt || 0), 0);
    const totalDt350 = rows.reduce((s, r) => s + (r.total || 0), 0);

    return { totalHj, totalDt, totalDt350 };
  }, [rows]);

  const applyMultiplier = async () => {
    await loadData(multiplier || 350);
  };

  return (
    <IonPage>
      <IonContent fullscreen className="general-page">
        <Menusec title="General Dashboard" />

        <div className="general-container">
          <div className="general-header">
            <IonTitle>Résumé Général</IonTitle>

            <div className="multiplier-box">
              <label>Multiplicateur DT</label>
              <IonInput
                type="number"
                value={multiplier}
                min={0}
                onIonInput={(e) => setMultiplier(Number(e.detail.value || 350))}
                onIonBlur={applyMultiplier}
                className="multiplier-input"
              />
            </div>
          </div>

          {loading && (
            <div className="center-box">
              <IonSpinner />
            </div>
          )}

          {!loading && error && (
            <IonText color="danger">
              <p>{error}</p>
            </IonText>
          )}

          {!loading && !error && (
            <div className="table-card">
              <table className="general-table simple-table">
                <thead>
                  <tr>
                    <th>CAT</th>
                    <th>NATURE</th>
                    <th>J/H</th>
                    <th>DT</th>
                    <th>DT*{multiplier}</th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, index) => (
                    <tr key={index}>
                      <td>{row.cat}</td>
                      <td>{row.nature}</td>
                      <td>{formatNumber(row.hj)}</td>
                      <td>{formatNumber(row.dt)}</td>
                      <td>{formatNumber(row.total)}</td>
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr className="total-row">
                    <td colSpan={2}>TOTAL</td>
                    <td>{formatNumber(totals.totalHj)}</td>
                    <td>{formatNumber(totals.totalDt)}</td>
                    <td>{formatNumber(totals.totalDt350)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default GeneralSummaryPage;