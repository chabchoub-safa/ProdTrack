import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonModal,
  IonInput,
  IonTextarea,
  IonAlert,
  IonToast,
} from "@ionic/react";
import {
  addOutline,
  closeOutline,
  createOutline,
  trashOutline,
  checkmarkDoneOutline,
} from "ionicons/icons";

import TopMenu from "../components/TopMenu";
import "./CommonDesign.css"; // ✅ même design que Tissus :contentReference[oaicite:1]{index=1}
import "./Rappels.css";  // (optionnel) juste pour "done" etc.

import {
  createRappel,
  deleteRappel,
  listRappels,
  markDoneRappel,
  updateRappel,
  RappelForm,
} from "../services/rappelsApi";

type Rappel = any;

export default function RappelsPage() {
  const [items, setItems] = useState<Rappel[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [toast, setToast] = useState({ open: false, msg: "" });

const [confirmEditOpen, setConfirmEditOpen] = useState(false);
const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
const [confirmDoneOpen, setConfirmDoneOpen] = useState(false);

const [selectedRappel, setSelectedRappel] = useState<any>(null);

  const empty: RappelForm = {
    nom: "",
    description: "",
    adminEmail: "",
    technicienEmail: "",
    prochaineDate: "",
    frequenceJours: 365,
  };

  const [form, setForm] = useState<RappelForm>(empty);

  const load = async () => {
    const data = await listRappels(q.trim() ? q.trim() : undefined);
    setItems(data);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [q]);

  const openAdd = () => {
    setEditId(null);
    setForm(empty);
    setOpen(true);
  };

  const openEdit = (r: Rappel) => {
    setEditId(r.id);
    setForm({
      nom: r.nom ?? "",
      description: r.description ?? "",
      adminEmail: r.adminEmail ?? "",
      technicienEmail: r.technicienEmail ?? "",
      prochaineDate: r.prochaineDate ?? "",
      frequenceJours: r.frequenceJours ?? 365,
    });
    setOpen(true);
  };

  const save = async () => {
    try {
      if (!form.nom?.trim()) return setToast({ open: true, msg: "Nom obligatoire" });
      if (!form.prochaineDate) return setToast({ open: true, msg: "Date obligatoire" });
      if (!form.adminEmail?.trim()) return setToast({ open: true, msg: "Email admin obligatoire" });

      if (editId) {
        await updateRappel(editId, form);
        setToast({ open: true, msg: "✅ Rappel mis à jour" });
      } else {
        await createRappel(form);
        setToast({ open: true, msg: "✅ Rappel ajouté" });
      }

      setOpen(false);
      setEditId(null);
      await load();
    } catch (e: any) {
      setToast({ open: true, msg: e?.response?.data || "❌ Erreur sauvegarde" });
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteRappel(id);
      setToast({ open: true, msg: "🗑️ Rappel supprimé" });
      await load();
    } catch {
      setToast({ open: true, msg: "❌ Erreur suppression" });
    }
  };

  const done = async (id: string) => {
    try {
      await markDoneRappel(id, true);
      setToast({ open: true, msg: "✅ Marqué comme fait" });
      await load();
    } catch {
      setToast({ open: true, msg: "❌ Erreur done" });
    }
  };

  return (
    <IonPage>
      <IonContent className="page-bg">
        {/* ✅ même header que Tissus */}
        <TopMenu title="🔔 Rappels & Maintenance" />

        <div className="container">
          {/* ✅ top-row + searchbar + btn-main comme Tissus */}
          <div className="top-row">
            <IonSearchbar
              value={q}
              onIonChange={(e) => setQ(e.detail.value!)}
              placeholder="Rechercher un rappel..."
            />
            <IonButton className="btn-main" onClick={openAdd}>
              <IonIcon icon={addOutline} slot="start" />
              Ajouter
            </IonButton>
          </div>

          {/* ✅ cards comme Tissus */}
          {items.map((r) => (
            <div key={r.id} className={`card rappel-card ${r.done ? "rappel-done" : ""}`}>
              <div className="card-title">{r.nom}</div>

              <div className="muted" style={{ marginTop: 6 }}>
                📅 Prochaine date: {r.prochaineDate || "-"} <br />
                ⏱️ Chaque: {r.frequenceJours} jours <br />
                👤 Admin: {r.adminEmail || "-"} <br />
                {r.technicienEmail ? <>🧰 Technicien: {r.technicienEmail}</> : null}
              </div>

              {r.description ? <div className="muted" style={{ marginTop: 10 }}>{r.description}</div> : null}

              <div className="row" style={{ marginTop: 12, gap: 10 }}>
              <IonButton
  className="btn-outline"
  onClick={() => {
    setSelectedRappel(r);
    setConfirmEditOpen(true);
  }}
>
  <IonIcon icon={createOutline} slot="start" />
  Modifier
</IonButton>

<IonButton
  className="go-btn"
  fill="outline"
  onClick={() => {
    setSelectedRappel(r);
    setConfirmDoneOpen(true);
  }}
  disabled={r.done}
>
  <IonIcon icon={checkmarkDoneOutline} slot="start" />
  Done
</IonButton>

<IonButton
  className="btn-danger"
  onClick={() => {
    setSelectedRappel(r);
    setConfirmDeleteOpen(true);
  }}
>
  <IonIcon icon={trashOutline} slot="start" />
  Supprimer
</IonButton>
              </div>
            </div>
          ))}

          
        </div>


<IonModal
  isOpen={confirmEditOpen}
  onDidDismiss={() => setConfirmEditOpen(false)}className="confirm-update-modal"
>
  <div className="confirm-modal">
    <div className="modal-head">
          <h3>Confirmation</h3>
          <IonButton fill="clear" onClick={() => setConfirmEditOpen(false)}>
            <IonIcon icon={closeOutline} />
          </IonButton>
        </div>
    
        <div className="confirm-body">
          <p>Voulez-vous modifier ce rappel ?</p>
        </div>
    
        <div className="confirm-actions">
          <IonButton
            className="btn-cancel"
            fill="outline"
            onClick={() => setConfirmEditOpen(false)}
          >
            Annuler
          </IonButton>
    
         <IonButton
        className="btn-confirm"
        onClick={() => {
          setConfirmEditOpen(false);
          if (selectedRappel) {
            openEdit(selectedRappel);
          }
        }}
          >
            Oui, modifier
          </IonButton>
        </div>
    
      </div>
    
    </IonModal>



<IonModal
  isOpen={confirmDeleteOpen}
  onDidDismiss={() => setConfirmDeleteOpen(false)} className="confirm-delete-modal"
>
  <div className="confirm-modal danger">
    <div className="modal-head">
      <h3>Suppression</h3>
      <IonButton fill="clear" onClick={() => setConfirmDeleteOpen(false)}>
        <IonIcon icon={closeOutline} />
      </IonButton>
    </div>

    <div className="confirm-body">
      <p>Êtes-vous sûr de vouloir supprimer ce rappel ?</p>
    </div>

    <div className="confirm-actions">
      <IonButton
        className="btn-cancel"
        fill="outline"
        onClick={() => setConfirmDeleteOpen(false)}
      >
        Annuler
      </IonButton>

      <IonButton
        className="btn-danger"
        onClick={async () => {
          setConfirmDeleteOpen(false);
          if (selectedRappel) {
            await remove(selectedRappel.id);
          }
        }}
      >
        Oui, supprimer
      </IonButton>
    </div>

  </div>
</IonModal>


<IonModal
  isOpen={confirmDoneOpen}
  onDidDismiss={() => setConfirmDoneOpen(false)} className="confirm-done-modal"
>
  <div className="confirm-modal danger">
    <div className="modal-head">
      <h3>Validation</h3>
      <IonButton fill="clear" onClick={() => setConfirmDoneOpen(false)}>
        <IonIcon icon={closeOutline} />
      </IonButton>
    </div>

    <div className="confirm-body">
      <p>Confirmer que le rappel est terminé ?</p>
    </div>

    <div className="confirm-actions">
      <IonButton
        className="btn-cancel"
        fill="outline"
        onClick={() => setConfirmDoneOpen(false)}
      >
        Annuler
      </IonButton>

      <IonButton
        className="btn-success"
        onClick={async () => {
          setConfirmDoneOpen(false);
          if (selectedRappel) {
            await done(selectedRappel.id);
          }
        }}
      >
        Oui, terminé
      </IonButton>
    </div>

  </div>
</IonModal>


        {/* ✅ Modal style comme Tissus (modal-head + input-plain + go-btn) */}
        <IonModal isOpen={open} onDidDismiss={() => setOpen(false)} className="date-modal">
          <IonContent className="date-modal-content">
            <div className="modal-head">
              <h3>{editId ? "Modifier un rappel" : "Ajouter un rappel"}</h3>
              <IonButton fill="clear" onClick={() => setOpen(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </div>

            <div className="field">
              <label className="label">Nom du rappel</label>
              <IonInput
                className="input-plain"
                value={form.nom}
                placeholder="Maintenance machine 01"
                onIonInput={(e) => setForm({ ...form, nom: String(e.detail.value ?? "") })}
              />
            </div>

            <div className="field">
              <label className="label">Date (Jour J)</label>
              <IonInput
                className="input-plain"
                type="date"
                value={form.prochaineDate}
                onIonInput={(e) => setForm({ ...form, prochaineDate: String(e.detail.value ?? "") })}
              />
            </div>

            <div className="field">
              <label className="label">Fréquence (jours)</label>
              <IonInput
                className="input-plain"
                type="number"
                value={form.frequenceJours}
                onIonInput={(e) => setForm({ ...form, frequenceJours: Number(e.detail.value ?? 0) })}
              />
            </div>

            <div className="field">
              <label className="label">Email Administration</label>
              <IonInput
                className="input-plain"
                value={form.adminEmail}
                placeholder="admin@societe.tn"
                onIonInput={(e) => setForm({ ...form, adminEmail: String(e.detail.value ?? "") })}
              />
            </div>

            <div className="field">
              <label className="label">Email Technicien (optionnel)</label>
              <IonInput
                className="input-plain"
                value={form.technicienEmail}
                placeholder="technicien@societe.tn"
                onIonInput={(e) => setForm({ ...form, technicienEmail: String(e.detail.value ?? "") })}
              />
            </div>

            <div className="field">
              <label className="label">Description</label>
              <IonTextarea
                className="input-plain"
                value={form.description}
                placeholder="Détails du rappel..."
                onIonInput={(e) => setForm({ ...form, description: String(e.detail.value ?? "") })}
              />
            </div>

            <div className="row">
              <IonButton className="go-btn" fill="outline" onClick={save}>
                <IonIcon icon={addOutline} slot="start" />
                {editId ? "Enregistrer" : "Ajouter"}
              </IonButton>
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