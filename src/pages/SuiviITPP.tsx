import React, { useEffect, useMemo, useState } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonSearchbar,
  IonModal,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonToast,
  IonIcon,
  IonSpinner,
  IonButtons,
  IonSelect,
IonSelectOption,
} from "@ionic/react";

import {
  addOutline,
  closeOutline,
  createOutline,
  trashOutline,
  eyeOutline,
} from "ionicons/icons";

import Menusec from "../components/Menusec";
import "./SuiviITP.css";
import "./CommonDesign.css";

import {
  SuiviITP as SuiviITPType,
  Complement,
  listSuiviITP,
  createSuiviITP,
  updateSuiviITP,
  deleteSuiviITP,
} from "../services/suiviITP.service";

const emptyForm: SuiviITPType = {
  categorie: "",
  entreprise: "",
  objet: "",
  dossierRecu: "",
  hj: 0,
  decisionCopil: "",
  devis: "",
  date: "",
  dateSignature: "",
  dateIntervention: "",
  dateRemiseRapport: "",
  depotBmn: "",
  complements: [],
  observations: "",
};

const formatDate = (value?: string) => {
  if (!value) return "--";
  try {
    return new Date(value).toLocaleDateString("fr-FR");
  } catch {
    return value;
  }
};

const toInputDate = (value?: string) => {
  if (!value) return "";
  try {
    return new Date(value).toISOString().slice(0, 10);
  } catch {
    return "";
  }
};

const SuiviITPP: React.FC = () => {
  const [items, setItems] = useState<SuiviITPType[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const [selected, setSelected] = useState<SuiviITPType | null>(null);
  const [form, setForm] = useState<SuiviITPType>(emptyForm);

  const [toast, setToast] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SuiviITPType | null>(null);

  const [categories, setCategories] = useState<string[]>([]);
  const [entreprises, setEntreprises] = useState<string[]>([]);
  const [complementNames, setComplementNames] = useState<string[]>([
    "abdlhmid",
    "insaf",
    "rachida",
    "majdi",
    "chourouk",
  ]);

  const load = async (searchText?: string) => {
    try {
      setLoading(true);
      const data = await listSuiviITP(searchText);
      const dataList = Array.isArray(data) ? data : [];

      setItems(dataList);

      setCategories(
        Array.from(
          new Set(
            dataList
              .map((x) => x.categorie?.trim())
              .filter((x): x is string => !!x)
          )
        )
      );

      setEntreprises(
        Array.from(
          new Set(
            dataList
              .map((x) => x.entreprise?.trim())
              .filter((x): x is string => !!x)
          )
        )
      );

      const allComplements = dataList
        .flatMap((x) => x.complements || [])
        .map((c) => c.nom?.trim())
        .filter((x): x is string => !!x);

      setComplementNames((prev) =>
        Array.from(new Set([...prev, ...allComplements]))
      );
    } catch (e) {
      console.error(e);
      setToast("Erreur lors du chargement des données ITP");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((it) => {
      const complementsText = (it.complements || [])
        .map((c) => `${c.nom} ${c.valeur}`)
        .join(" ");

      return [
        it.categorie,
        it.entreprise,
        it.objet,
        it.decisionCopil,
        it.devis,
        complementsText,
        it.observations,
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [items, query]);

  const openCreate = () => {
    setSelected(null);
    setForm({ ...emptyForm, complements: [] });
    setOpenForm(true);
  };

  const openEdit = (item: SuiviITPType) => {
    setSelected(item);
    setForm({
      ...item,
      dossierRecu: toInputDate(item.dossierRecu),
      date: toInputDate(item.date),
      dateSignature: toInputDate(item.dateSignature),
      dateIntervention: toInputDate(item.dateIntervention),
      dateRemiseRapport: toInputDate(item.dateRemiseRapport),
      depotBmn: toInputDate(item.depotBmn),
      complements: item.complements || [],
    });
    setOpenForm(true);
  };

  const openView = (item: SuiviITPType) => {
    setSelected(item);
    setOpenDetails(true);
  };

  const updateComplement = (
    index: number,
    field: keyof Complement,
    value: string
  ) => {
    const newComplements = [...(form.complements || [])];
    newComplements[index] = {
      ...newComplements[index],
      [field]: value,
    };

    setForm({
      ...form,
      complements: newComplements,
    });
  };

  const addComplement = () => {
    setForm({
      ...form,
      complements: [...(form.complements || []), { nom: "", valeur: "" }],
    });
  };

  const removeComplement = (index: number) => {
    const newComplements = [...(form.complements || [])];
    newComplements.splice(index, 1);

    setForm({
      ...form,
      complements: newComplements,
    });
  };

  const handleSave = async () => {
    try {
      if (!form.categorie?.trim()) {
        setToast("La catégorie est obligatoire");
        return;
      }

      if (!form.entreprise?.trim()) {
        setToast("L’entreprise est obligatoire");
        return;
      }

      if (!form.objet?.trim()) {
        setToast("L’objet est obligatoire");
        return;
      }

      const payload: SuiviITPType = {
        ...form,
        hj: Number(form.hj || 0),
        complements: (form.complements || []).filter(
          (c) => c.nom?.trim() && c.valeur?.trim()
        ),
      };

      if (selected?.id) {
        await updateSuiviITP(selected.id, payload);
        setToast("Suivi ITP modifié avec succès");
      } else {
        await createSuiviITP(payload);
        setToast("Suivi ITP ajouté avec succès");
      }

      setOpenForm(false);
      setSelected(null);
      setForm({ ...emptyForm, complements: [] });
      await load();
    } catch (e) {
      console.error(e);
      setToast("Erreur lors de l’enregistrement");
    }
  };

  const askDelete = (item: SuiviITPType) => {
    setItemToDelete(item);
    setConfirmDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (!itemToDelete?.id) return;

      await deleteSuiviITP(itemToDelete.id);
      setToast("Suivi ITP supprimé avec succès");
      setConfirmDeleteOpen(false);
      setItemToDelete(null);
      await load();
    } catch (e) {
      console.error(e);
      setToast("Erreur lors de la suppression");
    }
  };

  return (
    <IonPage>
      <IonContent className="suivi-page-bg">
        <Menusec title="Suivi ITP" />

        <div className="suivi-page-wrap">
          <div className="glass-card top-toolbar-card">
            <div className="top-toolbar-row">
              <IonSearchbar
                value={query}
                onIonInput={(e) => setQuery(e.detail.value || "")}
                placeholder="Rechercher catégorie, entreprise, objet, complément..."
                className="suivi-searchbar"
              />

              <IonButton onClick={openCreate} className="add-btn">
                <IonIcon icon={addOutline} slot="start" />
                Ajouter
              </IonButton>
            </div>
          </div>

          {loading ? (
            <div className="loading-wrap">
              <IonSpinner name="crescent" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="glass-card empty-card">
              Aucun enregistrement ITP trouvé.
            </div>
          ) : (
            <div className="glass-card table-card">
              <div className="table-scroll">
                <table className="itp-table">
                  <thead>
                    <tr>
                      <th>Catégorie</th>
                      <th>Entreprise</th>
                      <th>Objet</th>
                      <th>Dossier reçu</th>
                      <th>H/J</th>
                      <th>Décision Copil</th>
                      <th>Devis</th>
                      <th>Date</th>
                      <th>Date signature</th>
                      <th>Date intervention</th>
                      <th>Date remise rapport</th>
                      <th>Dépôt BMN</th>
                      <th>Compléments</th>
                      <th>Observations</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.categorie || "--"}</td>
                        <td>{item.entreprise || "--"}</td>
                        <td>{item.objet || "--"}</td>
                        <td>{formatDate(item.dossierRecu)}</td>
                        <td>{item.hj ?? "--"}</td>
                        <td>{item.decisionCopil || "--"}</td>
                        <td>{item.devis || "--"}</td>
                        <td>{formatDate(item.date)}</td>
                        <td>{formatDate(item.dateSignature)}</td>
                        <td>{formatDate(item.dateIntervention)}</td>
                        <td>{formatDate(item.dateRemiseRapport)}</td>
                        <td>{formatDate(item.depotBmn)}</td>
                        <td>
                          {(item.complements || []).length > 0
                            ? item.complements
                                ?.map((c) => `${c.nom}: ${c.valeur}`)
                                .join(" | ")
                            : "--"}
                        </td>
                        <td className="obs-cell">
                          {item.observations || "--"}
                        </td>

                        <td>
                          <div className="row-actions">
                            <IonButton
                              size="small"
                              fill="clear"
                              onClick={() => openView(item)}
                            >
                              <IonIcon icon={eyeOutline} />
                            </IonButton>

                            <IonButton
                              size="small"
                              fill="clear"
                              onClick={() => openEdit(item)}
                            >
                              <IonIcon icon={createOutline} />
                            </IonButton>

                            <IonButton
                              size="small"
                              fill="clear"
                              color="danger"
                              onClick={() => askDelete(item)}
                            >
                              <IonIcon icon={trashOutline} />
                            </IonButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <IonModal
          isOpen={openForm}
          onDidDismiss={() => {
            setOpenForm(false);
            setSelected(null);
            setForm({ ...emptyForm, complements: [] });
          }}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>
                {selected ? "Modifier Suivi ITP" : "Ajouter Suivi ITP"}
              </IonTitle>

              <IonButtons slot="end">
                <IonButton
                  onClick={() => {
                    setOpenForm(false);
                    setSelected(null);
                    setForm({ ...emptyForm, complements: [] });
                  }}
                >
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="modal-content">
            <div className="form-wrap">
              <div className="glass-card form-card">
                <div className="section-title">Informations générales</div>

                <IonItem>
                  <IonLabel position="stacked">Catégorie</IonLabel>
                  <input
                    className="native-datalist-input"
                    list="categories-list"
                    value={form.categorie || ""}
                    placeholder="Choisir ou saisir une catégorie"
                    onChange={(e) =>
                      setForm({ ...form, categorie: e.target.value })
                    }
                  />
                  <datalist id="categories-list">
                    {categories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Entreprise</IonLabel>
                  <input
                    className="native-datalist-input"
                    list="entreprises-list"
                    value={form.entreprise || ""}
                    placeholder="Choisir ou saisir une entreprise"
                    onChange={(e) =>
                      setForm({ ...form, entreprise: e.target.value })
                    }
                  />
                  <datalist id="entreprises-list">
                    {entreprises.map((e) => (
                      <option key={e} value={e} />
                    ))}
                  </datalist>
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Objet</IonLabel>
                  <IonInput
                    value={form.objet}
                    onIonInput={(e) =>
                      setForm({ ...form, objet: e.detail.value || "" })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Dossier reçu</IonLabel>
                  <IonInput
                    type="date"
                    value={form.dossierRecu}
                    onIonInput={(e) =>
                      setForm({ ...form, dossierRecu: e.detail.value || "" })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">H/J</IonLabel>
                  <IonInput
                    type="number"
                    value={form.hj}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        hj: Number(e.detail.value || 0),
                      })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Décision Copil</IonLabel>
                  <IonInput
                    value={form.decisionCopil}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        decisionCopil: e.detail.value || "",
                      })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Devis</IonLabel>
                  <IonInput
                    value={form.devis}
                    onIonInput={(e) =>
                      setForm({ ...form, devis: e.detail.value || "" })
                    }
                  />
                </IonItem>
              </div>

              <div className="glass-card form-card">
                <div className="section-title">Dates</div>

                <IonItem>
                  <IonLabel position="stacked">Date</IonLabel>
                  <IonInput
                    type="date"
                    value={form.date}
                    onIonInput={(e) =>
                      setForm({ ...form, date: e.detail.value || "" })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Date signature</IonLabel>
                  <IonInput
                    type="date"
                    value={form.dateSignature}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        dateSignature: e.detail.value || "",
                      })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Date intervention</IonLabel>
                  <IonInput
                    type="date"
                    value={form.dateIntervention}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        dateIntervention: e.detail.value || "",
                      })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Date remise rapport</IonLabel>
                  <IonInput
                    type="date"
                    value={form.dateRemiseRapport}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        dateRemiseRapport: e.detail.value || "",
                      })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Dépôt BMN</IonLabel>
                  <IonInput
                    type="date"
                    value={form.depotBmn}
                    onIonInput={(e) =>
                      setForm({ ...form, depotBmn: e.detail.value || "" })
                    }
                  />
                </IonItem>
              </div>

              <div className="glass-card form-card">
                <div className="section-title">Compléments</div>

                {(form.complements || []).map((comp, index) => (
                  <div key={index} className="complement-row">
                    <IonItem>
                      <IonLabel position="stacked">Nom complément</IonLabel>
                      <input
                        className="native-datalist-input"
                        list="complements-list"
                        value={comp.nom}
                        placeholder="Choisir ou saisir"
                        onChange={(e) =>
                          updateComplement(index, "nom", e.target.value)
                        }
                      />
                    </IonItem>

                    <IonItem>
                      <IonLabel position="stacked">Valeur</IonLabel>
                      <IonInput
                        value={comp.valeur}
                        placeholder="Entrer la valeur"
                        onIonInput={(e) =>
                          updateComplement(
                            index,
                            "valeur",
                            e.detail.value || ""
                          )
                        }
                      />
                    </IonItem>

                    <IonButton
  fill="clear"
  color="danger"
  className="delete-complement-btn"
  onClick={() => removeComplement(index)}
>
  <IonIcon icon={trashOutline} />
</IonButton>
                  </div>
                ))}

                <datalist id="complements-list">
                  {complementNames.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>

              <IonButton
  expand="block"
  fill="outline"
  className="add-complement-btn"
  onClick={addComplement}
>
  Ajouter un complément
</IonButton>

                <IonItem>
                  <IonLabel position="stacked">Observations</IonLabel>
                  <IonTextarea
                    autoGrow
                    value={form.observations}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        observations: e.detail.value || "",
                      })
                    }
                  />
                </IonItem>
              </div>

              <div className="form-actions">
                <IonButton expand="block" onClick={handleSave}>
                  {selected ? "Enregistrer les modifications" : "Ajouter"}
                </IonButton>

                <IonButton
                  expand="block"
                  fill="outline"
                  color="medium"
                  onClick={() => {
                    setOpenForm(false);
                    setSelected(null);
                    setForm({ ...emptyForm, complements: [] });
                  }}
                >
                  Annuler
                </IonButton>
              </div>
            </div>
          </IonContent>
        </IonModal>

        <IonModal
          isOpen={openDetails}
          onDidDismiss={() => {
            setOpenDetails(false);
            setSelected(null);
          }}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Détails Suivi ITP</IonTitle>

              <IonButtons slot="end">
                <IonButton
                  onClick={() => {
                    setOpenDetails(false);
                    setSelected(null);
                  }}
                >
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonContent className="modal-content">
            <div className="details-wrap">
              {selected && (
                <>
                  <div className="glass-card detail-card">
                    <div className="section-title">
                      Informations principales
                    </div>

                    <div className="details-grid">
                      <div>
                        <strong>ID :</strong> {selected.id || "--"}
                      </div>
                      <div>
                        <strong>Catégorie :</strong>{" "}
                        {selected.categorie || "--"}
                      </div>
                      <div>
                        <strong>Entreprise :</strong>{" "}
                        {selected.entreprise || "--"}
                      </div>
                      <div>
                        <strong>Objet :</strong> {selected.objet || "--"}
                      </div>
                      <div>
                        <strong>Dossier reçu :</strong>{" "}
                        {formatDate(selected.dossierRecu)}
                      </div>
                      <div>
                        <strong>H/J :</strong> {selected.hj ?? "--"}
                      </div>
                      <div>
                        <strong>Décision Copil :</strong>{" "}
                        {selected.decisionCopil || "--"}
                      </div>
                      <div>
                        <strong>Devis :</strong> {selected.devis || "--"}
                      </div>
                    </div>
                  </div>

                  <div className="glass-card detail-card">
                    <div className="section-title">Dates</div>

                    <div className="details-grid">
                      <div>
                        <strong>Date :</strong> {formatDate(selected.date)}
                      </div>
                      <div>
                        <strong>Date signature :</strong>{" "}
                        {formatDate(selected.dateSignature)}
                      </div>
                      <div>
                        <strong>Date intervention :</strong>{" "}
                        {formatDate(selected.dateIntervention)}
                      </div>
                      <div>
                        <strong>Date remise rapport :</strong>{" "}
                        {formatDate(selected.dateRemiseRapport)}
                      </div>
                      <div>
                        <strong>Dépôt BMN :</strong>{" "}
                        {formatDate(selected.depotBmn)}
                      </div>
                    </div>
                  </div>

                  <div className="glass-card detail-card">
                    <div className="section-title">Compléments</div>

                    {(selected.complements || []).length > 0 ? (
                      <div className="details-grid">
                        {selected.complements?.map((c, index) => (
                          <div key={index}>
                            <strong>{c.nom} :</strong> {c.valeur || "--"}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>--</div>
                    )}

                    <div className="obs-box">
                      <strong>Observations :</strong>
                      <div>{selected.observations || "--"}</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </IonContent>
        </IonModal>

        <IonModal
          isOpen={confirmDeleteOpen}
          onDidDismiss={() => {
            setConfirmDeleteOpen(false);
            setItemToDelete(null);
          }}
          className="confirm-delete-modal"
        >
          <div className="confirm-modal">
            <div className="modal-head">
              <h3>Confirmation</h3>

              <IonButton
                fill="clear"
                className="modal-close-btn"
                onClick={() => {
                  setConfirmDeleteOpen(false);
                  setItemToDelete(null);
                }}
              >
                <IonIcon icon={closeOutline} />
              </IonButton>
            </div>

            <div className="confirm-body">
              Voulez-vous vraiment supprimer l'enregistrement{" "}
              <strong>{itemToDelete?.entreprise || ""}</strong> ?
            </div>

            <div className="confirm-actions">
              <IonButton
                className="btn-cancel"
                fill="outline"
                onClick={() => {
                  setConfirmDeleteOpen(false);
                  setItemToDelete(null);
                }}
              >
                Annuler
              </IonButton>

              <IonButton className="btn-confirm" onClick={handleDelete}>
                Oui, supprimer
              </IonButton>
            </div>
          </div>
        </IonModal>

        <IonToast
          isOpen={!!toast}
          message={toast}
          duration={2200}
          onDidDismiss={() => setToast("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default SuiviITPP;