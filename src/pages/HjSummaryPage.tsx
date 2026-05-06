
import React, { useEffect, useMemo, useState } from "react";
import {
  IonPage,
  IonContent,
  IonSpinner,
  IonSearchbar,
  IonButton,
} from "@ionic/react";
import { listHjSummary, HjSummaryRow } from "../services/hjSummary.service";
import "./HjSummaryPage.css";
import Menusec from "../components/Menusec";

const HjSummaryPage: React.FC = () => {
  const [rows, setRows] = useState<HjSummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const data = await listHjSummary();
      setRows(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter(
      (r) =>
        r.cat.toLowerCase().includes(s) ||
        r.nature.toLowerCase().includes(s)
    );
  }, [rows, q]);

  const total = useMemo(() => {
    return filtered.reduce(
      (acc, row) => {
        acc.abdlhmid += row.abdlhmid || 0;
        acc.insaf += row.insaf || 0;
        acc.rachida += row.rachida || 0;
        acc.majdi += row.majdi || 0;
        acc.chourouk += row.chourouk || 0;
        return acc;
      },
      {
        abdlhmid: 0,
        insaf: 0,
        rachida: 0,
        majdi: 0,
        chourouk: 0,
      }
    );
  }, [filtered]);

  const formatCell = (value: number) => {
    return !value || value === 0 ? "--" : value.toFixed(2);
  };

  return (
    <IonPage>
      <IonContent className="hj-page">
        <Menusec title="H/J Par Person" />
        <div className="hj-container">
          <div className="hj-topbar">
            <IonSearchbar
              value={q}
              onIonInput={(e) => setQ(e.detail.value || "")}
              placeholder="Rechercher par CAT ou NATURE"
            />
            <IonButton onClick={load}>Actualiser</IonButton>
          </div>

          {loading ? (
            <div className="hj-loading">
              <IonSpinner name="crescent" />
            </div>
          ) : (
            <div className="hj-table-wrap">
              <table className="hj-table">
                <thead>
                  <tr>
                    <th>CAT</th>
                    <th>NATURE</th>
                    <th>abdlhmid</th>
                    <th>insaf</th>
                    <th>rachida</th>
                    <th>majdi</th>
                    <th>chourouk</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, index) => (
                    <tr key={`${row.cat}-${row.nature}-${index}`}>
                      <td>{row.cat}</td>
                      <td>{row.nature}</td>
                      <td>{formatCell(row.abdlhmid)}</td>
                      <td>{formatCell(row.insaf)}</td>
                      <td>{formatCell(row.rachida)}</td>
                      <td>{formatCell(row.majdi)}</td>
                      <td>{formatCell(row.chourouk)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan={2}>TOTAL</th>
                    <th>{formatCell(total.abdlhmid)}</th>
                    <th>{formatCell(total.insaf)}</th>
                    <th>{formatCell(total.rachida)}</th>
                    <th>{formatCell(total.majdi)}</th>
                    <th>{formatCell(total.chourouk)}</th>
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

export default HjSummaryPage;