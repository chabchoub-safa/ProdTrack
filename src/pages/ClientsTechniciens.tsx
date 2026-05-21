import React, { useEffect, useMemo, useState } from "react";
import {
  IonPage, IonContent, IonHeader, IonToolbar, IonTitle,
  IonSegment, IonSegmentButton, IonLabel,
  IonSearchbar, IonList, IonItem, IonAvatar, IonModal,
  IonButton, IonIcon 
} from "@ionic/react";
import { personOutline, trashOutline, refreshOutline, closeOutline } from "ionicons/icons";
// import { closeOutline, createOutline, personOutline } from "ionicons/icons";
import TopMenu from "../components/TopMenu";
import "./ClientsTechniciens.dark.css";
import "./ClientsTechniciens.light.css";
import "./CommonDesign.dark.css";
import "./CommonDesign.light.css";
import { listDeletedUsers, listUsersByRole, restoreUser, softDeleteUser, User } from "../services/auth";
import { listTissusByClient, listTissusByTechnicien, TissuLite } from "../services/tissus.service";

type Mode = "clients" | "techs" | "admins" | "secretaires";

export default function ClientsTechniciens() {
  const [trashOpen, setTrashOpen] = useState(false);
const [deletedUsers, setDeletedUsers] = useState<User[]>([]);
const [selectedUser, setSelectedUser] = useState<User | null>(null);
const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("clients");
  const [q, setQ] = useState("");

  const [clients, setClients] = useState<User[]>([]);
  const [techs, setTechs] = useState<User[]>([]);
const [admins, setAdmins] = useState<User[]>([]);
const [secretaires, setSecretaires] = useState<User[]>([]);
  // modal
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<User | null>(null);
  const [tissus, setTissus] = useState<TissuLite[]>([]);
  const [loadingTissus, setLoadingTissus] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     const c = await listUsersByRole("ROLE_CLIENT");
  //     const t = await listUsersByRole("ROLE_TECHNICIEN");
      
  //     // const users = await listUsers(undefined, true);
  //     setClients(c);
  //     setTechs(t);
  //   })();
  // }, []);

const currentRole =
  mode === "clients"
    ? "ROLE_CLIENT"
    : mode === "techs"
    ? "ROLE_TECHNICIEN"
    : mode === "admins"
    ? "ROLE_ADMIN"
    : "ROLE_SECRETAIRE";

const loadUsers = async () => {
  const c = await listUsersByRole("ROLE_CLIENT");
  const t = await listUsersByRole("ROLE_TECHNICIEN");
  const a = await listUsersByRole("ROLE_ADMIN");
  const s = await listUsersByRole("ROLE_SECRETAIRE");

  setClients(c);
  setTechs(t);
  setAdmins(a);
  setSecretaires(s);
};

useEffect(() => {
  loadUsers();
}, []);

const items =
  mode === "clients"
    ? clients
    : mode === "techs"
    ? techs
    : mode === "admins"
    ? admins
    : secretaires;



const openTrash = async () => {
  const data = await listDeletedUsers(currentRole);
  setDeletedUsers(data);
  setTrashOpen(true);
};

const askDelete = (u: User) => {
  setSelectedUser(u);
  setConfirmDeleteOpen(true);
};

const askRestore = (u: User) => {
  setSelectedUser(u);
  setConfirmRestoreOpen(true);
};

const onSoftDelete = async (id: string) => {
  if (!selectedUser?.id) return;

  await softDeleteUser(selectedUser.id);
  setConfirmDeleteOpen(false);
  setSelectedUser(null);
  await loadUsers();
};

const onRestore = async (id: string) => {
  if (!selectedUser?.id) return;

  await restoreUser(selectedUser.id);
  setConfirmRestoreOpen(false);
  setSelectedUser(null);

  const data = await listDeletedUsers(currentRole);
  setDeletedUsers(data);
  await loadUsers();
};

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(u =>
      `${u.nom} ${u.prenom}`.toLowerCase().includes(s) ||
      (u.email || "").toLowerCase().includes(s) ||
      (u.numero || "").toLowerCase().includes(s)
    );
  }, [items, q]);

  // const openDetails = async (u: User) => {
  //   setSelected(u);
  //   setOpen(true);
  //   setLoadingTissus(true);
  //   try {
  //     const data = mode === "clients"
  //       ? await listTissusByClient(u.id)
  //       : await listTissusByTechnicien(u.id);
  //     setTissus(data);
  //   } finally {
  //     setLoadingTissus(false);
  //   }
  // };
  const openDetails = async (u: User) => {
  setSelected(u);
  setOpen(true);
  setLoadingTissus(true);
  setTissus([]);

  try {
    let data: TissuLite[] = [];

    if (mode === "clients") {
      data = await listTissusByClient(u.id);
    } else if (mode === "techs") {
      data = await listTissusByTechnicien();
    } else {
      data = [];
    }

    console.log("MODE =", mode);
    console.log("USER ID =", u.id);
    console.log("ARTICLES =", data);

    setTissus(data);
  } catch (e) {
    console.error("Erreur chargement articles liés =", e);
    setTissus([]);
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
 <IonSegmentButton value="admins">
    <IonLabel>Admins</IonLabel>
  </IonSegmentButton>

  <IonSegmentButton value="secretaires">
    <IonLabel>Secrétaires</IonLabel>
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
       <IonButton fill="outline" className="btn-outline" onClick={openTrash}>
  <IonIcon icon={refreshOutline} slot="start" />
  Restart
</IonButton>

<IonModal
  isOpen={confirmRestoreOpen}
  onDidDismiss={() => setConfirmRestoreOpen(false)}
  className="confirm-delete-modal"
>
  <div className="confirm-modal success">
    <div className="modal-head">
      <h3>Restauration</h3>
      <IonButton fill="clear" onClick={() => setConfirmRestoreOpen(false)}>
        <IonIcon icon={closeOutline} />
      </IonButton>
    </div>

    <div className="confirm-body">
      <p>Voulez-vous restaurer cet utilisateur depuis la corbeille ?</p>
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

          if (selectedUser?.id) {
            await onRestore(selectedUser.id);
          }

          setSelectedUser(null);
        }}
      >
        Oui, restaurer
      </IonButton>
    </div>
  </div>
</IonModal>
<IonModal isOpen={trashOpen} onDidDismiss={() => setTrashOpen(false)}>
  <IonContent className="date-modal-content">
    <div className="modal-head">
      <h3>Utilisateurs supprimés</h3>
      <IonButton fill="clear" onClick={() => setTrashOpen(false)}>
        <IonIcon icon={closeOutline} />
      </IonButton>
    </div>

    {deletedUsers.length === 0 ? (
      <p className="b">Aucun utilisateur supprimé.</p>
    ) : (
      deletedUsers.map((u) => (
        <div key={u.id} className="user-card">
          <div className="deleted-user-email">
            <strong>{u.nom} {u.prenom}</strong>
            <div className="deleted-user-email">{u.email}</div>
          </div>

          <IonButton onClick={() => askRestore(u)}>
            <IonIcon icon={refreshOutline} slot="start" />
            Restaurer
          </IonButton>
        </div>
      ))
    )}
  </IonContent>
</IonModal>
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
          <div className="user-name">
            {u.nom} {u.prenom}
          </div>
          <div className="user-sub">{u.email || "-"}</div>
        </div>
      </div>

      <button
        className="btn-delete"
        onClick={(e) => {
          e.stopPropagation();
          askDelete(u);
        }}
      >
        <IonIcon icon={trashOutline} />
      </button>
    </div>
  ))}
</div>
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
      <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
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

          if (selectedUser?.id) {
            await onSoftDelete(selectedUser.id);
          }

          setSelectedUser(null);
        }}
      >
        Oui, supprimer
      </IonButton>
    </div>
  </div>
</IonModal>
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
              {(mode === "clients" || mode === "techs") && (
  <h2 style={{ marginTop: 0 }}>
    {mode === "clients"
      ? "🧵 Article du client"
      : "🧵 Article en cours (technicien)"}
  </h2>
)}
              {/* <h2 style={{ marginTop: 0 }}>
  {mode === "clients"
    ? "🧵 Article du client"
    : mode === "techs"
    ? "🧵 Article en cours (technicien)"
    : ""}
</h2> */}

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