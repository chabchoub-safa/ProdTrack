import React, { useEffect, useState } from "react";
import {
  IonPage, IonContent, IonSearchbar, IonModal,
  IonHeader, IonToolbar, IonTitle, IonButton, IonIcon, IonToast
} from "@ionic/react";
import { closeOutline, downloadOutline } from "ionicons/icons";
import "./CommonDesign.css";
import TopMenu from "../components/Menuclient";
import { listMyTissus, getTissuDetailsClient, generateDemandePdf } from "../services/tissus.service";
import Menuclient from "../components/Menuclient";
import { downloadBlob } from '../utils/downloadHelper';
import { listMachines } from "../services/machines.service";
export default function ClientTissus() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [details, setDetails] = useState<any>(null);
  const [toast, setToast] = useState({ open: false, msg: "" });
const [machineCodeMap, setMachineCodeMap] = useState<Record<string, string>>({});

const loadMachineCodes = async () => {
  try {
    const data = await listMachines();
    const arr = Array.isArray(data) ? data : [];

    const map: Record<string, string> = {};
    arr.forEach((m: any) => {
      if (m?.id) {
        map[m.id] = m.code || m.nom || "--";
      }
    });

    setMachineCodeMap(map);
  } catch (e) {
    console.error("Erreur chargement machines", e);
  }
};

useEffect(() => {
  loadMachineCodes();
}, []);  const load = async () => {
    try {
      const data = await listMyTissus(q.trim() ? q.trim() : undefined);
      setItems(data);
    } catch (e: any) {
      setToast({ open: true, msg: e?.response?.data || "❌ Erreur chargement" });
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [q]);

  const openDetails = async (t: any) => {
    try {
      setSelected(t);
      const d = await getTissuDetailsClient(t.id);
      setDetails(d);
    } catch (e: any) {
      setToast({ open: true, msg: e?.response?.data || "❌ Erreur détails" });
    }
  };

  // const downloadBlob = (blob: Blob, filename: string) => {
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url; a.download = filename; a.click();
  //   window.URL.revokeObjectURL(url);
  // };

  const downloadGeneratedDemande = async () => {
    try {
      const blob = await generateDemandePdf(selected.id);
      downloadBlob(blob, `demande_${selected.code}.pdf`);
    } catch (e: any) {
      setToast({ open: true, msg: e?.response?.data || "❌ Erreur PDF" });
    }
  };

  return (
    <IonPage>
      <IonContent className="page-bg">
        <Menuclient title="🧵 Mes Article" />

        <div className="container">
          
          <div className="top-row">
            <IonSearchbar
              value={q}
              onIonChange={(e) => setQ(e.detail.value!)}
              placeholder="Rechercher un Article..."
            />
            {/* ✅ pas de bouton Ajouter */}
          </div>

          {items.map((t) => (
            <div key={t.id} className="card card-tissu" onClick={() => openDetails(t)}>
              <div className="card-title">{t.demande?.referenceSupportClient}</div>
 <div className="muted" >
  <strong>Date réception :</strong>{" "}
  {t.demande?.dateReception
    ? new Date(t.demande.dateReception).toLocaleDateString("fr-FR")
    : "-"}
</div>
              <div className={`badge ${
                t.statut === "LIVRE" ? "badge-ok" : (t.statut === "EN_TRAITEMENT" ? "badge-warn" : "badge-stock")
              }`}>
                {t.statut === "LIVRE" ? "Livré" : (t.statut === "EN_TRAITEMENT" ? "En traitement" : "En stock")}
              </div>
             


            </div>
          ))}
          
        </div>

       {/* ✅ Modal détails client */}
<IonModal
  isOpen={!!selected}
  onDidDismiss={() => {
    setSelected(null);
    setDetails(null);
  }}
>
  <IonHeader>
    <IonToolbar>
      <IonTitle>Détails Article</IonTitle>
      <IonButton
        slot="end"
        fill="clear"
        onClick={() => {
          setSelected(null);
          setDetails(null);
        }}
      >
        <IonIcon icon={closeOutline} />
      </IonButton>
    </IonToolbar>
  </IonHeader>

  <IonContent className="modal-content">
    <div className="container">
      {selected && (
        <>
          <div className="card">
            <div className="card-title">{selected.demande?.referenceSupportClient}</div>

            <div className="muted">
              Statut : {selected.statut || "-"}
              <br />
              Date réception :{" "}
              {selected.demande?.dateReception
                ? new Date(selected.demande.dateReception).toLocaleDateString("fr-FR")
                : "-"}
              <br />
              Date lancement :{" "}
              {selected.demande?.dateLancement
                ? new Date(selected.demande.dateLancement).toLocaleString("fr-FR")
                : "-"}
              <br />
          
            </div>
          </div>

          {/* ✅ Tous les attributs du PDF */}
          <div className="card">
            <div className="card-title">Informations demande</div>

            <div className="details-grid">
              <p><strong>N° Demande :</strong> {selected.demande?.numeroDemande || "-"}</p>
           

      

              <p><strong>Délai :</strong> {selected.demande?.delai || "-"}</p>
              <p><strong>Support :</strong> {selected.demande?.support || "-"}</p>

              <p><strong>Composition :</strong> {selected.demande?.Composition || selected.demande?.composition || "-"}</p>
              <p><strong>Process :</strong> {selected.demande?.Process || selected.demande?.process || "-"}</p>
              <p><strong>Désignateur :</strong> {selected.demande?.Disignateur || selected.demande?.disignateur || "-"}</p>

              <p><strong>Couleur envoyée :</strong> {selected.demande?.couleurEnvoyee || "-"}</p>
              <p><strong>Couleur demandée :</strong> {selected.demande?.ColorantDemandee || selected.demande?.colorantDemandee || "-"}</p>
              <p><strong>Standard client :</strong> {selected.demande?.StandardClient || selected.demande?.standardClient || "-"}</p>

              <p><strong>Recette :</strong> {selected.demande?.Recette || selected.demande?.codeRecette || "-"}</p>
              <p><strong>Quantité :</strong> {selected.demande?.Quantite || selected.demande?.dimensions || "-"}</p>
              <p><strong>Prix :</strong> {selected.demande?.Prix || selected.demande?.prix || "-"}</p>
              <p><strong>Remarques :</strong> {selected.demande?.remarques || "-"}</p>
            </div>
          </div>

          {/* ✅ Télécharger PDF */}
          <div className="card">
            <div className="card-title">Documents</div>

            <div className="row">
              <IonButton
                className="btn-outline"
                onClick={downloadGeneratedDemande}
                disabled={!selected?.id}
              >
                <IonIcon icon={downloadOutline} slot="start" />
                Télécharger demande PDF
              </IonButton>
            </div>
          </div>

          {/* ✅ Temps par machine */}
          <div className="card">
            <div className="card-title">Temps par machine</div>

            {details?.secondsByMachine
              ? Object.entries(details.secondsByMachine).map(([mid, sec]: any) => (
                  <div key={mid} className="muted">
                    Machine {machineCodeMap[mid] || mid} :{" "}
                    {Math.round(Number(sec) / 60)} min
                  </div>
                ))
              : <div className="muted">Aucune donnée</div>
            }
          </div>
        </>
      )}
    </div>
  </IonContent>
</IonModal>

        <IonToast
          isOpen={toast.open}
          message={toast.msg}
          duration={1600}
          onDidDismiss={() => setToast({ open: false, msg: "" })}
        />
      </IonContent>
    </IonPage>
  );
}