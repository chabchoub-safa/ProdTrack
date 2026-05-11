import React, { useEffect, useState } from "react";
import {
  IonPage, IonContent, IonSearchbar, IonButton, IonIcon, IonModal,
  IonInput, IonToast, IonHeader, IonToolbar, IonTitle
} from "@ionic/react";
import { addOutline, closeOutline, createOutline, trashOutline, powerOutline, waterOutline, flashOutline } from "ionicons/icons";
import "./CommonDesign.dark.css";
import "./CommonDesign.light.css";
import "../services/energy.service";
import "../services/water.service";

import TopMenu from "../components/TopMenu";
import { IonButtons } from "@ionic/react";
import { downloadBlob } from '../utils/downloadHelper';
import {
  listMachines,
  getMachine,
  createMachine,
  updateMachine,
  toggleMachine,
  softDeleteMachine,
  setMachineConsumption,
  listDeletedMachines,
  restoreMachine,
  MachineForm,
} from "../services/machines.service";
import { downloadOutline } from "ionicons/icons";
import { downloadMachineQr } from "../services/machines.service";
import { trashBinOutline, refreshOutline } from "ionicons/icons";
import { getWaterHistoryByRange } from "../services/water.service";
import { getEnergyHistoryByRange } from "../services/energy.service";
export default function Machines() {

 const [selectedYear, setSelectedYear] = useState<number>(2026);
const [selectedMonth, setSelectedMonth] = useState<number>(5);

const [monthlyWater, setMonthlyWater] = useState<number>(0);
const [monthlyEnergy, setMonthlyEnergy] = useState<number>(0);
const getMonthRange = (year: number, month: number) => {
  const start = `${year}-${String(month).padStart(2, "0")}-01T00:00:00`;

  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;

  const end = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01T00:00:00`;

  return { start, end };
};
  const [q, setQ] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [toast, setToast] = useState({ open: false, msg: "" });
// ✅ confirmations (modals)
const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);
const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false);

// ✅ machine ciblée par l’action
const [selectedMachine, setSelectedMachine] = useState<any>(null);
  // add modal
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<MachineForm>({ code: "", nom: "", actif: false });

  // edit modal
  // const [editOpen, setEditOpen] = useState(false);
  // const [editId, setEditId] = useState<string | null>(null);
  // const [editForm, setEditForm] = useState<MachineForm>({ code: "", nom: "", actif: false });

  // details modal (manual consumption)
  const [selected, setSelected] = useState<any>(null);
  const [details, setDetails] = useState<any>(null);
  const [water, setWater] = useState<string>("");
  const [current, setCurrent] = useState<string>("");


  const [trashOpen, setTrashOpen] = useState(false);
const [deletedItems, setDeletedItems] = useState<any[]>([]);
  const load = async () => {
    const data = await listMachines(q.trim() ? q.trim() : undefined);
    setItems(data);
  };
useEffect(() => {
  const loadMonthlyConsumption = async () => {
    try {
      const { start, end } = getMonthRange(selectedYear, selectedMonth);

      const waterHistory = await getWaterHistoryByRange(start, end);
      const energyHistory = await getEnergyHistoryByRange(start, end);

      const totalWater =
  waterHistory.length > 0
    ? waterHistory[waterHistory.length - 1].totalLiters ?? 0
    : 0;

const totalEnergy =
  energyHistory.length > 0
    ? energyHistory[energyHistory.length - 1].energy ?? 0
    : 0;

      const current =
        energyHistory.length > 0
          ? energyHistory[energyHistory.length - 1].current ?? 0
          : 0;

      setMonthlyWater(totalWater);
      setMonthlyEnergy(totalEnergy);
    } catch (error) {
      console.error("Erreur consommation mensuelle:", error);
    }
  };

  loadMonthlyConsumption();
}, [selectedYear, selectedMonth]);
  useEffect(() => { load(); }, []);
  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [q]);

  const openDetails = async (m: any) => {
    setSelected(m);
    const d = await getMachine(m.id);
    setDetails(d);
    setWater(d?.lastWaterLiters != null ? String(d.lastWaterLiters) : "");
    setCurrent(d?.lastCurrentWatts != null ? String(d.lastCurrentWatts) : "");
  };

  const onCreate = async () => {
    try {
      if (!form.code.trim()) return setToast({ open: true, msg: "Code machine obligatoire" });
      if (!form.nom.trim()) return setToast({ open: true, msg: "Nom machine obligatoire" });

      await createMachine({ ...form, actif: !!form.actif });
      setToast({ open: true, msg: "✅ Machine ajoutée" });
      setAddOpen(false);
      setForm({ code: "", nom: "", actif: false });
      load();
    } catch (e: any) {
      setToast({ open: true, msg: e?.response?.data || "❌ Erreur ajout machine" });
    }
  };

  // const openEditModal = (m: any) => {
  //   setEditId(m.id);
  //   setEditForm({ code: m.code ?? "", nom: m.nom ?? "", actif: !!m.actif });
  //   setEditOpen(true);
  // };

  // const onUpdate = async () => {
  //   try {
  //     if (!editId) return;
  //     if (!editForm.code?.trim()) return setToast({ open: true, msg: "Code obligatoire" });
  //     if (!editForm.nom?.trim()) return setToast({ open: true, msg: "Nom obligatoire" });

  //     await updateMachine(editId, editForm);
  //     setToast({ open: true, msg: "✅ Machine mise à jour" });
  //     setEditOpen(false);
  //     setEditId(null);
  //     load();
  //   } catch (e: any) {
  //     setToast({ open: true, msg: e?.response?.data || "❌ Erreur update machine" });
  //   }
  // };

  const onToggle = async (id: string) => {
    try {
      await toggleMachine(id);
      load();
    } catch {
      setToast({ open: true, msg: "❌ Erreur toggle" });
    }
  };

  const onSoftDelete = async (id: string) => {
    try {
      await softDeleteMachine(id);
      setToast({ open: true, msg: "🗑️ Machine supprimée (soft)" });
      load();
      if (selected?.id === id) { setSelected(null); setDetails(null); }
    } catch {
      setToast({ open: true, msg: "❌ Erreur suppression" });
    }
  };

  const onSaveConsumption = async () => {
    try {
      if (!selected?.id) return;

      const w = Number(water);
      const c = Number(current);
      if (Number.isNaN(w) || Number.isNaN(c)) {
        return setToast({ open: true, msg: "Valeurs invalides (eau/courant)" });
      }

      const updated = await setMachineConsumption(selected.id, w, c);
      setDetails(updated);
      setToast({ open: true, msg: "✅ Consommation enregistrée" });
      load();
    } catch (e: any) {
      setToast({ open: true, msg: e?.response?.data || "❌ Erreur consommation" });
    }


  };
// ✅ NOUVEAU — utilise downloadHelper
const downloadQr = async () => {
  try {
    if (!selected?.id) return;
    const blob = await downloadMachineQr(selected.id);
    await downloadBlob(blob, `QR-${selected?.code ?? selected.id}.png`);
    setToast({ open: true, msg: "✅ QR code téléchargé" });
  } catch (e: any) {
    setToast({ open: true, msg: e?.response?.data || "❌ Erreur téléchargement QR" });
  }
};

//   const downloadQr = async () => {
//   try {
//     if (!selected?.id) return;

//     const blob = await downloadMachineQr(selected.id);

//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `QR-${selected?.code ?? selected.id}.png`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     URL.revokeObjectURL(url);

//     setToast({ open: true, msg: "✅ QR code téléchargé" });
//   } catch (e: any) {
//     setToast({ open: true, msg: e?.response?.data || "❌ Erreur téléchargement QR" });
//   }
// };

const openTrash = async () => {
  try {
    const data = await listDeletedMachines();
    setDeletedItems(data);
    setTrashOpen(true);
  } catch {
    setToast({ open: true, msg: "❌ Erreur chargement corbeille" });
  }
};

const onRestore = async (id: string) => {
  try {
    await restoreMachine(id);
    setToast({ open: true, msg: "✅ Machine restaurée" });

    const data = await listDeletedMachines();
    setDeletedItems(data);
    load();
  } catch {
    setToast({ open: true, msg: "❌ Erreur restore" });
  }
};
// ✅ ouvrir confirmation update (depuis modal edit)
// const askUpdate = () => {
//   setConfirmUpdateOpen(true);
// };

// ✅ ouvrir confirmation delete (depuis la card machine)
const askDelete = (m: any) => {
  setSelectedMachine(m);
  setConfirmDeleteOpen(true);
};

// ✅ ouvrir confirmation restore (depuis la corbeille)
const askRestore = (m: any) => {
  setSelectedMachine(m);
  setConfirmRestoreOpen(true);
};
const [lastCurrent, setLastCurrent] = useState<number>(0);
const isTriger1 =
  selected?.nom === "triger1" ||
  selected?.code === "triger1";
  return (
    <IonPage>
      <IonContent className="page-bg">
        <TopMenu title="🧰 Machines" />

        <div className="container">
          <div className="top-row">
            <IonSearchbar
              value={q}
              onIonChange={(e) => setQ(e.detail.value!)}
              placeholder="Rechercher une machine..."
            />
<IonButton fill="outline" className="btn-outline" onClick={openTrash}>
  <IonIcon icon={trashBinOutline} slot="start" />
  Corbeille
</IonButton>
            <IonButton className="btn-main" onClick={() => setAddOpen(true)}>
              <IonIcon icon={addOutline} slot="start" />
              Ajouter
            </IonButton>
          </div>

          {items.map((m) => (
            <div key={m.id} className="card card-tissu machine-card" onClick={() => openDetails(m)}>
              {/* actions top-right */}
              <div className="machine-actions">
                {/* <IonButton
                  className="tissu-edit-btn"
                  fill="clear"
                  onClick={(e) => { e.stopPropagation(); askUpdate }}
                >
                  <IonIcon icon={createOutline} />
                </IonButton> */}

                <IonButton
                  className="tissu-edit-btnn"
                  fill="clear"
                  onClick={(e) => { e.stopPropagation(); askDelete(m); }}
                >
                  <IonIcon icon={trashOutline} />
                </IonButton>
              </div>

              <div className="card-title">{m.code}</div>
              <div className="muted">{m.nom}</div>

              <div className={`badge ${m.actif ? "badge-ok" : "badge-warn"}`}>
                {m.actif ? "ON" : "OFF"}
              </div>

             
            </div>
          ))}
        </div>

{/* <IonModal
  isOpen={confirmUpdateOpen}
  onDidDismiss={() => setConfirmUpdateOpen(false)}
>
  <div className="confirm-modal">
    <div className="modal-head">
      <h3>Confirmation</h3>
      <IonButton fill="clear" onClick={() => setConfirmUpdateOpen(false)}>
        <IonIcon icon={closeOutline} />
      </IonButton>
    </div> */}

    {/* <div className="confirm-body">
      <p>Voulez-vous enregistrer les modifications ?</p>
    </div>

    <div className="confirm-actions">
      <IonButton
        className="btn-cancel"
        fill="outline"
        onClick={() => setConfirmUpdateOpen(false)}
      >
        Annuler
      </IonButton>

      <IonButton
        className="btn-confirm"
        onClick={async () => {
          setConfirmUpdateOpen(false);
          await onUpdate(); // ✅ ta fonction existante
        }}
      >
        Oui, enregistrer
      </IonButton>
    </div>
  </div>
</IonModal> */}

<IonModal
  isOpen={confirmDeleteOpen}
  onDidDismiss={() => setConfirmDeleteOpen(false)}
  className="confirm-delete-modal"
>
 
    <div className="confirm-modal">
      <div className="modal-head">
      <h3>Suppression</h3>
      <IonButton fill="clear" onClick={() => setConfirmDeleteOpen(false)}>
        <IonIcon icon={closeOutline} />
      </IonButton>
    </div>

    <div className="confirm-body">
      <p>Êtes-vous sûr de vouloir supprimer cette machine ?</p>
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
          if (selectedMachine?.id) {
            await onSoftDelete(selectedMachine.id); // ✅ delete après confirmation
          }
          setSelectedMachine(null);
        }}
      >
        Oui, supprimer
      </IonButton>
    </div>
  </div>
</IonModal>

<IonModal className="confirm-restore-modal"
  isOpen={confirmRestoreOpen}
  onDidDismiss={() => setConfirmRestoreOpen(false)}
>
  <div className="confirm-modal success">
    <div className="modal-head">
      <h3>Restauration</h3>
      <IonButton fill="clear" onClick={() => setConfirmRestoreOpen(false)}>
        <IonIcon icon={closeOutline} />
      </IonButton>
    </div>

    <div className="confirm-body">
      <p>Voulez-vous restaurer cette machine depuis la corbeille ?</p>
    </div>

    <div className="confirm-actions">
      <IonButton
        className="btn-cancel"
        fill="outline"
        onClick={() => setConfirmRestoreOpen(false)}
      >
        Annuler
      </IonButton>

      <IonButton
        className="btn-success"
        onClick={async () => {
          setConfirmRestoreOpen(false);
          if (selectedMachine?.id) {
            await onRestore(selectedMachine.id); // ✅ restore après confirmation
          }
          setSelectedMachine(null);
        }}
      >
        Oui, restaurer
      </IonButton>
    </div>
  </div>
</IonModal>



<IonModal isOpen={trashOpen} onDidDismiss={() => setTrashOpen(false)} className="date-modal">
  <IonContent className="date-modal-content">
    <div className="modal-head">
      <h3>🗑️ Corbeille Machines</h3>
      <IonButton fill="clear" onClick={() => setTrashOpen(false)}>
        <IonIcon icon={closeOutline} />
      </IonButton>
    </div>

    {deletedItems.length === 0 ? (
      <div className="muted">Aucune machine supprimée.</div>
    ) : (
      deletedItems.map((m) => (
        <div key={m.id} className="card card-tissu" style={{ cursor: "default" }}>
          <div className="card-title">{m.code}</div>
          <div className="muted">{m.nom}</div>

          <div className="row" style={{ marginTop: 10 }}>
            <IonButton className="btn-main" onClick={() => askRestore(m)}>
              <IonIcon icon={refreshOutline} slot="start" />
              Restore
            </IonButton>
          </div>
        </div>
      ))
    )}
  </IonContent>
</IonModal>
        {/* ADD MODAL */}
        <IonModal isOpen={addOpen} onDidDismiss={() => setAddOpen(false)} className="date-modal">
          <IonContent className="date-modal-content">
            <div className="modal-head">
              <h3>Ajouter une machine</h3>
              <IonButton fill="clear" onClick={() => setAddOpen(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </div>

            <div className="field">
              <label className="label">Code machine</label>
              <IonInput className="input-plain" value={form.code}
                placeholder="M-01"
                onIonInput={(e) => setForm({ ...form, code: String(e.detail.value ?? "") })}
              />
            </div>

            <div className="field">
              <label className="label">Nom machine</label>
              <IonInput className="input-plain" value={form.nom}
                placeholder="Jigger 1"
                onIonInput={(e) => setForm({ ...form, nom: String(e.detail.value ?? "") })}
              />
            </div>

            <div className="row">
              <IonButton className="go-btn" fill="outline" onClick={onCreate}>
                Ajouter
              </IonButton>
            </div>
          </IonContent>
        </IonModal>

        {/* EDIT MODAL
        <IonModal isOpen={editOpen} onDidDismiss={() => setEditOpen(false)} className="date-modal">
          <IonContent className="date-modal-content">
            <div className="modal-head">
              <h3>Modifier la machine</h3>
              <IonButton fill="clear" onClick={() => setEditOpen(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </div>

            <div className="field">
              <label className="label">Code machine</label>
              <IonInput className="input-plain" value={editForm.code}
                onIonInput={(e) => setEditForm({ ...editForm, code: String(e.detail.value ?? "") })}
              />
            </div>

            <div className="field">
              <label className="label">Nom machine</label>
              <IonInput className="input-plain" value={editForm.nom}
                onIonInput={(e) => setEditForm({ ...editForm, nom: String(e.detail.value ?? "") })}
              />
            </div>

            <div className="row">
              <IonButton className="go-btn" fill="outline" onClick={onUpdate}>
                Mettre à jour
              </IonButton>
            </div>
          </IonContent>
        </IonModal> */}

        {/* DETAILS MODAL */}
        <IonModal isOpen={!!selected} onDidDismiss={() => { setSelected(null); setDetails(null); }}>
         <IonHeader>
  <IonToolbar>
    <IonTitle>Détails Article</IonTitle>

    <IonButtons slot="end">
      <IonButton
        fill="clear"
        onClick={() => {
          setSelected(null);
          setDetails(null);
        }}
      >
        <IonIcon icon={closeOutline} />
      </IonButton>
    </IonButtons>
  </IonToolbar>
</IonHeader>

          <IonContent className="modal-content">
            <div className="container">
              {selected && (
                <>
                  <div className="card">
                    <div className="card-title">{selected.code} — {selected.nom}</div>
                    <div className="muted">État: {details?.actif ? "ON" : "OFF"}</div>
                  </div>
<IonButton className="btn-outline" fill="outline" onClick={downloadQr}>
  <IonIcon icon={downloadOutline} slot="start" />
  Télécharger QR Code
</IonButton>
                 <div className="card">
  <div className="card-title">Consommation réelle machine</div>

  {isTriger1 ? (
    <div className="sensor-grid">
      <div className="sensor-box">
        <IonIcon icon={waterOutline} />
        <span>Eau</span>
        <strong>{monthlyWater?.toFixed(2) ?? "0.00"} L</strong>
      </div>

      <div className="sensor-box">
        <IonIcon icon={flashOutline} />
        <span>Électricité</span>
        <strong>{monthlyEnergy?.toFixed(2) ?? "0.00"} A</strong>
      </div>
    </div>
  ) : (
    <p className="no-consumption">
      Consommation non disponible pour cette machine
    </p>
  )}
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