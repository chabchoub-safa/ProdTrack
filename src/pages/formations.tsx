// import React, { useEffect, useMemo, useState } from "react";
// import {
//   IonPage,
//   IonContent,
//   IonHeader,
//   IonToolbar,
//   IonTitle,
//   IonButton,
//   IonSearchbar,
//   IonModal,
//   IonInput,
//   IonToast,
//   IonIcon,
//   IonSpinner,
//   IonButtons,
//   IonItem,
//   IonLabel,
//   IonAlert,
// } from "@ionic/react";
// import {
//   addOutline,
//   closeOutline,
//   createOutline,
//   trashOutline,
//   eyeOutline,
//   refreshOutline,
// } from "ionicons/icons";

// import Menusec from "../components/Menusec";
// import "./SuiviITP.css";
// import "../components/Menusec"

// import {
//   Formation as FormationType,
//   listFormations,
//   createFormation,
//   updateFormation,
//   deleteFormation,
// } from "../services/formation.service";

// const emptyForm: FormationType = {
//   catThemes: "",
//   entreprise: "",
//   themes: "",
//   suitesEntreprises: "",
//   avancement: "",
//   nombreModulesApprouves: 0,
//   facture: "",
//   date: "",
//   montantDt: 0,
//   hj: 0,
//   rc: "",
//  abdlhmid: "",
//   insaf: "",
//    rachida: "",
//   majdi: "",
//   chourouk: "",
//   autres: "",
// };

// const formatDate = (value?: string) => {
//   if (!value) return "--";
//   try {
//     return new Date(value).toLocaleDateString("fr-FR");
//   } catch {
//     return value;
//   }
// };

// const toInputDate = (value?: string) => {
//   if (!value) return "";
//   try {
//     return new Date(value).toISOString().slice(0, 10);
//   } catch {
//     return "";
//   }
// };

// const Formation: React.FC = () => {
//   const [items, setItems] = useState<FormationType[]>([]);
//   const [query, setQuery] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [openForm, setOpenForm] = useState(false);
//   const [openDetails, setOpenDetails] = useState(false);

//   const [selected, setSelected] = useState<FormationType | null>(null);
//   const [form, setForm] = useState<FormationType>(emptyForm);

//   const [toast, setToast] = useState("");
//   const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState<FormationType | null>(null);

//   const load = async (searchText?: string) => {
//     try {
//       setLoading(true);
//       const data = await listFormations(searchText);
//       setItems(Array.isArray(data) ? data : []);
//     } catch (e) {
//       console.error(e);
//       setToast("Erreur lors du chargement des formations");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const filteredItems = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) return items;

//     return items.filter((it) =>
//       [
//         it.catThemes,
//         it.entreprise,
//         it.themes,
//         it.suitesEntreprises,
//         it.avancement,
//       ]
//         .join(" ")
//         .toLowerCase()
//         .includes(q)
//     );
//   }, [items, query]);

//   const openCreate = () => {
//     setSelected(null);
//     setForm({ ...emptyForm });
//     setOpenForm(true);
//   };

//   const openEdit = (item: FormationType) => {
//     setSelected(item);
//     setForm({
//       ...item,
//       date: toInputDate(item.date),
//     });
//     setOpenForm(true);
//   };

//   const openView = (item: FormationType) => {
//     setSelected(item);
//     setOpenDetails(true);
//   };

//   const handleSave = async () => {
//     try {
//       if (!form.catThemes?.trim()) return setToast("Le champ CAT/Thèmes est obligatoire");
//       if (!form.entreprise?.trim()) return setToast("L’entreprise est obligatoire");
//       if (!form.themes?.trim()) return setToast("Le thème est obligatoire");

//       const payload: FormationType = {
//         ...form,
//         nombreModulesApprouves: Number(form.nombreModulesApprouves || 0),
//         montantDt: Number(form.montantDt || 0),
//         hj: Number(form.hj || 0),
//       };

//       if (selected?.id) {
//         await updateFormation(selected.id, payload);
//         setToast("Formation modifiée avec succès");
//       } else {
//         await createFormation(payload);
//         setToast("Formation ajoutée avec succès");
//       }

//       setOpenForm(false);
//       setSelected(null);
//       setForm({ ...emptyForm });
//       await load();
//     } catch (e) {
//       console.error(e);
//       setToast("Erreur lors de l’enregistrement");
//     }
//   };

//   const askDelete = (item: FormationType) => {
//     setItemToDelete(item);
//     setConfirmDeleteOpen(true);
//   };

//   const handleDelete = async () => {
//     try {
//       if (!itemToDelete?.id) return;
//       await deleteFormation(itemToDelete.id);
//       setToast("Formation supprimée avec succès");
//       setConfirmDeleteOpen(false);
//       setItemToDelete(null);
//       await load();
//     } catch (e) {
//       console.error(e);
//       setToast("Erreur lors de la suppression");
//     }
//   };

//   return (
//     <IonPage>
  

     

//       <IonContent className="suivi-page-bg">
//          <Menusec title="Formation" />
//         <div className="suivi-page-wrap">
//           <div className="glass-card top-toolbar-card">
//             <div className="top-toolbar-row">
//               <IonSearchbar
//                 value={query}
//                 onIonInput={(e) => setQuery(e.detail.value || "")}
//                 placeholder="Rechercher CAT, entreprise, thèmes..."
//                 className="suivi-searchbar"
//               />
//               <IonButton onClick={openCreate} className="add-btn">
//                 <IonIcon icon={addOutline} slot="start" />
//                 Ajouter
//               </IonButton>
//             </div>
//           </div>

//           {loading ? (
//             <div className="loading-wrap">
//               <IonSpinner name="crescent" />
//             </div>
//           ) : filteredItems.length === 0 ? (
//             <div className="glass-card empty-card">
//               Aucune formation trouvée.
//             </div>
//           ) : (
//             <div className="glass-card table-card">
//               <div className="table-scroll">
//                 <table className="itp-table">
//                   <thead>
//                     <tr>
//                       <th>CAT / Thèmes</th>
//                       <th>Entreprise</th>
//                       <th>Thèmes</th>
//                       <th>Suites entreprises</th>
//                       <th>Avancement</th>
//                       <th>Nb modules approuvés</th>
//                       <th>Facture</th>
//                       <th>Date</th>
//                       <th>(DT)</th>
//                       <th>H/J</th>
//                       <th>RC</th>
//                       <th>abdlhmid</th>
//                       <th>insaf</th>
//                       <th>rachida</th>
//                       <th>majdi</th>
//                       <th>chourouk</th>
//                       <th>Autres</th>
//                       <th>Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredItems.map((item) => (
//                       <tr key={item.id}>
//                         <td>{item.catThemes || "--"}</td>
//                         <td>{item.entreprise || "--"}</td>
//                         <td>{item.themes || "--"}</td>
//                         <td>{item.suitesEntreprises || "--"}</td>
//                         <td>{item.avancement || "--"}</td>
//                         <td>{item.nombreModulesApprouves ?? "--"}</td>
//                         <td>{item.facture || "--"}</td>
//                         <td>{formatDate(item.date)}</td>
//                         <td>{item.montantDt ?? "--"}</td>
//                         <td>{item.hj ?? "--"}</td>
//                         <td>{item.rc || "--"}</td>
//                        <td>{item.abdlhmid || "--"}</td>
//                         <td>{item.insaf || "--"}</td>
//                         <td>{item.rachida || "--"}</td>
//                         <td>{item.majdi || "--"}</td>
//                         <td>{item.chourouk || "--"}</td>
//                         <td>{item.autres || "--"}</td>
//                         <td>
//                           <div className="row-actions">
//                             <IonButton size="small" fill="clear" onClick={() => openView(item)}>
//                               <IonIcon icon={eyeOutline} />
//                             </IonButton>
//                             <IonButton size="small" fill="clear" onClick={() => openEdit(item)}>
//                               <IonIcon icon={createOutline} />
//                             </IonButton>
//                             <IonButton size="small" fill="clear" color="danger" onClick={() => askDelete(item)}>
//                               <IonIcon icon={trashOutline} />
//                             </IonButton>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           )}
//         </div>

//         <IonModal isOpen={openForm} onDidDismiss={() => setOpenForm(false)}>
//           <IonHeader>
//             <IonToolbar>
//               <IonTitle>{selected ? "Modifier Formation" : "Ajouter Formation"}</IonTitle>
//               <IonButtons slot="end">
//                 <IonButton onClick={() => setOpenForm(false)}>
//                   <IonIcon icon={closeOutline} />
//                 </IonButton>
//               </IonButtons>
//             </IonToolbar>
//           </IonHeader>

//           <IonContent className="modal-content">
//             <div className="form-wrap">
//               <div className="glass-card form-card">
//                 <div className="section-title">Informations</div>

//                 <IonItem><IonLabel position="stacked">CAT / Thèmes</IonLabel><IonInput value={form.catThemes} onIonInput={(e) => setForm({ ...form, catThemes: e.detail.value || "" })} /></IonItem>
//                 <IonItem><IonLabel position="stacked">Entreprise</IonLabel><IonInput value={form.entreprise} onIonInput={(e) => setForm({ ...form, entreprise: e.detail.value || "" })} /></IonItem>
//                 <IonItem><IonLabel position="stacked">Thèmes</IonLabel><IonInput value={form.themes} onIonInput={(e) => setForm({ ...form, themes: e.detail.value || "" })} /></IonItem>
//                 <IonItem><IonLabel position="stacked">Suites Entreprises</IonLabel><IonInput value={form.suitesEntreprises} onIonInput={(e) => setForm({ ...form, suitesEntreprises: e.detail.value || "" })} /></IonItem>
//                 <IonItem><IonLabel position="stacked">Avancement</IonLabel><IonInput value={form.avancement} onIonInput={(e) => setForm({ ...form, avancement: e.detail.value || "" })} /></IonItem>
//                 <IonItem><IonLabel position="stacked">Nombre modules approuvés</IonLabel><IonInput type="number" value={form.nombreModulesApprouves} onIonInput={(e) => setForm({ ...form, nombreModulesApprouves: Number(e.detail.value || 0) })} /></IonItem>
//                 <IonItem><IonLabel position="stacked">Facture</IonLabel><IonInput value={form.facture} onIonInput={(e) => setForm({ ...form, facture: e.detail.value || "" })} /></IonItem>
//                 <IonItem><IonLabel position="stacked">Date</IonLabel><IonInput type="date" value={form.date} onIonInput={(e) => setForm({ ...form, date: e.detail.value || "" })} /></IonItem>
//                 <IonItem><IonLabel position="stacked">(DT)</IonLabel><IonInput type="number" value={form.montantDt} onIonInput={(e) => setForm({ ...form, montantDt: Number(e.detail.value || 0) })} /></IonItem>
//                 <IonItem><IonLabel position="stacked">H/J</IonLabel><IonInput type="number" value={form.hj} onIonInput={(e) => setForm({ ...form, hj: Number(e.detail.value || 0) })} /></IonItem>
//                 <IonItem><IonLabel position="stacked">RC</IonLabel><IonInput value={form.rc} onIonInput={(e) => setForm({ ...form, rc: e.detail.value || "" })} /></IonItem>
//                    <IonItem><IonLabel position="stacked">abdlhmid</IonLabel><IonInput value={form.abdlhmid} onIonInput={(e) => setForm({ ...form, abdlhmid: e.detail.value || "" })} /></IonItem>
//                 <IonItem><IonLabel position="stacked">insaf</IonLabel><IonInput value={form.insaf} onIonInput={(e) => setForm({ ...form, insaf: e.detail.value || "" })} /></IonItem>
//                  <IonItem><IonLabel position="stacked">rachida</IonLabel><IonInput value={form.rachida} onIonInput={(e) => setForm({ ...form, rachida: e.detail.value || "" })} /></IonItem>
//                 <IonItem><IonLabel position="stacked">majdi</IonLabel><IonInput value={form.majdi} onIonInput={(e) => setForm({ ...form, majdi: e.detail.value || "" })} /></IonItem>
//                 <IonItem><IonLabel position="stacked">chourouk</IonLabel><IonInput value={form.chourouk} onIonInput={(e) => setForm({ ...form, chourouk: e.detail.value || "" })} /></IonItem>

//                 <IonItem><IonLabel position="stacked">Autres</IonLabel><IonInput value={form.autres} onIonInput={(e) => setForm({ ...form, autres: e.detail.value || "" })} /></IonItem>
//               </div>

//               <div className="form-actions">
//                 <IonButton expand="block" onClick={handleSave}>
//                   {selected ? "Enregistrer les modifications" : "Ajouter"}
//                 </IonButton>
//                 <IonButton expand="block" fill="outline" color="medium" onClick={() => setOpenForm(false)}>
//                   Annuler
//                 </IonButton>
//               </div>
//             </div>
//           </IonContent>
//         </IonModal>

//         <IonModal isOpen={openDetails} onDidDismiss={() => setOpenDetails(false)}>
//           <IonHeader>
//             <IonToolbar>
//               <IonTitle>Détails Formation</IonTitle>
//               <IonButtons slot="end">
//                 <IonButton onClick={() => setOpenDetails(false)}>
//                   <IonIcon icon={closeOutline} />
//                 </IonButton>
//               </IonButtons>
//             </IonToolbar>
//           </IonHeader>
//           <IonContent className="modal-content">
//             <div className="details-wrap">
//               {selected && (
//                 <div className="glass-card detail-card">
//                   <div className="details-grid">
//                     <div><strong>CAT / Thèmes :</strong> {selected.catThemes || "--"}</div>
//                     <div><strong>Entreprise :</strong> {selected.entreprise || "--"}</div>
//                     <div><strong>Thèmes :</strong> {selected.themes || "--"}</div>
//                     <div><strong>Suites entreprises :</strong> {selected.suitesEntreprises || "--"}</div>
//                     <div><strong>Avancement :</strong> {selected.avancement || "--"}</div>
//                     <div><strong>Nombre modules approuvés :</strong> {selected.nombreModulesApprouves ?? "--"}</div>
//                     <div><strong>Facture :</strong> {selected.facture || "--"}</div>
//                     <div><strong>Date :</strong> {formatDate(selected.date)}</div>
//                     <div><strong>(DT) :</strong> {selected.montantDt ?? "--"}</div>
//                     <div><strong>H/J :</strong> {selected.hj ?? "--"}</div>
//                     <div><strong>RC :</strong> {selected.rc || "--"}</div>
//                     <div><strong>abdlhmid :</strong> {selected.abdlhmid || "--"}</div>
//                     <div><strong>insaf :</strong> {selected.insaf || "--"}</div>
//                     <div><strong>rachida :</strong> {selected.rachida || "--"}</div>
//                     <div><strong>majdi :</strong> {selected.majdi || "--"}</div>
//                     <div><strong>chourouk :</strong> {selected.chourouk || "--"}</div>
//                     <div><strong>Autres :</strong> {selected.autres || "--"}</div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </IonContent>
//         </IonModal>

//         <IonAlert
//           isOpen={confirmDeleteOpen}
//           onDidDismiss={() => setConfirmDeleteOpen(false)}
//           header="Confirmation"
//           message={`Supprimer l'enregistrement ${itemToDelete?.entreprise || ""} ?`}
//           buttons={[
//             { text: "Annuler", role: "cancel" },
//             { text: "Supprimer", role: "destructive", handler: handleDelete },
//           ]}
//         />

//         <IonToast
//           isOpen={!!toast}
//           message={toast}
//           duration={2200}
//           onDidDismiss={() => setToast("")}
//         />
//       </IonContent>
//     </IonPage>
//   );
// };

// export default Formation;
import React, { useEffect, useMemo, useState } from "react";
import {
  IonPage,
  IonContent,
  IonButton,
  IonSearchbar,
  IonModal,
  IonInput,
  IonToast,
  IonIcon,
  IonSpinner,
  IonButtons,
  IonItem,
  IonLabel,
  IonAlert,
  IonHeader,
  IonToolbar,
  IonTitle,
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
import "./CommonDesign.dark.css";
import "./CommonDesign.light.css";

import {
  Formation as FormationType,
  Complement,
  listFormations,
  createFormation,
  updateFormation,
  deleteFormation,
} from "../services/formation.service";

const emptyForm: FormationType = {
  catThemes: "",
  entreprise: "",
  themes: "",
  suitesEntreprises: "",
  avancement: "",
  nombreModulesApprouves: 0,
  facture: "",
  date: "",
  montantDt: 0,
  hj: 0,
  complements: [],
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

const Formation: React.FC = () => {
  const [items, setItems] = useState<FormationType[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const [selected, setSelected] = useState<FormationType | null>(null);
  const [form, setForm] = useState<FormationType>(emptyForm);

  const [toast, setToast] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<FormationType | null>(null);

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

      const data = await listFormations(searchText);
      const dataList = Array.isArray(data) ? data : [];

      setItems(dataList);

      setCategories(
        Array.from(
          new Set(
            dataList
              .map((x) => x.catThemes?.trim())
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
      setToast("Erreur lors du chargement des formations");
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
        it.catThemes,
        it.entreprise,
        it.themes,
        it.suitesEntreprises,
        it.avancement,
        it.facture,
      
        complementsText,
       
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

  const openEdit = (item: FormationType) => {
    setSelected(item);
    setForm({
      ...item,
      date: toInputDate(item.date),
      complements: item.complements || [],
    });
    setOpenForm(true);
  };

  const openView = (item: FormationType) => {
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
      if (!form.catThemes?.trim()) {
        setToast("Le champ CAT / Thèmes est obligatoire");
        return;
      }

      if (!form.entreprise?.trim()) {
        setToast("L’entreprise est obligatoire");
        return;
      }

      if (!form.themes?.trim()) {
        setToast("Le thème est obligatoire");
        return;
      }

      const payload: FormationType = {
        ...form,
        nombreModulesApprouves: Number(form.nombreModulesApprouves || 0),
        montantDt: Number(form.montantDt || 0),
        hj: Number(form.hj || 0),
        complements: (form.complements || []).filter(
          (c) => c.nom?.trim() && c.valeur?.trim()
        ),
      };

      if (selected?.id) {
        await updateFormation(selected.id, payload);
        setToast("Formation modifiée avec succès");
      } else {
        await createFormation(payload);
        setToast("Formation ajoutée avec succès");
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

  const askDelete = (item: FormationType) => {
    setItemToDelete(item);
    setConfirmDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (!itemToDelete?.id) return;

      await deleteFormation(itemToDelete.id);
      setToast("Formation supprimée avec succès");
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
        <Menusec title="Formation" />

        <div className="suivi-page-wrap">
          <div className="glass-card top-toolbar-card">
            <div className="top-toolbar-row">
              <IonSearchbar
                value={query}
                onIonInput={(e) => setQuery(e.detail.value || "")}
                placeholder="Rechercher CAT, entreprise, thèmes, complément..."
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
            <div className="glass-card empty-card">Aucune formation trouvée.</div>
          ) : (
            <div className="glass-card table-card">
              <div className="table-scroll">
                <table className="itp-table">
                  <thead>
                    <tr>
                      <th>CAT / Thèmes</th>
                      <th>Entreprise</th>
                      <th>Thèmes</th>
                      <th>Suites entreprises</th>
                      <th>Avancement</th>
                      <th>Nb modules approuvés</th>
                      <th>Facture</th>
                      <th>Date</th>
                      <th>(DT)</th>
                      <th>H/J</th>
                      <th>Compléments</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.catThemes || "--"}</td>
                        <td>{item.entreprise || "--"}</td>
                        <td>{item.themes || "--"}</td>
                        <td>{item.suitesEntreprises || "--"}</td>
                        <td>{item.avancement || "--"}</td>
                        <td>{item.nombreModulesApprouves ?? "--"}</td>
                        <td>{item.facture || "--"}</td>
                        <td>{formatDate(item.date)}</td>
                        <td>{item.montantDt ?? "--"}</td>
                        <td>{item.hj ?? "--"}</td>

                        <td>
                          {(item.complements || []).length > 0
                            ? item.complements
                                ?.map((c) => `${c.nom}: ${c.valeur}`)
                                .join(" | ")
                            : "--"}
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
                {selected ? "Modifier Formation" : "Ajouter Formation"}
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
                  <IonLabel position="stacked">CAT / Thèmes</IonLabel>
                  <input
                    className="native-datalist-input"
                    list="cat-formation-list"
                    value={form.catThemes || ""}
                    placeholder="Choisir ou saisir une catégorie"
                    onChange={(e) =>
                      setForm({ ...form, catThemes: e.target.value })
                    }
                  />
                  <datalist id="cat-formation-list">
                    {categories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Entreprise</IonLabel>
                  <input
                    className="native-datalist-input"
                    list="entreprises-formation-list"
                    value={form.entreprise || ""}
                    placeholder="Choisir ou saisir une entreprise"
                    onChange={(e) =>
                      setForm({ ...form, entreprise: e.target.value })
                    }
                  />
                  <datalist id="entreprises-formation-list">
                    {entreprises.map((e) => (
                      <option key={e} value={e} />
                    ))}
                  </datalist>
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Thèmes</IonLabel>
                  <IonInput
                    value={form.themes}
                    onIonInput={(e) =>
                      setForm({ ...form, themes: e.detail.value || "" })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Suites Entreprises</IonLabel>
                  <IonInput
                    value={form.suitesEntreprises}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        suitesEntreprises: e.detail.value || "",
                      })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Avancement</IonLabel>
                  <IonInput
                    value={form.avancement}
                    onIonInput={(e) =>
                      setForm({ ...form, avancement: e.detail.value || "" })
                    }
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">Nombre modules approuvés</IonLabel>
                  <IonInput
                    type="number"
                    value={form.nombreModulesApprouves}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        nombreModulesApprouves: Number(e.detail.value || 0),
                      })
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
                  <IonLabel position="stacked">(DT)</IonLabel>
                  <IonInput
                    type="number"
                    value={form.montantDt}
                    onIonInput={(e) =>
                      setForm({
                        ...form,
                        montantDt: Number(e.detail.value || 0),
                      })
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

                
              </div>

              <div className="glass-card form-card">
                <div className="section-title">Compléments</div>

                {(form.complements || []).map((comp, index) => (
                  <div key={index} className="complement-row">
                    <IonItem>
                      <IonLabel position="stacked">Nom complément</IonLabel>
                      <input
                        className="native-datalist-input"
                        list="complements-formation-list"
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

                <datalist id="complements-formation-list">
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
              <IonTitle>Détails Formation</IonTitle>

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
                      <strong>CAT / Thèmes :</strong>{" "}
                      {selected.catThemes || "--"}
                    </div>
                    <div>
                      <strong>Entreprise :</strong>{" "}
                      {selected.entreprise || "--"}
                    </div>
                    <div>
                      <strong>Thèmes :</strong> {selected.themes || "--"}
                    </div>
                    <div>
                      <strong>Suites entreprises :</strong>{" "}
                      {selected.suitesEntreprises || "--"}
                    </div>
                    <div>
                      <strong>Avancement :</strong>{" "}
                      {selected.avancement || "--"}
                    </div>
                    <div>
                      <strong>Nombre modules approuvés :</strong>{" "}
                      {selected.nombreModulesApprouves ?? "--"}
                    </div>
                    <div>
                      <strong>Facture :</strong> {selected.facture || "--"}
                    </div>
                    <div>
                      <strong>Date :</strong> {formatDate(selected.date)}
                    </div>
                    <div>
                      <strong>(DT) :</strong> {selected.montantDt ?? "--"}
                    </div>
                    <div>
                      <strong>H/J :</strong> {selected.hj ?? "--"}
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

export default Formation;