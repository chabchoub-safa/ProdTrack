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
  IonInput,
  IonTextarea,
  IonToast,
  IonIcon,
  IonSpinner,
  IonButtons,
  IonItem,
  IonLabel,
  IonAlert,
} from "@ionic/react";
import { getEntreprises, EntrepriseStats } from "../services/entrepriseService";
import {
  addOutline,
  closeOutline,
  createOutline,
  trashOutline,
  eyeOutline,
} from "ionicons/icons";

import Menusec from "../components/Menusec";
import "./SuiviITP.dark.css";
import "./SuiviITP.light.css";
import "./CommonDesign.dark.css";
import "./CommonDesign.light.css";

import {
  Diagnostic as DiagnosticType,
  Complement,
  listDiagnostics,
  createDiagnostic,
  updateDiagnostic,
  deleteDiagnostic,
} from "../services/diagnostic.service";
import { ComplementOption, listComplements } from "../services/hjSummary.service";

const emptyForm: DiagnosticType = {
  cat: "",
  entreprise: "",
  objet: "",
  hj: 0,
  caDtHt: 0,
  devis: "",
  date: "",
  dateSign: "",
  dateInterv: "",
  dateDemarrage: "",
  dateFinPrev: "",
  complements: [],
  pourcentageTech: "",
  pourcentageRh: "",
  pourcentageFin: "",
  pourcentagePos: "",
  dateDepotMan: "",
  adhesion: "",
  facture30: "",
  dateFacture30: "",
  facture70: "",
  dateFacture70: "",
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

const Diagnostic: React.FC = () => {
  const [items, setItems] = useState<DiagnosticType[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const [selected, setSelected] = useState<DiagnosticType | null>(null);
  const [form, setForm] = useState<DiagnosticType>(emptyForm);

  const [toast, setToast] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] =
    useState<DiagnosticType | null>(null);
const [complementOptions, setComplementOptions] = useState<ComplementOption[]>([]);

useEffect(() => {
  listComplements().then(setComplementOptions);
}, []);
  const [categories, setCategories] = useState<string[]>([]);
  // const [entreprises, setEntreprises] = useState<string[]>([]);
  const [entreprises, setEntreprises] = useState<EntrepriseStats[]>([]);
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

      const data = await listDiagnostics(searchText);
      const dataList = Array.isArray(data) ? data : [];

      setItems(dataList);

      setCategories(
        Array.from(
          new Set(
            dataList
              .map((x) => x.cat?.trim())
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
      setToast("Erreur lors du chargement des diagnostics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);
useEffect(() => {
  getEntreprises(false)
    .then(setEntreprises)
    .catch(console.error);
}, []);
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;

    return items.filter((it) => {
      const complementsText = (it.complements || [])
        .map((c) => `${c.nom} ${c.valeur}`)
        .join(" ");

      return [
        it.cat,
        it.entreprise,
        it.objet,
        it.devis,
        complementsText,
        it.pourcentageTech,
        it.pourcentageRh,
        it.pourcentageFin,
        it.pourcentagePos,
        it.adhesion,
        it.facture30,
        it.facture70,
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

  const openEdit = (item: DiagnosticType) => {
    setSelected(item);
    setForm({
      ...item,
      date: toInputDate(item.date),
      dateSign: toInputDate(item.dateSign),
      dateInterv: toInputDate(item.dateInterv),
      dateDemarrage: toInputDate(item.dateDemarrage),
      dateFinPrev: toInputDate(item.dateFinPrev),
      dateDepotMan: toInputDate(item.dateDepotMan),
      dateFacture30: toInputDate(item.dateFacture30),
      dateFacture70: toInputDate(item.dateFacture70),
      complements: item.complements || [],
    });
    setOpenForm(true);
  };

  const openView = (item: DiagnosticType) => {
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
      if (!form.cat?.trim()) {
        setToast("Le champ CAT est obligatoire");
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

      const payload: DiagnosticType = {
        ...form,
        hj: Number(form.hj || 0),
        caDtHt: Number(form.caDtHt || 0),
        complements: (form.complements || []).filter(
          (c) => c.nom?.trim() && c.valeur?.trim()
        ),
      };

      if (selected?.id) {
        await updateDiagnostic(selected.id, payload);
        setToast("Diagnostic modifié avec succès");
      } else {
        await createDiagnostic(payload);
        setToast("Diagnostic ajouté avec succès");
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

  const askDelete = (item: DiagnosticType) => {
    setItemToDelete(item);
    setConfirmDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (!itemToDelete?.id) return;

      await deleteDiagnostic(itemToDelete.id);
      setToast("Diagnostic supprimé avec succès");
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
        <Menusec title="Diagnostic" />

        <div className="suivi-page-wrap">
          <div className="glass-card top-toolbar-card">
            <div className="top-toolbar-row">
              <IonSearchbar
                value={query}
                onIonInput={(e) => setQuery(e.detail.value || "")}
                placeholder="Rechercher CAT, entreprise, objet, complément..."
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
              Aucun diagnostic trouvé.
            </div>
          ) : (
            <div className="glass-card table-card">
              <div className="table-scroll">
                <table className="itp-table">
                  <thead>
                    <tr>
                      <th>CAT</th>
                      <th>Entreprise</th>
                      <th>Objet</th>
                      <th>H/J</th>
                      <th>CA DT HT</th>
                      <th>Devis</th>
                      <th>Date</th>
                      <th>Date Sign</th>
                      <th>Date Interv</th>
                      <th>Date démarrage</th>
                      <th>Date fin prév</th>
                      <th>Compléments</th>
                      <th>% Tech</th>
                      <th>% RH</th>
                      <th>% FIN</th>
                      <th>% Pos</th>
                      <th>Date dépôt MAN</th>
                      <th>Adhésion</th>
                      <th>Facture 30%</th>
                      <th>Date facture 30%</th>
                      <th>Facture 70%</th>
                      <th>Date facture 70%</th>
                      <th>Observations</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.cat || "--"}</td>
                        <td>{item.entreprise || "--"}</td>
                        <td>{item.objet || "--"}</td>
                        <td>{item.hj ?? "--"}</td>
                        <td>{item.caDtHt ?? "--"}</td>
                        <td>{item.devis || "--"}</td>
                        <td>{formatDate(item.date)}</td>
                        <td>{formatDate(item.dateSign)}</td>
                        <td>{formatDate(item.dateInterv)}</td>
                        <td>{formatDate(item.dateDemarrage)}</td>
                        <td>{formatDate(item.dateFinPrev)}</td>

                        <td>
                          {(item.complements || []).length > 0
                            ? item.complements
                                ?.map((c) => `${c.nom}: ${c.valeur}`)
                                .join(" | ")
                            : "--"}
                        </td>

                        <td>{item.pourcentageTech || "--"}</td>
                        <td>{item.pourcentageRh || "--"}</td>
                        <td>{item.pourcentageFin || "--"}</td>
                        <td>{item.pourcentagePos || "--"}</td>
                        <td>{formatDate(item.dateDepotMan)}</td>
                        <td>{item.adhesion || "--"}</td>
                        <td>{item.facture30 || "--"}</td>
                        <td>{formatDate(item.dateFacture30)}</td>
                        <td>{item.facture70 || "--"}</td>
                        <td>{formatDate(item.dateFacture70)}</td>
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
                {selected ? "Modifier Diagnostic" : "Ajouter Diagnostic"}
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
                <div className="section-title">Informations</div>

                <IonItem>
                  <IonLabel position="stacked">CAT</IonLabel>
                  <input
                    className="native-datalist-input"
                    list="cat-diagnostic-list"
                    value={form.cat || ""}
                    placeholder="Choisir ou saisir une catégorie"
                    onChange={(e) =>
                      setForm({ ...form, cat: e.target.value })
                    }
                  />
                  <datalist id="cat-diagnostic-list">
                    {categories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </IonItem>

                {/* <IonItem>
                  <IonLabel position="stacked">Entreprise</IonLabel>
                  <input
                    className="native-datalist-input"
                    list="entreprises-diagnostic-list"
                    value={form.entreprise || ""}
                    placeholder="Choisir ou saisir une entreprise"
                    onChange={(e) =>
                      setForm({ ...form, entreprise: e.target.value })
                    }
                  />
                  <datalist id="entreprises-diagnostic-list">
                    {entreprises.map((e) => (
                      <option key={e} value={e} />
                    ))}
                  </datalist>
                </IonItem> */}
<IonItem>
  <IonLabel position="stacked">Entreprise</IonLabel>

  <input
    className="native-datalist-input"
    list="entreprises-ass-tech-list"
    value={form.entreprise || ""}
    placeholder="Choisir ou saisir une entreprise"
    onChange={(e) =>
      setForm({
        ...form,
        entreprise: e.target.value,
      })
    }
  />

  <datalist id="entreprises-ass-tech-list">
    {entreprises.map((ent) => (
      <option key={ent.id} value={ent.nomEntreprise} />
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
                  <IonLabel position="stacked">H/J</IonLabel>
                  <IonInput
                    type="number"
                    value={form.hj}
                    onIonInput={(e) =>
                      setForm({ ...form, hj: Number(e.detail.value || 0) })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">CA DT HT</IonLabel>
                  <IonInput
                    type="number"
                    value={form.caDtHt}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        caDtHt: Number(e.detail.value || 0),
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
                  <IonLabel position="stacked">Date Sign</IonLabel>
                  <IonInput
                    type="date"
                    value={form.dateSign}
                    onIonInput={(e) =>
                      setForm({ ...form, dateSign: e.detail.value || "" })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Date Interv</IonLabel>
                  <IonInput
                    type="date"
                    value={form.dateInterv}
                    onIonInput={(e) =>
                      setForm({ ...form, dateInterv: e.detail.value || "" })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Date démarrage</IonLabel>
                  <IonInput
                    type="date"
                    value={form.dateDemarrage}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        dateDemarrage: e.detail.value || "",
                      })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Date fin prévisionnelle</IonLabel>
                  <IonInput
                    type="date"
                    value={form.dateFinPrev}
                    onIonInput={(e) =>
                      setForm({ ...form, dateFinPrev: e.detail.value || "" })
                    }
                  />
                </IonItem>

                
              </div>

              <div className="glass-card form-card">
                <div className="section-title">Compléments</div>

               {(form.complements || []).map((c, index) => (
  <div key={index} className="complement-row">
    <IonItem>
      <IonLabel position="stacked">Nom complément</IonLabel>

      <select
        className="native-datalist-input"
        value={c.nom}
        onChange={(e) => {
          const copy = [...(form.complements || [])];
          copy[index] = { ...copy[index], nom: e.target.value };
          setForm({ ...form, complements: copy });
        }}
      >
        <option value="">Choisir complément</option>

        {complementOptions.map((opt) => (
          <option key={opt.id} value={opt.nom}>
            {opt.nom}
          </option>
        ))}
      </select>
    </IonItem>

    <IonItem>
      <IonLabel position="stacked">Valeur</IonLabel>

      <IonInput
        type="number"
        value={c.valeur}
        placeholder="Valeur H/J"
        onIonInput={(e) => {
          const copy = [...(form.complements || [])];
          copy[index] = {
            ...copy[index],
            valeur: e.detail.value || "",
          };
          setForm({ ...form, complements: copy });
        }}
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

                <datalist id="complements-diagnostic-list">
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
                  <IonLabel position="stacked">% Tech</IonLabel>
                  <IonInput
                    value={form.pourcentageTech}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        pourcentageTech: e.detail.value || "",
                      })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">% RH</IonLabel>
                  <IonInput
                    value={form.pourcentageRh}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        pourcentageRh: e.detail.value || "",
                      })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">% FIN</IonLabel>
                  <IonInput
                    value={form.pourcentageFin}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        pourcentageFin: e.detail.value || "",
                      })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">% Pos</IonLabel>
                  <IonInput
                    value={form.pourcentagePos}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        pourcentagePos: e.detail.value || "",
                      })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Date Dépôt MAN</IonLabel>
                  <IonInput
                    type="date"
                    value={form.dateDepotMan}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        dateDepotMan: e.detail.value || "",
                      })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Adhésion</IonLabel>
                  <IonInput
                    value={form.adhesion}
                    onIonInput={(e) =>
                      setForm({ ...form, adhesion: e.detail.value || "" })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Facture 30%</IonLabel>
                  <IonInput
                    value={form.facture30}
                    onIonInput={(e) =>
                      setForm({ ...form, facture30: e.detail.value || "" })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Date facture 30%</IonLabel>
                  <IonInput
                    type="date"
                    value={form.dateFacture30}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        dateFacture30: e.detail.value || "",
                      })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Facture 70%</IonLabel>
                  <IonInput
                    value={form.facture70}
                    onIonInput={(e) =>
                      setForm({ ...form, facture70: e.detail.value || "" })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Date facture 70%</IonLabel>
                  <IonInput
                    type="date"
                    value={form.dateFacture70}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        dateFacture70: e.detail.value || "",
                      })
                    }
                  />
                </IonItem>

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
              <IonTitle>Détails Diagnostic</IonTitle>

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
                <div className="glass-card detail-card">
                  <div className="details-grid">
                    <div>
                      <strong>CAT :</strong> {selected.cat || "--"}
                    </div>
                    <div>
                      <strong>Entreprise :</strong>{" "}
                      {selected.entreprise || "--"}
                    </div>
                    <div>
                      <strong>Objet :</strong> {selected.objet || "--"}
                    </div>
                    <div>
                      <strong>H/J :</strong> {selected.hj ?? "--"}
                    </div>
                    <div>
                      <strong>CA DT HT :</strong> {selected.caDtHt ?? "--"}
                    </div>
                    <div>
                      <strong>Devis :</strong> {selected.devis || "--"}
                    </div>
                    <div>
                      <strong>Date :</strong> {formatDate(selected.date)}
                    </div>
                    <div>
                      <strong>Date Sign :</strong>{" "}
                      {formatDate(selected.dateSign)}
                    </div>
                    <div>
                      <strong>Date Interv :</strong>{" "}
                      {formatDate(selected.dateInterv)}
                    </div>
                    <div>
                      <strong>Date démarrage :</strong>{" "}
                      {formatDate(selected.dateDemarrage)}
                    </div>
                    <div>
                      <strong>Date fin prévisionnelle :</strong>{" "}
                      {formatDate(selected.dateFinPrev)}
                    </div>
                    
                    
                    <div>
                      <strong>% Tech :</strong>{" "}
                      {selected.pourcentageTech || "--"}
                    </div>
                    <div>
                      <strong>% RH :</strong>{" "}
                      {selected.pourcentageRh || "--"}
                    </div>
                    <div>
                      <strong>% FIN :</strong>{" "}
                      {selected.pourcentageFin || "--"}
                    </div>
                    <div>
                      <strong>% Pos :</strong>{" "}
                      {selected.pourcentagePos || "--"}
                    </div>
                    <div>
                      <strong>Date dépôt MAN :</strong>{" "}
                      {formatDate(selected.dateDepotMan)}
                    </div>
                    <div>
                      <strong>Adhésion :</strong> {selected.adhesion || "--"}
                    </div>
                    <div>
                      <strong>Facture 30% :</strong>{" "}
                      {selected.facture30 || "--"}
                    </div>
                    <div>
                      <strong>Date facture 30% :</strong>{" "}
                      {formatDate(selected.dateFacture30)}
                    </div>
                    <div>
                      <strong>Facture 70% :</strong>{" "}
                      {selected.facture70 || "--"}
                    </div>
                    <div>
                      <strong>Date facture 70% :</strong>{" "}
                      {formatDate(selected.dateFacture70)}
                    </div>
                  </div>

                  <div className="obs-box">
                    <strong>Compléments :</strong>
                    {(selected.complements || []).length > 0 ? (
                      <div>
                        {selected.complements?.map((c, index) => (
                          <div key={index}>
                            {c.nom} : {c.valeur}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>--</div>
                    )}
                  </div>

                  <div className="obs-box">
                    <strong>Observations :</strong>
                    <div>{selected.observations || "--"}</div>
                  </div>
                </div>
              )}
            </div>
          </IonContent>
        </IonModal>

        <IonAlert
          isOpen={confirmDeleteOpen}
          onDidDismiss={() => setConfirmDeleteOpen(false)}
          header="Confirmation"
          message={`Supprimer l'enregistrement ${
            itemToDelete?.entreprise || ""
          } ?`}
          buttons={[
            { text: "Annuler", role: "cancel" },
            {
              text: "Supprimer",
              role: "destructive",
              handler: handleDelete,
            },
          ]}
        />

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

export default Diagnostic;