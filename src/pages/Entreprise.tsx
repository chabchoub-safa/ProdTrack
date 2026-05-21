import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonSearchbar,
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonToast,
  IonButtons,
  IonAlert,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";

import {
  addOutline,
  createOutline,
  trashOutline,
  eyeOutline,
  closeOutline,
  businessOutline,
  star,
  starOutline,
  refreshOutline,
} from "ionicons/icons";
import {
  Entreprise as EntrepriseForm,
  EntrepriseStats as EntrepriseType,
  getEntreprises,
  createEntreprise,
  updateEntreprise,
  deleteEntreprise,
  restoreEntreprise,
} from "../services/entrepriseService";

import Menusec from "../components/Menusec";

import "./Entreprise.dark.css";
import "./Entreprise.light.css";

const emptyForm: EntrepriseForm = {
  nomEntreprise: "",
  adresse: "",
  contact: "",
  specialite: "",
  extensions: [],
};

export default function Entreprise() {
  const [entreprises, setEntreprises] = useState<EntrepriseType[]>([]);
  const [form, setForm] = useState<EntrepriseForm>(emptyForm);
  const [selected, setSelected] = useState<EntrepriseType | null>(null);

  const [q, setQ] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const [showTrash, setShowTrash] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EntrepriseType | null>(null);

const [loading, setLoading] = useState(false);

useEffect(() => {
  loadData(showTrash);
}, [showTrash]);

const loadData = async (trashValue: boolean) => {
  try {
    setLoading(true);
    setEntreprises([]); // ✅ vide l’ancienne liste directement

    const data = await getEntreprises(trashValue);
    setEntreprises(data);
  } catch (error) {
    console.error(error);
    setToast("Erreur chargement entreprises");
  } finally {
    setLoading(false);
  }
};
const displayedEntreprises = entreprises.filter((e) => {
  const text = q.toLowerCase().trim();

  if (!text) return true;

  return (
    e.nomEntreprise?.toLowerCase().includes(text) ||
    e.specialite?.toLowerCase().includes(text) ||
    e.contact?.toLowerCase().includes(text)
  );
});
  const getStars = (nb: number) => {
    if (nb >= 20) return 5;
    if (nb >= 15) return 4;
    if (nb >= 10) return 3;
    if (nb >= 5) return 2;
    if (nb >= 1) return 1;
    return 0;
  };

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (e: EntrepriseType) => {
    setForm({
      nomEntreprise: e.nomEntreprise || "",
      adresse: e.adresse || "",
      contact: e.contact || "",
      specialite: e.specialite || "",
      extensions: e.extensions || [],
    });

    setEditId(e.id || null);
    setShowForm(true);
  };

  const openDetails = (e: EntrepriseType) => {
    setSelected(e);
    setShowDetails(true);
  };

  const save = async () => {
    if (!form.nomEntreprise.trim()) {
      setToast("Le nom de l'entreprise est obligatoire");
      return;
    }

    if (!form.contact.trim()) {
      setToast("Le contact est obligatoire");
      return;
    }

    const data = {
      ...form,
      nomEntreprise: form.nomEntreprise.trim(),
      contact: form.contact.trim(),
      extensions:
        typeof form.extensions === "string"
          ? String(form.extensions)
              .split(",")
              .map((x) => x.trim())
              .filter((x) => x !== "")
          : form.extensions,
    };

    if (editId) {
      await updateEntreprise(editId, data);
      setToast("Entreprise modifiée avec succès");
    } else {
      await createEntreprise({
        ...data,
        deleted: false,
        deletedAt: null,
      } as any);

      setToast("Entreprise ajoutée avec succès");
    }

    setShowForm(false);
    loadData(showTrash);
  };


const softDelete = async () => {
  if (!deleteTarget?.id) return;

  try {
    const id = deleteTarget.id;

    await deleteEntreprise(id);

    setEntreprises((prev) => prev.filter((e) => e.id !== id));
    setDeleteTarget(null);
    setToast("Entreprise déplacée vers la corbeille");
  } catch (error) {
    console.error(error);
    setToast("Erreur suppression entreprise");
  }
};

const restore = async (e: EntrepriseType) => {
  if (!e.id) return;

  try {
    const id = e.id;

    await restoreEntreprise(id);

    // ✅ enlève directement l’entreprise restaurée de la corbeille
    setEntreprises((prev) => prev.filter((x) => x.id !== id));

    setToast("Entreprise restaurée");
  } catch (error) {
    console.error(error);
    setToast("Erreur restauration entreprise");
  }
};
  return (
    <IonPage>
      <IonContent className="entreprise-page">
        <Menusec title="entreprise" />

        <div className="entreprise-container">
          <div className="entreprise-top-actions">
            <IonSearchbar
              value={q}
              onIonInput={(e) => setQ(e.detail.value || "")}
              placeholder="Rechercher par nom, spécialité ou contact..."
              className="entreprise-search"
            />

            <IonButton className="entreprise-add-btn" onClick={openAdd}>
              <IonIcon icon={addOutline} />
              Ajouter
            </IonButton>
          </div>

        
<IonSegment
  value={showTrash ? "trash" : "active"}
  onIonChange={(e) => {
    setShowTrash(e.detail.value === "trash");
  }}
  className="entreprise-segment"
>
  <IonSegmentButton value="active">
    Entreprises
  </IonSegmentButton>

  <IonSegmentButton value="trash">
    Corbeille
  </IonSegmentButton>
</IonSegment>
          <div className="entreprise-grid">
            
            {loading ? (
  <div className="empty-trash-message">Chargement...</div>
) : displayedEntreprises.length === 0 ? (
  <div className="empty-trash-message">
    {showTrash
      ? "Il n’existe aucune entreprise supprimée"
      : "Aucune entreprise trouvée"}
  </div>
) : (
  displayedEntreprises.map((e) => {
              const starsCount = getStars(e.totalCollaborations || 0);

              return (
                <div className="entreprise-card" key={e.id}>
                  <div className="entreprise-card-header">
                    <div className="entreprise-icon">
                      <IonIcon icon={businessOutline} />
                    </div>

                    <div>
                      <h3>{e.nomEntreprise}</h3>
                      <p>{e.specialite}</p>
                    </div>
                  </div>

                  <div className="stars">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <IonIcon
                        key={n}
                        icon={n <= starsCount ? star : starOutline}
                      />
                    ))}
                  </div>

                  <p className="activity">
                    {e.totalCollaborations || 0} activité(s) avec cette société
                  </p>

                  <div className="card-actions">
                    <IonButton fill="clear" onClick={() => openDetails(e)}>
                      <IonIcon icon={eyeOutline} />
                    </IonButton>

                    {!showTrash && (
                      <IonButton fill="clear" onClick={() => openEdit(e)}>
                        <IonIcon icon={createOutline} />
                      </IonButton>
                    )}

                    {showTrash ? (
                      <IonButton
                        fill="clear"
                        color="success"
                        onClick={() => restore(e)}
                      >
                        <IonIcon icon={refreshOutline} />
                      </IonButton>
                    ) : (
                      <IonButton
                        fill="clear"
                        color="danger"
                        onClick={() => setDeleteTarget(e)}
                      >
                        <IonIcon icon={trashOutline} />
                      </IonButton>
                    )}
                  </div>
                </div>
              );
            }))}
          </div>
        </div>

        <IonModal isOpen={showForm} onDidDismiss={() => setShowForm(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>
                {editId ? "Modifier entreprise" : "Nouvelle entreprise"}
              </IonTitle>

              <IonButtons slot="end">
                <IonButton onClick={() => setShowForm(false)}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="modal-content">
            <IonItem>
              <IonLabel position="stacked">Nom entreprise *</IonLabel>
              <IonInput
                required
                value={form.nomEntreprise}
                onIonInput={(e) =>
                  setForm({
                    ...form,
                    nomEntreprise: e.detail.value || "",
                  })
                }
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Adresse</IonLabel>
              <IonInput
                value={form.adresse}
                onIonInput={(e) =>
                  setForm({
                    ...form,
                    adresse: e.detail.value || "",
                  })
                }
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Contact *</IonLabel>
              <IonInput
                required
                value={form.contact}
                onIonInput={(e) =>
                  setForm({
                    ...form,
                    contact: e.detail.value || "",
                  })
                }
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Spécialité</IonLabel>
              <IonInput
                value={form.specialite}
                onIonInput={(e) =>
                  setForm({
                    ...form,
                    specialite: e.detail.value || "",
                  })
                }
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Extensions</IonLabel>
              <IonTextarea
                value={
                  Array.isArray(form.extensions)
                    ? form.extensions.join(", ")
                    : form.extensions
                }
                placeholder="Exemple: teinture, lavage, finition"
                onIonInput={(e) =>
                  setForm({
                    ...form,
                    extensions: (e.detail.value || "")
                      .split(",")
                      .map((x) => x.trim())
                      .filter((x) => x !== ""),
                  })
                }
              />
            </IonItem>

            <IonButton expand="block" className="save-btn" onClick={save}>
              Enregistrer
            </IonButton>
          </IonContent>
        </IonModal>

        <IonModal
          isOpen={showDetails}
          onDidDismiss={() => setShowDetails(false)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Détails entreprise</IonTitle>

              <IonButtons slot="end">
                <IonButton onClick={() => setShowDetails(false)}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="modal-content">
            {selected && (
              <div className="details-box">
                <h2>{selected.nomEntreprise}</h2>

                <p>
                  <strong>Adresse :</strong> {selected.adresse}
                </p>

                <p>
                  <strong>Contact :</strong> {selected.contact}
                </p>

                <p>
                  <strong>Spécialité :</strong> {selected.specialite}
                </p>

                <p>
                  <strong>Total collaborations :</strong>{" "}
                  {selected.totalCollaborations}
                </p>

                <p>
                  <strong>Formations :</strong> {selected.nombreFormations}
                </p>

                <p>
                  <strong>Assistance technique :</strong>{" "}
                  {selected.nombreAssTech}
                </p>

                <p>
                  <strong>Diagnostics :</strong> {selected.nombreDiagnostics}
                </p>

                <p>
                  <strong>ITS :</strong> {selected.nombreITS}
                </p>

                <p>
                  <strong>Plans d’action :</strong>{" "}
                  {selected.nombrePlansAction}
                </p>

                <h4>Extensions</h4>

                <div className="extension-list">
                  {selected.extensions?.map((ext, index) => (
                    <span key={index}>{ext}</span>
                  ))}
                </div>
              </div>
            )}
          </IonContent>
        </IonModal>

        {deleteTarget && (
  <div className="delete-confirm-backdrop">
    <div className="delete-confirm-box">
      <div className="delete-confirm-header">
        <h3>Suppression</h3>

        <IonButton
          className="delete-confirm-close"
          fill="clear"
          onClick={() => setDeleteTarget(null)}
        >
          <IonIcon icon={closeOutline} />
        </IonButton>
      </div>

      <div className="delete-confirm-content">
        <p>
          Êtes-vous sûr de vouloir supprimer{" "}
          <strong>{deleteTarget.nomEntreprise || "cette entreprise"}</strong> ?
        </p>
      </div>

      <div className="delete-confirm-actions">
        <IonButton
          className="delete-confirm-cancel"
          fill="outline"
          onClick={() => setDeleteTarget(null)}
        >
          Annuler
        </IonButton>

        <IonButton className="delete-confirm-delete" onClick={softDelete}>
          Oui, supprimer
        </IonButton>
      </div>
    </div>
  </div>
)}
        <IonToast
          isOpen={!!toast}
          message={toast}
          duration={2000}
          onDidDismiss={() => setToast("")}
        />
      </IonContent>
    </IonPage>
  );
}


