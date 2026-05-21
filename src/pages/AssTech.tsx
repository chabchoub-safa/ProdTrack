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
import type { EntrepriseStats } from "../services/entrepriseService";
import { getEntreprises } from "../services/entrepriseService";
import Menusec from "../components/Menusec";
import "./SuiviITP.dark.css";
import "./SuiviITP.light.css";
import "./CommonDesign.dark.css";
import "./CommonDesign.light.css";

import {
  AssTech as AssTechType,
  Complement,
  listAssTech,
  createAssTech,
  updateAssTech,
  deleteAssTech,
} from "../services/assTech.service";
import { ComplementOption, listComplements } from "../services/hjSummary.service";

const emptyForm: AssTechType = {
  cat: "",
  entreprise: "",
  objet: "",
  hj: 0,
  caDt: 0,
  devis: "",
  date: "",
  dateSig: "",
  dateInterv: "",
  dateFinPrev: "",
  pourcentageAv: "",
  dossierItp: "",
  complements: [],
  nb: "",
 
  facture: "",
  dateFacture: "",
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

const AssTech: React.FC = () => {
  const [items, setItems] = useState<AssTechType[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const [selected, setSelected] = useState<AssTechType | null>(null);
  const [form, setForm] = useState<AssTechType>(emptyForm);

  const [toast, setToast] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<AssTechType | null>(null);

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
const [complementOptions, setComplementOptions] = useState<ComplementOption[]>([]);

useEffect(() => {
  listComplements().then(setComplementOptions);
}, []);
  const load = async (searchText?: string) => {
    try {
      setLoading(true);
      const data = await listAssTech(searchText);
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
      setToast("Erreur lors du chargement des données Ass Tech");
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
        it.dossierItp,
        complementsText,
        it.nb,
      
        it.facture,
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

  const openEdit = (item: AssTechType) => {
    setSelected(item);
    setForm({
      ...item,
      date: toInputDate(item.date),
      dateSig: toInputDate(item.dateSig),
      dateInterv: toInputDate(item.dateInterv),
      dateFinPrev: toInputDate(item.dateFinPrev),
      dateFacture: toInputDate(item.dateFacture),
      complements: item.complements || [],
    });
    setOpenForm(true);
  };

  const openView = (item: AssTechType) => {
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

      const payload: AssTechType = {
        ...form,
        hj: Number(form.hj || 0),
        caDt: Number(form.caDt || 0),
        complements: (form.complements || []).filter(
          (c) => c.nom?.trim() && c.valeur?.trim()
        ),
      };

      if (selected?.id) {
        await updateAssTech(selected.id, payload);
        setToast("Ass Tech modifié avec succès");
      } else {
        await createAssTech(payload);
        setToast("Ass Tech ajouté avec succès");
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

  const askDelete = (item: AssTechType) => {
    setItemToDelete(item);
    setConfirmDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (!itemToDelete?.id) return;

      await deleteAssTech(itemToDelete.id);
      setToast("Ass Tech supprimé avec succès");
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
        <Menusec title="Ass Tech" />

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
              Aucun enregistrement Ass Tech trouvé.
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
                      <th>CA DT</th>
                      <th>Devis</th>
                      <th>Date</th>
                      <th>Date Sig</th>
                      <th>Date Interv</th>
                      <th>Date fin Prév</th>
                      <th>% AV</th>
                      <th>Dossier ITP</th>
                      <th>RC</th>
                      <th>Compléments</th>
                      <th>NB</th>
                      
                      <th>Facture</th>
                      <th>Date facture</th>
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
                        <td>{item.caDt ?? "--"}</td>
                        <td>{item.devis || "--"}</td>
                        <td>{formatDate(item.date)}</td>
                        <td>{formatDate(item.dateSig)}</td>
                        <td>{formatDate(item.dateInterv)}</td>
                        <td>{formatDate(item.dateFinPrev)}</td>
                        <td>{item.pourcentageAv || "--"}</td>
                        <td>{item.dossierItp || "--"}</td>

                        <td>
                          {(item.complements || []).length > 0
                            ? item.complements
                                ?.map((c) => `${c.nom}: ${c.valeur}`)
                                .join(" | ")
                            : "--"}
                        </td>

                        <td>{item.nb || "--"}</td>
                        <td>{item.facture || "--"}</td>
                        <td>{formatDate(item.dateFacture)}</td>
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
                {selected ? "Modifier Ass Tech" : "Ajouter Ass Tech"}
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
                    list="cat-ass-tech-list"
                    value={form.cat || ""}
                    placeholder="Choisir ou saisir une catégorie"
                    onChange={(e) =>
                      setForm({ ...form, cat: e.target.value })
                    }
                  />
                  <datalist id="cat-ass-tech-list">
                    {categories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </IonItem>

                {/* <IonItem>
                  <IonLabel position="stacked">Entreprise</IonLabel>
                  <input
                    className="native-datalist-input"
                    list="entreprises-ass-tech-list"
                    value={form.entreprise || ""}
                    placeholder="Choisir ou saisir une entreprise"
                    onChange={(e) =>
                      setForm({ ...form, entreprise: e.target.value })
                    }
                  />
                  <datalist id="entreprises-ass-tech-list">
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
                  <IonLabel position="stacked">CA DT</IonLabel>
                  <IonInput
                    type="number"
                    value={form.caDt}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        caDt: Number(e.detail.value || 0),
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
                  <IonLabel position="stacked">Date Sig</IonLabel>
                  <IonInput
                    type="date"
                    value={form.dateSig}
                    onIonInput={(e) =>
                      setForm({ ...form, dateSig: e.detail.value || "" })
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
                  <IonLabel position="stacked">Date fin Prév</IonLabel>
                  <IonInput
                    type="date"
                    value={form.dateFinPrev}
                    onIonInput={(e) =>
                      setForm({ ...form, dateFinPrev: e.detail.value || "" })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">% AV</IonLabel>
                  <IonInput
                    value={form.pourcentageAv}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        pourcentageAv: e.detail.value || "",
                      })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Dossier ITP</IonLabel>
                  <IonInput
                    value={form.dossierItp}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        dossierItp: e.detail.value || "",
                      })
                    }
                  />
                </IonItem>

               
              </div>

              <div className="glass-card form-card">
                <div className="section-title">Compléments</div>

                {/* {(form.complements || []).map((comp, index) => (
                  <div key={index} className="complement-row">
                    <IonItem>
                      <IonLabel position="stacked">Nom complément</IonLabel>
                      <input
                        className="native-datalist-input"
                        list="complements-ass-tech-list"
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
                ))} */}
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
                <datalist id="complements-ass-tech-list">
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
                  <IonLabel position="stacked">NB</IonLabel>
                  <IonInput
                    value={form.nb}
                    onIonInput={(e) =>
                      setForm({ ...form, nb: e.detail.value || "" })
                    }
                  />
                </IonItem>

    

                <IonItem>
                  <IonLabel position="stacked">Facture</IonLabel>
                  <IonInput
                    value={form.facture}
                    onIonInput={(e) =>
                      setForm({ ...form, facture: e.detail.value || "" })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Date facture</IonLabel>
                  <IonInput
                    type="date"
                    value={form.dateFacture}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        dateFacture: e.detail.value || "",
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
              <IonTitle>Détails Ass Tech</IonTitle>

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
                    <div><strong>CAT :</strong> {selected.cat || "--"}</div>
                    <div><strong>Entreprise :</strong> {selected.entreprise || "--"}</div>
                    <div><strong>Objet :</strong> {selected.objet || "--"}</div>
                    <div><strong>H/J :</strong> {selected.hj ?? "--"}</div>
                    <div><strong>CA DT :</strong> {selected.caDt ?? "--"}</div>
                    <div><strong>Devis :</strong> {selected.devis || "--"}</div>
                    <div><strong>Date :</strong> {formatDate(selected.date)}</div>
                    <div><strong>Date Sig :</strong> {formatDate(selected.dateSig)}</div>
                    <div><strong>Date Interv :</strong> {formatDate(selected.dateInterv)}</div>
                    <div><strong>Date fin Prév :</strong> {formatDate(selected.dateFinPrev)}</div>
                    <div><strong>% AV :</strong> {selected.pourcentageAv || "--"}</div>
                    <div><strong>Dossier ITP :</strong> {selected.dossierItp || "--"}</div>
                    <div><strong>NB :</strong> {selected.nb || "--"}</div>
                    <div><strong>Facture :</strong> {selected.facture || "--"}</div>
                    <div><strong>Date facture :</strong> {formatDate(selected.dateFacture)}</div>
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

export default AssTech;