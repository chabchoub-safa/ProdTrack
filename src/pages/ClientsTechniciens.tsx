import React, { useEffect, useMemo, useState } from "react";
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle,
  IonSegment, IonSegmentButton, IonLabel,
  IonSearchbar, IonList, IonItem, IonAvatar, IonModal,
  IonButton, IonIcon 
} from "@ionic/react";
import { closeOutline, createOutline, personOutline } from "ionicons/icons";
import TopMenu from "../components/TopMenu";
import "./ClientsTechniciens.css";

import { listUsersByRole, User } from "../services/auth";
import { listTissusByClient, listTissusByTechnicien, TissuLite } from "../services/tissus.service";

type Mode = "clients" | "techs";

export default function ClientsTechniciens() {
  const [mode, setMode] = useState<Mode>("clients");
  const [q, setQ] = useState("");

  const [clients, setClients] = useState<User[]>([]);
  const [techs, setTechs] = useState<User[]>([]);

  // modal
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [tissus, setTissus] = useState<TissuLite[]>([]);
  const [loadingTissus, setLoadingTissus] = useState(false);

  useEffect(() => {
    (async () => {
      const c = await listUsersByRole("ROLE_CLIENT");
      const t = await listUsersByRole("ROLE_TECHNICIEN");
      setClients(c);
      setTechs(t);
    })();
  }, []);

  const items = mode === "clients" ? clients : techs;

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(u =>
      `${u.nom} ${u.prenom}`.toLowerCase().includes(s) ||
      (u.email || "").toLowerCase().includes(s) ||
      (u.numero || "").toLowerCase().includes(s)
    );
  }, [items, q]);

  const openDetails = async (u: User) => {
    setSelected(u);
    setOpen(true);
    setLoadingTissus(true);
    try {
      const data = mode === "clients"
        ? await listTissusByClient(u.id)
        : await listTissusByTechnicien(u.id);
      setTissus(data);
    } finally {
      setLoadingTissus(false);
    }
  };

  return (
    <IonPage className="page-bg">
         <TopMenu title="👥 Clients & Techniciens" />

      <IonContent className="ion-padding">
  <div className="app-container">

        <div className="card">
          <IonSegment value={mode} onIonChange={(e) => setMode(e.detail.value as Mode)}>
            <IonSegmentButton value="clients">
              <IonLabel>Clients</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="techs">
              <IonLabel>Techniciens</IonLabel>
            </IonSegmentButton>
          </IonSegment>
  <div className="top-row" style={{ marginTop: 10 }}>
        <div className="search">
          <IonSearchbar
            value={q}
            onIonInput={(e) => setQ(String(e.detail.value ?? ""))}
            placeholder={`Rechercher ${mode === "clients" ? "un client" : "un technicien"}...`}
          />
        </div>
 </div>
    </div>
    <div className="list-wrap">
  {filtered.map((u) => (
    <div key={u.id} className="user-card" onClick={() => openDetails(u)}>
      <div className="user-left">
        <div className="user-avatar">
          <IonIcon icon={personOutline} />
        </div>

        <div className="user-text">
          <div className="user-name">{u.nom} {u.prenom}</div>
          <div className="user-sub">{u.email || "-"}</div>
        </div>
      </div>

      {/* <div className="user-right">
        <IonIcon icon={createOutline} />
      </div> */}
    </div>
  ))}
</div>

       <IonModal
  isOpen={open}
  onDidDismiss={() => setOpen(false)}
  className="details-modal"
>
  <IonContent className="modal-content">
    <div className="details-shell">
      <div className="details-head">
        <h3>Détails</h3>
        <button className="details-close" onClick={() => setOpen(false)}>✕</button>
      </div>

      <div className="details-body">
        {selected && (
          <>
            <div className="card">
              <h2 style={{ marginTop: 0 }}>{selected.nom} {selected.prenom}</h2>
              <div className="muted">
                <div><b>Email:</b> {selected.email}</div>
                <div><b>Téléphone:</b> {selected.numero || "-"}</div>
                <div><b>Type:</b> {mode === "clients" ? "Client" : "Technicien"}</div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginTop: 0 }}>
                {mode === "clients" ? "🧵 Article du client" : "🧵 Article en cours (technicien)"}
              </h3>

              {loadingTissus ? (
                <div className="muted">Chargement...</div>
              ) : tissus.length === 0 ? (
                <div className="muted">Aucun Article lié.</div>
              ) : (
                <div className="tissu-list">
                  {tissus.map(t => (
                    <div key={t.id} className="tissu-row">
                      <div className="tissu-code">{t.code}</div>
                      <div className="muted">Statut: {t.statut}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  </IonContent>
</IonModal>
        </div>
      </IonContent>
    </IonPage>
  );
}