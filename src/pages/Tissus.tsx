// import React, { useEffect, useState } from "react";
// import { IonButtons } from "@ionic/react";
// import {
//   IonPage, IonContent, IonHeader, IonToolbar, IonTitle,
//   IonSearchbar, IonButton, IonIcon, IonModal, IonItem, IonLabel,
//   IonInput, IonToast, IonDatetime ,IonAlert
// } from "@ionic/react";
// import { downloadBlob } from '../utils/downloadHelper';
// import { listClients, ClientUser } from "../services/tissus.service";
// import { addOutline, closeOutline, createOutline, downloadOutline } from "ionicons/icons";
// import "./CommonDesign.css";
// import TopMenu from "../components/TopMenu";
// import { listMachines } from "../services/machines.service";
// import {
//   listTissus, getTissuDetails, createTissu,
//   downloadTissuQr, generateDemandePdf,
//   TissuForm,
//   updateTissu
// } from "../services/tissus.service";

// export default function Tissus() {
//   const [demandeFileToUpload, setDemandeFileToUpload] = useState<File | null>(null);
//   const [q, setQ] = useState("");
//   const [items, setItems] = useState<any[]>([]);
//   const [selected, setSelected] = useState<any>(null);
//   const [details, setDetails] = useState<any>(null);
// const [selectedMachineId, setSelectedMachineId] = useState<string>("");
// const [clients, setClients] = useState<ClientUser[]>([]);
//   const [machines, setMachines] = useState<any[]>([]);

//   const [addOpen, setAddOpen] = useState(false);
//   const [toast, setToast] = useState({ open: false, msg: "" });
// const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);
//   const [form, setForm] = useState<TissuForm>({
//     code: "",
//    clientEmail:"",
//     demande: {
//       numeroDemande: "",
//       client: "",
//       support: "",
//       referenceSupportClient: "",
//       Recette: "",
//       ColorantDemandee: "",
//       Quantite: "",
//       remarques: "",
//       Composition: "",
//      Process: "",
//     Disignateur: "",
//     couleurEnvoyee: "",
//     StandardClient: "",
//     Prix: "",
//       dateReception: "",
//       dateLancement: null, // auto
//       delai: null // auto IA
//     },
//     routeMachineIds: []
//   });
// const [editOpen, setEditOpen] = useState(false);
// const [editId, setEditId] = useState<string | null>(null);
// const [editFile, setEditFile] = useState<File | null>(null);

// const [editSelectedMachineId, setEditSelectedMachineId] = useState<string>("");

// const [editForm, setEditForm] = useState<TissuForm>({
//   code: "",
//   clientEmail:"",
//   demande: {
//     numeroDemande: "",
//     client: "",
//     support: "",
//     referenceSupportClient: "",
//     Recette: "",
//      Composition: "",
//      Process: "",
//     Disignateur: "",
//     couleurEnvoyee: "",
//     StandardClient: "",
//     Prix: "",
//     ColorantDemandee: "",
//     Quantite: "",
//     remarques: "",
    
//     dateReception: "",
//     dateLancement: null,
//     delai: null
//   },
//   routeMachineIds: []
// });
// const [nomCouleurDemandee, setNomCouleurDemandee] = useState("");
// const [nomCouleurEnvoyee, setNomCouleurEnvoyee] = useState("");
// const [supportOptions, setSupportOptions] = useState([
//   "etop",
//   "bretelle",
//   "elastique",
// ]);

// const [compositionOptions, setCompositionOptions] = useState([
//   "coton",
//   "polyester",
//   "polyamide",
//   "viscose",
// ]);

// const [pantoneOptions, setPantoneOptions] = useState([
//   "Pantone 100 C",
//   "Pantone 185 C",
//   "Pantone 286 C",
//   "Pantone 355 C",
//   "Pantone Black C",
// ]);

// const colorsPalette = [
//   { name: "Rouge", value: "rgb(255,0,0)" },
//   { name: "Vert", value: "rgb(0,128,0)" },
//   { name: "Bleu", value: "rgb(0,0,255)" },
//   { name: "Noir", value: "rgb(0,0,0)" },
//   { name: "Blanc", value: "rgb(255,255,255)" },
//   { name: "Jaune", value: "rgb(255,255,0)" },
//   { name: "Orange", value: "rgb(255,165,0)" },
//   { name: "Rose", value: "rgb(255,192,203)" },
// ];
// const [machineCodeMap, setMachineCodeMap] = useState<Record<string, string>>({});

// const loadMachineCodes = async () => {
//   try {
//     const data = await listMachines();
//     const arr = Array.isArray(data) ? data : [];

//     const map: Record<string, string> = {};
//     arr.forEach((m: any) => {
//       if (m?.id) {
//         map[m.id] = m.code || m.nom || "--";
//       }
//     });

//     setMachineCodeMap(map);
//   } catch (e) {
//     console.error("Erreur chargement machines", e);
//   }
// };

// useEffect(() => {
//   loadMachineCodes();
// }, []);
//   const [file, setFile] = useState<File | null>(null);

//   const load = async () => {
//     const data = await listTissus(q.trim() ? q.trim() : undefined);
//     setItems(data);
//   };
// useEffect(() => {
//   listClients()
//     .then(setClients)
//     .catch((err) => console.error("Erreur chargement clients", err));
// }, []);
//   useEffect(() => { load(); }, []);
//   useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [q]);

//   const openDetails = async (t: any) => {
//     setSelected(t);
//     const d = await getTissuDetails(t.id);
//     setDetails(d);
//   };

//   const loadMachines = async () => {
//     const ms = await listMachines();
//     setMachines(ms);
//   };

//   useEffect(() => { loadMachines(); }, []);

//   // const downloadBlob = (blob: Blob, filename: string) => {
//   //   const url = window.URL.createObjectURL(blob);
//   //   const a = document.createElement("a");
//   //   a.href = url; a.download = filename; a.click();
//   //   window.URL.revokeObjectURL(url);
//   // };

// const downloadGeneratedDemande = async () => {
//   const blob = await generateDemandePdf(selected.id);
//   downloadBlob(blob, `demande_${selected.code}.pdf`);
// };
//   const downloadQr = async () => {
//     const blob = await downloadTissuQr(selected.id);
//     downloadBlob(blob, `qr_tissu_${selected.code}.png`);
//   };
// const onUpdate = async () => {
//   try {
//     if (!editId) return;

//     // validations (comme create)
//     if (!editForm.code.trim()) return setToast({ open: true, msg: "Code Article obligatoire" });
//     if (!editForm.demande.numeroDemande.trim()) return setToast({ open: true, msg: "N° Demande obligatoire" });
//     if (!editForm.demande.client.trim()) return setToast({ open: true, msg: "Client obligatoire" });
//     if (editForm.routeMachineIds.length === 0) return setToast({ open: true, msg: "Workflow machines obligatoire" });

//     await updateTissu(editId, editForm, editFile);

//     setToast({ open: true, msg: "✅ Article mis à jour" });
//     setEditOpen(false);
//     setEditId(null);
//     setEditFile(null);

//     load(); // refresh list
//   } catch (e: any) {
//     setToast({ open: true, msg: e?.response?.data || "❌ Erreur update Article" });
//   }
// };

// // Bouton QR Code
// const handleDownloadQr = async (id: string) => {
//   try {
//     const blob = await downloadTissuQr(id);
//     await downloadBlob(blob, `qr-${id}.png`);
//   } catch (e) {
//     console.error('Erreur QR =', e);
//     setToast({ open: true, msg: 'Erreur téléchargement QR' });
//   }
// };

// // Bouton PDF
// const handleDownloadPdf = async (id: string) => {
//   try {
//     const blob = await generateDemandePdf(id);
//     await downloadBlob(blob, `demande-${id}.pdf`);
//   } catch (e) {
//     console.error('Erreur PDF =', e);
//     setToast({ open: true, msg: 'Erreur téléchargement PDF'});
//   }
// };


//   const onCreate = async () => {
//     try {
//       // validations
//       if (!form.code.trim()) return setToast({ open: true, msg: "Code Article obligatoire" });
//       if (!form.demande.client.trim()) return setToast({ open: true, msg: "Client obligatoire" });
//       if (form.routeMachineIds.length === 0) return setToast({ open: true, msg: "Workflow machines obligatoire" });

//    const numeroAuto = getNextNumeroDemande();

// const dataToSend = {
//   ...form,
//   demande: {
//     ...form.demande,
//     numeroDemande: numeroAuto,
//   },
// };

// await createTissu(dataToSend, file);

// confirmNumeroDemandeCreated();

//       setToast({ open: true, msg: "✅ Article ajouté (statut EN_STOCK)" });
//       setAddOpen(false);
//       setFile(null);

//       setForm({
//         code: "",
//          clientEmail:"",
//         demande: {
//           numeroDemande: "",
//           client: "",
//           support: "",
//           referenceSupportClient: "",
//           Recette: "",
//           ColorantDemandee: "",
//           Quantite: "",
//            Composition: "",
//      Process: "",
//     Disignateur: "",
//     couleurEnvoyee: "",
//     StandardClient: "",
//     Prix: "",
//           remarques: "",
//           dateReception: "",
//           dateLancement: null,
//           delai: null
//         },
//         routeMachineIds: []
//       });

//       load();
//     } catch (e: any) {
//       setToast({ open: true, msg: e?.response?.data || "❌ Erreur ajout Article" });
//     }
//   };

//  const openEditModal = async (t: any) => {
//   setEditId(t.id);

//   const d = await getTissuDetails(t.id);

//   // ✅ IMPORTANT: le tissu réel est dans d.tissu
//   const tissu = d?.tissu ?? d;

//   setEditForm({
//     code: tissu?.code ?? t.code ?? "",
//     clientEmail: tissu?.clientEmail ?? t.clientEmail ?? "",
//     demande: {
//       numeroDemande: tissu?.demande?.numeroDemande ?? "",
//       client: tissu?.demande?.client ?? "",
//       support: tissu?.demande?.support ?? "",
//       referenceSupportClient: tissu?.demande?.referenceSupportClient ?? "",
//       Recette: tissu?.demande?.codeRecette ?? "",
//       ColorantDemandee: tissu?.demande?.typeColorant ?? "",
//       Quantite: tissu?.demande?.dimensions ?? "",
//       remarques: tissu?.demande?.remarques ?? "",
//       Composition: tissu?.demande?.Composition ?? "",
//       Process: tissu?.demande?.Process ?? "",
//       Disignateur: tissu?.demande?.Disignateur ?? "",
//       couleurEnvoyee: tissu?.demande?.couleurEnvoyee ?? "",
//       StandardClient: tissu?.demande?.StandardClient ?? "",
//       Prix: tissu?.demande?.Prix ?? "",
//       dateReception: tissu?.demande?.dateReception ?? "",
//       dateLancement: tissu?.demande?.dateLancement ?? null,
//       delai: tissu?.demande?.delai ?? null,
//     },
//     routeMachineIds:
//       tissu?.routeMachineIds ??
//       tissu?.routeMachine?.map((m: any) => m.id) ??
//       [],
//   });

//   setEditFile(null);
//   setEditSelectedMachineId("");
//   setEditOpen(true);
// };
// const addOptionIfNew = (
//   value: string,
//   options: string[],
//   setOptions: React.Dispatch<React.SetStateAction<string[]>>
// ) => {
//   const v = value.trim();
//   if (!v) return;

//   const exists = options.some(
//     (op) => op.toLowerCase() === v.toLowerCase()
//   );

//   if (!exists) {
//     setOptions([...options, v]);
//   }
// };
// const addPantoneIfNew = (value: string) => {
//   const v = value.trim();
//   if (!v) return;

//   const exists = pantoneOptions.some(
//     (p) => p.toLowerCase() === v.toLowerCase()
//   );

//   if (!exists) {
//     setPantoneOptions([...pantoneOptions, v]);
//   }
// };
// const colorNames: Record<string, { r: number; g: number; b: number }> = {
//   rouge: { r: 255, g: 0, b: 0 },
//   vert: { r: 0, g: 128, b: 0 },
//   bleu: { r: 0, g: 0, b: 255 },
//   noir: { r: 0, g: 0, b: 0 },
//   blanc: { r: 255, g: 255, b: 255 },
//   jaune: { r: 255, g: 255, b: 0 },
//   orange: { r: 255, g: 165, b: 0 },
//   rose: { r: 255, g: 192, b: 203 },
//   violet: { r: 128, g: 0, b: 128 },
//   gris: { r: 128, g: 128, b: 128 },
// };

// const rgbToText = (r: number, g: number, b: number) => `rgb(${r},${g},${b})`;

// const findColorName = (r: number, g: number, b: number) => {
//   const found = Object.entries(colorNames).find(
//     ([, value]) => value.r === r && value.g === g && value.b === b
//   );
//   return found ? found[0] : "";
// };

// const getRgbFromText = (value: string) => {
//   const match = value.match(/rgb\((\d+),(\d+),(\d+)\)/);
//   if (!match) return { r: 255, g: 255, b: 255 };

//   return {
//     r: Number(match[1]),
//     g: Number(match[2]),
//     b: Number(match[3]),
//   };
// };
// const getNextNumeroDemande = () => {
//   const lastNumber = Number(localStorage.getItem("lastNumeroDemande") || "1000");
//   return `D-${lastNumber + 1}`;
// };

// const confirmNumeroDemandeCreated = () => {
//   const lastNumber = Number(localStorage.getItem("lastNumeroDemande") || "1000");
//   localStorage.setItem("lastNumeroDemande", String(lastNumber + 1));
// };
//   return (
//     <IonPage>
     

//       <IonContent className="page-bg">
//          <TopMenu title="🧵 Articles" />
  
//         <div className="container">
          
//           <div className="top-row">
//             <IonSearchbar value={q} onIonChange={(e) => setQ(e.detail.value!)} placeholder="Rechercher un Article..." />
//             <IonButton className="btn-main" onClick={() => setAddOpen(true)}>
//               <IonIcon icon={addOutline} slot="start" />
//               Ajouter
//             </IonButton>
//           </div>

//           {items.map((t) => (
//   <div key={t.id} className="card card-tissu" onClick={() => openDetails(t)}>
    

//     {/* ✅ Bouton update en haut à droite */}
//     <IonButton
 

//       className="tissu-edit-btn"
//       fill="clear"
//       onClick={(e) => {
//         e.stopPropagation();   // ✅ sinon ça ouvre aussi openDetails
//         openEditModal(t);      // ✅ à créer (voir point 3)
//       }}
//     >
//       <IonIcon icon={createOutline} />
//     </IonButton>

//     <div className="card-title">{t.code}</div>

//     <div className={`badge ${
//       t.statut === "LIVRE" ? "badge-ok" : (t.statut === "EN_TRAITEMENT" ? "badge-warn" : "badge-stock")
//     }`}>
//       {t.statut === "LIVRE" ? "Livré" : (t.statut === "EN_TRAITEMENT" ? "En traitement" : "En stock")}
//     </div>

//   </div>
// ))}
//         </div>

//         {/* Modal ajout */}
//         <IonModal
//   isOpen={addOpen}
//   onDidDismiss={() => setAddOpen(false)}
//   className="date-modal"
// >
//   <IonContent className="date-modal-content">
  
//     <div className="modal-head">
//       <h3>Ajouter un Article</h3>
//       <IonButton fill="clear" onClick={() => setAddOpen(false)}>
//         <IonIcon icon={closeOutline} />
//       </IonButton>
//     </div>

//     {/* Code article */}
//     <div className="field">
//       <label className="label">Code Article</label>
//       <IonInput
//         className="input-plain"
//         value={form.code}
//         placeholder="T-001"
//         onIonInput={(e) =>
//           setForm({ ...form, code: String(e.detail.value ?? "") })
//         }
//       />
//     </div>

//    {/* Date réception */}
//     <div className="field">
//       <label className="label">Date réception</label>
//       <IonInput
//         className="input-plain"
//         type="date"
//         value={form.demande.dateReception}
//         onIonInput={(e) =>
//           setForm({
//             ...form,
//             demande: {
//               ...form.demande,
//               dateReception: String(e.detail.value ?? "")
//             }
//           })
//         }
//       />
//     </div>

// <div className="field">
//   <label className="label">Support</label>

//   <input
//     className="input-plain"
//     list="support-list"
//     value={form.demande.support}
//     placeholder="choisir ou saisir un support"
//     onChange={(e) =>
//       setForm({
//         ...form,
//         demande: {
//           ...form.demande,
//           support: e.target.value,
//         },
//       })
//     }
//     onBlur={(e) =>
//       addOptionIfNew(e.target.value, supportOptions, setSupportOptions)
//     }
//   />

//   <datalist id="support-list">
//     {supportOptions.map((op) => (
//       <option key={op} value={op} />
//     ))}
//   </datalist>
// </div>
// <div className="field">
//   <label className="label">Composition</label>

//   <input
//     className="input-plain"
//     list="composition-list"
//     value={form.demande.Composition}
//     placeholder="choisir ou saisir les composition"
//     onChange={(e) =>
//       setForm({
//         ...form,
//         demande: {
//           ...form.demande,
//           Composition: e.target.value,
//         },
//       })
//     }
//     onBlur={(e) =>
//       addOptionIfNew(e.target.value, compositionOptions, setCompositionOptions)
//     }
//   />

//   <datalist id="composition-list">
//     {compositionOptions.map((op) => (
//       <option key={op} value={op} />
//     ))}
//   </datalist>
// </div>

//        {/* Process */}
//     <div className="field">
//       <label className="label">Process</label>
//       <IonInput
//         className="input-plain"
// placeholder="Process"
//         value={form.demande.Process}
//         onIonInput={(e) =>
//           setForm({
//             ...form,
//             demande: {
//               ...form.demande,
//               Process: String(e.detail.value ?? "")
//             }
//           })
//         }
//       />
//     </div>

//     {/* N° Demande */}
//    <div className="field">
//   <label className="label">N° Demande</label>

//   <IonInput
//     className="input-plain"
//     value={form.demande.numeroDemande}
//     placeholder={getNextNumeroDemande()}
//     readonly
//   />
// </div>

//    {/* Disignateur */}
//     <div className="field">
//       <label className="label">Disignation</label>
//       <IonInput
//         className="input-plain"
//         placeholder="Disignation"
//         value={form.demande.Disignateur}
//         onIonInput={(e) =>
//           setForm({
//             ...form,
//             demande: {
//               ...form.demande,
//               Disignateur: String(e.detail.value ?? "")
//             }
//           })
//         }
//       />
//     </div>


    

//     {/* Client */}
//     <div className="field">
//       <label className="label">Client</label>
//       <select
//   className="input-plain"
//   value={form.clientEmail}
//   onChange={(e) => {
//     const email = e.target.value;
//     const client = clients.find((c) => c.email === email);

//     setForm({
//       ...form,
//       clientEmail: email,
//       demande: {
//         ...form.demande,
//         client: client ? `${client.nom} ${client.prenom}` : "",
//       },
//     });
//   }}
// >
//   <option value="">Sélectionner un client</option>

//   {clients.map((c) => (
//     <option key={c.id} value={c.email}>
//       {c.nom} {c.prenom}
//     </option>
//   ))}
// </select>
//       {/* <IonInput
//         className="input-plain"
//         value={form.demande.client}
//         placeholder="Société X"
//         onIonInput={(e) =>
//           setForm({
//             ...form,
//             demande: {
//               ...form.demande,
//               client: String(e.detail.value ?? "")
//             }
//           })
//         }
//       /> */}
//     </div>


//  {/* client id */}
//       {/* <div className="field">
//       <label className="label">Email client</label>
//       <IonInput
//         className="input-plain"
//         value={form.clientEmail}
//         placeholder="client@gmail.com"
//         onIonInput={(e) =>
//           setForm({ ...form, clientEmail: String(e.detail.value ?? "") })
//         }
//       />
//     </div> */}


// <IonInput
//   className="input-plain"
//   value={form.clientEmail}
//   placeholder="Email client"
//   readonly
// /> 
// {/* Référence support client */}
// <div className="field">
//   <label className="label">Référence support client</label>
//   <IonInput
//     className="input-plain"
//     value={form.demande.referenceSupportClient}
//     placeholder="REF-CL-001"
//     onIonInput={(e) =>
//       setForm({ ...form, demande: { ...form.demande, referenceSupportClient: String(e.detail.value ?? "")  }})
//     }
//   />
// </div>

// {/* couleurEnvoyee */}
//     {/* <div className="field">
//       <label className="label">couleur Envoyee</label>
//       <IonInput
//         className="input-plain"
//         value={form.demande.couleurEnvoyee}
//         placeholder="couleur Envoyee"
//         onIonInput={(e) =>
//           setForm({
//             ...form,
//             demande: {
//               ...form.demande,
//               couleurEnvoyee: String(e.detail.value ?? "")
//             }
//           })
//         }
//       />
//     </div> */}
//  <div className="field">
//   <label className="label">Couleur Envoyée</label>

//   {(() => {
//     const rgb = getRgbFromText(form.demande.couleurEnvoyee);
//     const colorName = findColorName(rgb.r, rgb.g, rgb.b);

//     return (
//       <>
//         <input
//   className="input-plain"
//   list="color-name-list"
//   placeholder="Nom couleur : rouge, bleu, beige..."
//   value={nomCouleurEnvoyee}
//   onChange={(e) => {
//     const name = e.target.value;
//     setNomCouleurEnvoyee(name);

//     const key = name.toLowerCase().trim();

//     if (colorNames[key]) {
//       const c = colorNames[key];

//       setForm({
//         ...form,
//         demande: {
//           ...form.demande,
//           couleurEnvoyee: rgbToText(c.r, c.g, c.b),
//         },
//       });
//     }
//   }}
// />

//         <div className="rgb-row">
//           <input
//             className="rgb-input"
//             type="number"
//             min="0"
//             max="255"
//             placeholder="R"
//             value={rgb.r}
//             onChange={(e) => {
//               const r = Number(e.target.value);
//               setForm({
//                 ...form,
//                 demande: {
//                   ...form.demande,
//                   couleurEnvoyee: rgbToText(r, rgb.g, rgb.b),
//                 },
//               });
//             }}
//           />

//           <input
//             className="rgb-input"
//             type="number"
//             min="0"
//             max="255"
//             placeholder="G"
//             value={rgb.g}
//             onChange={(e) => {
//               const g = Number(e.target.value);
//               setForm({
//                 ...form,
//                 demande: {
//                   ...form.demande,
//                   couleurEnvoyee: rgbToText(rgb.r, g, rgb.b),
//                 },
//               });
//             }}
//           />

//           <input
//             className="rgb-input"
//             type="number"
//             min="0"
//             max="255"
//             placeholder="B"
//             value={rgb.b}
//             onChange={(e) => {
//               const b = Number(e.target.value);
//               setForm({
//                 ...form,
//                 demande: {
//                   ...form.demande,
//                   couleurEnvoyee: rgbToText(rgb.r, rgb.g, b),
//                 },
//               });
//             }}
//           />

//           <div
//             className="color-preview"
//             style={{
//               background: form.demande.couleurEnvoyee,
//             }}
//           />
//         </div>

        
//       </>
//     );
//   })()}
// </div>
// {/* Type colorant */}
// {/* <div className="field">
//   <label className="label">Couleur Demandee</label>
//   <IonInput
//     className="input-plain"
//     value={form.demande.ColorantDemandee}
//     placeholder="Couleur Demandee"
//     onIonInput={(e) =>
//       setForm({ ...form, demande: { ...form.demande, ColorantDemandee: String(e.detail.value ?? "") } })
//     }
//   />
// </div> */}
// <div className="field">
//   <label className="label">Couleur Demandée</label>

//   {(() => {
//     const rgb = getRgbFromText(form.demande.ColorantDemandee);
//     const colorName = findColorName(rgb.r, rgb.g, rgb.b);

//     return (
//       <>
//         <input
//   className="input-plain"
//   list="color-name-list"
//   placeholder="Nom couleur : rouge, bleu, beige..."
//   value={nomCouleurDemandee}
//   onChange={(e) => {
//     const name = e.target.value;
//     setNomCouleurDemandee(name);

//     const key = name.toLowerCase().trim();

//     if (colorNames[key]) {
//       const c = colorNames[key];

//       setForm({
//         ...form,
//         demande: {
//           ...form.demande,
//           ColorantDemandee: rgbToText(c.r, c.g, c.b),
//         },
//       });
//     }
//   }}
// />

//         <div className="rgb-row">
//           <input
//             className="rgb-input"
//             type="number"
//             min="0"
//             max="255"
//             placeholder="R"
//             value={rgb.r}
//             onChange={(e) => {
//               const r = Number(e.target.value);
//               setForm({
//                 ...form,
//                 demande: {
//                   ...form.demande,
//                   ColorantDemandee: rgbToText(r, rgb.g, rgb.b),
//                 },
//               });
//             }}
//           />

//           <input
//             className="rgb-input"
//             type="number"
//             min="0"
//             max="255"
//             placeholder="G"
//             value={rgb.g}
//             onChange={(e) => {
//               const g = Number(e.target.value);
//               setForm({
//                 ...form,
//                 demande: {
//                   ...form.demande,
//                   ColorantDemandee: rgbToText(rgb.r, g, rgb.b),
//                 },
//               });
//             }}
//           />

//           <input
//             className="rgb-input"
//             type="number"
//             min="0"
//             max="255"
//             placeholder="B"
//             value={rgb.b}
//             onChange={(e) => {
//               const b = Number(e.target.value);
//               setForm({
//                 ...form,
//                 demande: {
//                   ...form.demande,
//                   ColorantDemandee: rgbToText(rgb.r, rgb.g, b),
//                 },
//               });
//             }}
//           />

//           <div
//             className="color-preview"
//             style={{
//               background: form.demande.ColorantDemandee,
//             }}
//           />
//         </div>

       
//       </>
//     );
//   })()}

//   <datalist id="color-name-list">
//     {Object.keys(colorNames).map((name) => (
//       <option key={name} value={name} />
//     ))}
//   </datalist>
// </div>

// {/* StandardClient */}
//     {/* <div className="field">
//       <label className="label">Standard Client</label>
//       <IonInput
//         className="input-plain"
//         value={form.demande.StandardClient}
//         placeholder="code pantone"
//         onIonInput={(e) =>
//           setForm({
//             ...form,
//             demande: {
//               ...form.demande,
//               StandardClient: String(e.detail.value ?? "")
//             }
//           })
//         }
//       />
//     </div> */}
// <div className="field">
//   <label className="label">Standard Client </label>

//   <input
//     className="input-plain"
//     list="pantone-list"
//     value={form.demande.StandardClient}
//     placeholder="Ex: Pantone 185 C"
//     onChange={(e) =>
//       setForm({
//         ...form,
//         demande: {
//           ...form.demande,
//           StandardClient: e.target.value,
//         },
//       })
//     }
//     onBlur={(e) => addPantoneIfNew(e.target.value)}
//   />

//   <datalist id="pantone-list">
//     {pantoneOptions.map((p) => (
//       <option key={p} value={p} />
//     ))}
//   </datalist>
// </div>
// {/* recette */}
// <div className="field">
//   <label className="label">Recette</label>
//   <IonInput
//     className="input-plain"
//     value={form.demande.Recette}
//     placeholder="recette"
//     onIonInput={(e) =>
//       setForm({ ...form, demande: { ...form.demande, Recette: String(e.detail.value ?? "") } })
//     }
//   />
// </div>



// {/* Quantite */}
// <div className="field">
//   <label className="label">Quantite</label>
//   <IonInput
//     className="input-plain"
//     value={form.demande.Quantite}
//     placeholder="20k"
//     onIonInput={(e) =>
//       setForm({ ...form, demande: { ...form.demande, Quantite: String(e.detail.value ?? "") } })
//     }
//   />
// </div>


// {/* Prix */}
// <div className="field">
//   <label className="label">Prix</label>
//   <IonInput
//     className="input-plain"
//     value={form.demande.Prix}
//     placeholder="5500DT"
//     onIonInput={(e) =>
//       setForm({ ...form, demande: { ...form.demande, Prix: String(e.detail.value ?? "") } })
//     }
//   />
// </div>

// {/* remarque */}
// <div className="field">
//   <label className="label">Remarques</label>
//   <IonInput
//     className="input-plain"
//     value={form.demande.remarques}
//     placeholder="votre remarques"
//     onIonInput={(e) =>
//       setForm({ ...form, demande: { ...form.demande, remarques: String(e.detail.value ?? "") } })
//     }
//   />
// </div>


//     {/* Workflow machines */}
//    {/* Workflow machines (ordre) */}
// <div className="field">
//   <label className="label">Workflow machines (ordre)</label>

//   {/* Choisir une machine */}
//   <select
//     value={selectedMachineId}
//     onChange={(e) => setSelectedMachineId(e.target.value)}
//     className="input-plain"
//   >
//     <option value="">— Choisir une machine —</option>
//     {machines.map((m) => (
//       <option key={m.id} value={m.id}>
//         {m.code} - {m.nom}
//       </option>
//     ))}
//   </select>

//   {/* Bouton ajouter */}
//   <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
//     <IonButton
//       className="go-btn"
//       fill="outline"
//       disabled={!selectedMachineId}
//       onClick={() => {
//         if (!selectedMachineId) return;

//         // éviter doublon
//         if (form.routeMachineIds.includes(selectedMachineId)) return;

//         setForm({
//           ...form,
//           routeMachineIds: [...form.routeMachineIds, selectedMachineId],
//         });

//         setSelectedMachineId("");
//       }}
//     >
//       Ajouter à la route
//     </IonButton>
//   </div>

//   {/* Affichage de la route + réordonner */}
//   <div style={{ marginTop: 12 }}>
//     {form.routeMachineIds.length === 0 ? (
//       <div className="muted">Aucune machine dans le workflow.</div>
//     ) : (
//       form.routeMachineIds.map((mid, idx) => {
//         const m = machines.find((x) => x.id === mid);
//         return (
//           <div key={mid} className="erp-card" style={{ marginBottom: 10, cursor: "default" }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <div>
//                 <b>Étape {idx + 1}</b> — {m ? `${m.code} - ${m.nom}` : mid}
//               </div>

//               <div  className="route-actions" style={{ display: "flex", gap: 8 }}>
//                 <IonButton
//                   fill="clear"
//                   disabled={idx === 0}
//                   onClick={() => {
//                     const arr = [...form.routeMachineIds];
//                     [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
//                     setForm({ ...form, routeMachineIds: arr });
//                   }}
//                 >
//                   ↑
//                 </IonButton>

//                 <IonButton
//                   fill="clear"
//                   disabled={idx === form.routeMachineIds.length - 1}
//                   onClick={() => {
//                     const arr = [...form.routeMachineIds];
//                     [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
//                     setForm({ ...form, routeMachineIds: arr });
//                   }}
//                 >
//                   ↓
//                 </IonButton>

//                 <IonButton
//                   fill="clear"
//                   onClick={() => {
//                     const arr = form.routeMachineIds.filter((x) => x !== mid);
//                     setForm({ ...form, routeMachineIds: arr });
//                   }}
//                 >
//                   Supprimer
//                 </IonButton>
//               </div>
//             </div>
//           </div>
//         );
//       })
//     )}
//   </div>
// </div>


//     {/* Upload */}
//     <div className="field">
//       <label className="label">Fichier demande (optionnel)</label>
//       <input
//         type="file"
//         className="input-plain"
//         onChange={(e) => setFile(e.target.files?.[0] || null)}
//       />
//     </div>

//     <div className="row">
//       <IonButton className="go-btn" fill="outline" onClick={onCreate}>
//         Ajouter
//       </IonButton>
//     </div>

//   </IonContent>
// </IonModal>

// <IonModal
//   isOpen={editOpen}
//   onDidDismiss={() => setEditOpen(false)}
//   className="date-modal"
// >
//   <IonContent className="date-modal-content">

//     <div className="modal-head">
//       <h3>Modifier un Article</h3>
//       <IonButton fill="clear" onClick={() => setEditOpen(false)}>
//         <IonIcon icon={closeOutline} />
//       </IonButton>
//     </div>

//     {/* Code Article */}
//     <div className="field">
//       <label className="label">Code Article</label>
//       <IonInput
//         className="input-plain"
//         value={editForm.code}
//         placeholder="T-001"
//         onIonInput={(e) =>
//           setEditForm({ ...editForm, code: String(e.detail.value ?? "") })
//         }
//       />
//     </div>

//     {/* Date réception */}
//     <div className="field">
//       <label className="label">Date réception</label>
//       <IonInput
//         className="input-plain"
//         type="date"
//         value={editForm.demande.dateReception}
//         onIonInput={(e) =>
//           setEditForm({
//             ...editForm,
//             demande: {
//               ...editForm.demande,
//               dateReception: String(e.detail.value ?? "")
//             }
//           })
//         }
//       />
//     </div>

//  {/* Support */}
//     <div className="field">
//       <label className="label">Support</label>
//       <IonInput
//         className="input-plain"
//         value={editForm.demande.support}
//         placeholder="Coton / Polyester..."
//         onIonInput={(e) =>
//           setEditForm({
//             ...editForm,
//             demande: { ...editForm.demande, support: String(e.detail.value ?? "") }
//           })
//         }
//       />
//     </div>

// {/* Composition */}
//     <div className="field">
//       <label className="label">Composition</label>
//       <IonInput
//         className="input-plain"
//         value={editForm.demande.Composition}
//         placeholder="Composition"
//         onIonInput={(e) =>
//           setEditForm({
//             ...editForm,
//             demande: { ...editForm.demande, Composition: String(e.detail.value ?? "") }
//           })
//         }
//       />
//     </div>


//     {/* Process */}
//     <div className="field">
//       <label className="label">Process</label>
//       <IonInput
//         className="input-plain"
//         value={editForm.demande.Process}
//         placeholder="Process"
//         onIonInput={(e) =>
//           setEditForm({
//             ...editForm,
//             demande: {
//               ...editForm.demande,
//               Process: String(e.detail.value ?? "")
//             }
//           })
//         }
//       />
//     </div>

// {/* Ndemanade */}
//     <div className="field">
//       <label className="label">N° Demande</label>
//       <IonInput
//         className="input-plain"
//         value={editForm.demande.numeroDemande}
//         placeholder="D-100"
//         onIonInput={(e) =>
//           setEditForm({
//             ...editForm,
//             demande: { ...editForm.demande, numeroDemande: String(e.detail.value ?? "") }
//           })
//         }
//       />
//     </div>
//     {/* Disignateur */}
//     <div className="field">
//       <label className="label">Disignation</label>
//       <IonInput
//         className="input-plain"
//         value={editForm.demande.Disignateur}
//         placeholder="Disignation"
//         onIonInput={(e) =>
//           setEditForm({
//             ...editForm,
//             demande: { ...editForm.demande, Disignateur: String(e.detail.value ?? "") }
//           })
//         }
//       />
//     </div>


//     {/* Client */}
//     <div className="field">
//       <label className="label">Client</label>
//       <IonInput
//         className="input-plain"
//         value={editForm.demande.client}
//         placeholder="Société X"
//         onIonInput={(e) =>
//           setEditForm({
//             ...editForm,
//             demande: {
//               ...editForm.demande,
//               client: String(e.detail.value ?? "")
//             }
//           })
//         }
//       />
//     </div>

    

//    {/* id client */}
//     <div className="field">
//       <label className="label">Email client</label>
//       <IonInput
//         className="input-plain"
//         value={editForm.clientEmail}
//         placeholder="client@gmail.com"
//           onIonInput={(e) =>
//           setEditForm({ ...editForm, clientEmail: String(e.detail.value ?? "") })
//         }
//       />
//     </div>

//     {/* Référence support client */}
//     <div className="field">
//       <label className="label">Référence support client</label>
//       <IonInput
//         className="input-plain"
//         value={editForm.demande.referenceSupportClient}
//         placeholder="REF-CL-001"
//         onIonInput={(e) =>
//           setEditForm({
//             ...editForm,
//             demande: { ...editForm.demande, referenceSupportClient: String(e.detail.value ?? "") }
//           })
//         }
//       />
//     </div>

//     {/* couleurEnvoyee */}
//     <div className="field">
//       <label className="label">couleur Envoyee</label>
//       <IonInput
//         className="input-plain"
//         value={editForm.demande.couleurEnvoyee}
//         placeholder="couleur Envoyee"
//         onIonInput={(e) =>
//           setEditForm({
//             ...editForm,
//             demande: { ...editForm.demande, couleurEnvoyee: String(e.detail.value ?? "") }
//           })
//         }
//       />
//     </div>

//     {/* ColorantDemandee */}
//     <div className="field">
//       <label className="label">Colorant Demandee</label>
//       <IonInput
//         className="input-plain"
//         value={editForm.demande.ColorantDemandee}
//         placeholder="Colorant Demandee"
//         onIonInput={(e) => 
//           setEditForm({
//             ...editForm,
//             demande: { ...editForm.demande, ColorantDemandee: String(e.detail.value ?? "") }
//           })
//         }
//       />
//     </div>

//     {/* StandardClient */}
//     <div className="field">
//       <label className="label">Standard Client</label>
//       <IonInput
//         className="input-plain"
//         value={editForm.demande.StandardClient}
//         placeholder="Standard Client"
//         onIonInput={(e) =>
//           setEditForm({
//             ...editForm,
//             demande: { ...editForm.demande, StandardClient: String(e.detail.value ?? "") }
//           })
//         }
//       />
//     </div>

//     {/*recette */}
//     <div className="field">
//       <label className="label">Recette</label>
//       <IonInput
//         className="input-plain"
//         value={editForm.demande.Recette}
//         placeholder="RC-2026-01"
//         onIonInput={(e) =>
//           setEditForm({
//             ...editForm,
//             demande: { ...editForm.demande, Recette: String(e.detail.value ?? "") }
//           })
//         }
//       />
//     </div>

//     {/* Quantite */}
//     <div className="field">
//       <label className="label">Quantite</label>
//       <IonInput
//         className="input-plain"
//         value={editForm.demande.Quantite}
//         placeholder="20k"
//         onIonInput={(e) =>
//           setEditForm({
//             ...editForm,
//             demande: { ...editForm.demande, Quantite: String(e.detail.value ?? "") }
//           })
//         }
//       />
//     </div>

//     {/* prix */}
//     <div className="field">
//       <label className="label">Prix</label>
//       <IonInput
//         className="input-plain"
//         value={editForm.demande.Prix}
//         placeholder="500DT"
//         onIonInput={(e) =>
//           setEditForm({
//             ...editForm,
//             demande: { ...editForm.demande, Prix: String(e.detail.value ?? "") }
//           })
//         }
//       />
//     </div>

// {/* remarques */}
//     <div className="field">
//       <label className="label">remarques</label>
//       <IonInput
//         className="input-plain"
//         value={editForm.demande.remarques}
//         placeholder="remarques"
//         onIonInput={(e) =>
//           setEditForm({
//             ...editForm,
//             demande: { ...editForm.demande, remarques: String(e.detail.value ?? "") }
//           })
//         }
//       />
//     </div>
//     {/* Workflow machines */}
//     <div className="field">
//       <label className="label">Workflow machines (ordre)</label>

//       <select
//         value={editSelectedMachineId}
//         onChange={(e) => setEditSelectedMachineId(e.target.value)}
//         className="input-plain"
//       >
//         <option value="">— Choisir une machine —</option>
//         {machines.map((m) => (
//           <option key={m.id} value={m.id}>
//             {m.code} - {m.nom}
//           </option>
//         ))}
//       </select>

//       <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
//         <IonButton
//           className="go-btn"
//           fill="outline"
//           disabled={!editSelectedMachineId}
//           onClick={() => {
//             if (!editSelectedMachineId) return;
//             if (editForm.routeMachineIds.includes(editSelectedMachineId)) return;

//             setEditForm({
//               ...editForm,
//               routeMachineIds: [...editForm.routeMachineIds, editSelectedMachineId],
//             });

//             setEditSelectedMachineId("");
//           }}
//         >
//           Ajouter à la route
//         </IonButton>
//       </div>

//       <div style={{ marginTop: 12 }}>
//         {editForm.routeMachineIds.length === 0 ? (
//           <div className="muted">Aucune machine dans le workflow.</div>
//         ) : (
//           editForm.routeMachineIds.map((mid, idx) => {
//             const m = machines.find((x) => x.id === mid);
//             return (
//               <div key={mid} className="erp-card" style={{ marginBottom: 10, cursor: "default" }}>
//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <div>
//                     <b>Étape {idx + 1}</b> — {m ? `${m.code} - ${m.nom}` : mid}
//                   </div>

//                   <div className="route-actions" style={{ display: "flex", gap: 8 }}>
//                     <IonButton
//                       fill="clear"
//                       disabled={idx === 0}
//                       onClick={() => {
//                         const arr = [...editForm.routeMachineIds];
//                         [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
//                         setEditForm({ ...editForm, routeMachineIds: arr });
//                       }}
//                     >
//                       ↑
//                     </IonButton>

//                     <IonButton
//                       fill="clear"
//                       disabled={idx === editForm.routeMachineIds.length - 1}
//                       onClick={() => {
//                         const arr = [...editForm.routeMachineIds];
//                         [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
//                         setEditForm({ ...editForm, routeMachineIds: arr });
//                       }}
//                     >
//                       ↓
//                     </IonButton>

//                     <IonButton
//                       fill="clear"
//                       onClick={() => {
//                         const arr = editForm.routeMachineIds.filter((x) => x !== mid);
//                         setEditForm({ ...editForm, routeMachineIds: arr });
//                       }}
//                     >
//                       Supprimer
//                     </IonButton>
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>

//     {/* Upload demande (remplacer) */}
//     <div className="field">
//       <label className="label">Remplacer fichier demande (optionnel)</label>
//       <input
//         type="file"
//         className="input-plain"
//         onChange={(e) => setEditFile(e.target.files?.[0] || null)}
//       />
//     </div>

//     <div className="row">
//       <IonButton className="go-btn" fill="outline" onClick={() => setConfirmUpdateOpen(true)}>
//         Mettre à jour
//       </IonButton>
//     </div>

//   </IonContent>
// </IonModal>
// <IonModal
//   isOpen={confirmUpdateOpen} onDidDismiss={() => setConfirmUpdateOpen(false)}   className="confirm-update-modal"
// >
//   <div className="confirm-modal">
//     <div className="modal-head">
//       <h3>Confirmation</h3>
//       <IonButton fill="clear" onClick={() => setConfirmUpdateOpen(false)}>
//         <IonIcon icon={closeOutline} />
//       </IonButton>
//     </div>

//     <div className="confirm-body">
//       <p>Voulez-vous enregistrer les modifications ?</p>
//     </div>

//     <div className="confirm-actions">
//       <IonButton
//         className="btn-cancel"
//         fill="outline"
//         onClick={() => setConfirmUpdateOpen(false)}
//       >
//         Annuler
//       </IonButton>

//       <IonButton
//         className="btn-confirm"
//         onClick={async () => {
//           setConfirmUpdateOpen(false);
//           await onUpdate();
//         }}
//       >
//         Oui, enregistrer
//       </IonButton>
//     </div>

//  </div>

// </IonModal>

//         {/* Modal détails (affiche statut + dateLancement) */}
//       <IonModal
//   isOpen={!!selected}
//   onDidDismiss={() => {
//     setSelected(null);
//     setDetails(null);
//   }}
// >
//   <IonHeader>
//     <IonToolbar>
//       <IonTitle>Détails Article</IonTitle>

//       <IonButtons slot="end">
//         <IonButton
//           fill="clear"
//           onClick={() => {
//             setSelected(null);
//             setDetails(null);
//           }}
//         >
//           <IonIcon icon={closeOutline} />
//         </IonButton>
//       </IonButtons>
//     </IonToolbar>
//   </IonHeader>

//   <IonContent className="modal-content">
//     <div className="container">
//       {selected && (
//         <>
//           <div className="card">
//             <div className="card-title">{selected.code}</div>
//             <div className="muted">
//               Statut: {selected.statut} <br />
//               Date lancement:{" "}
//               {selected.demande?.dateLancement
//                 ? new Date(selected.demande.dateLancement).toLocaleString()
//                 : "-"}
//             </div>
//           </div>

//           <div className="card">
//             <div className="card-title">Téléchargements</div>
//             <div className="row">
//               {/* <IonButton className="btn-main" onClick={downloadQr}>
//                 <IonIcon icon={downloadOutline} slot="start" />
//                 Télécharger QR
//               </IonButton> */}
// <IonButton onClick={() => handleDownloadQr(selected.id)}>
//   <IonIcon icon={downloadOutline} slot="start" />
//   Télécharger QR
// </IonButton>
//               <div className="field" style={{ marginTop: 10 }}>
//          <IonButton onClick={() => handleDownloadPdf(selected.id)}>
//   <IonIcon icon={downloadOutline} slot="start" />
//   Télécharger PDF (Demande)
// </IonButton>
//                 {/* <IonButton
//                   className="btn-outline"
//                   onClick={downloadGeneratedDemande}
//                   disabled={!selected?.id}
//                 >
//                   <IonIcon icon={downloadOutline} slot="start" />
//                   Demande (PDF)
//                 </IonButton> */}
//               </div>
//             </div>
//           </div>

//           <div className="card">
//             <div className="card-title">Temps par machine</div>
//             {details?.secondsByMachine ? (
//               Object.entries(details.secondsByMachine).map(([mid, sec]: any) => (
//                 <div key={mid} className="muted">
//                   Machine {machineCodeMap[mid] || mid} : {Math.round(Number(sec) / 60)} min
//                 </div>
//               ))
//             ) : (
//               <div className="muted">Aucune donnée</div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   </IonContent>
// </IonModal>
//         <IonToast isOpen={toast.open} message={toast.msg} duration={1600}
//           onDidDismiss={() => setToast({ open: false, msg: "" })} />
//       </IonContent>
//     </IonPage>
//   );
// }
import React, { useEffect, useState } from "react";
import { IonButtons } from "@ionic/react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonModal,
  IonInput,
  IonToast,
} from "@ionic/react";
import { downloadBlob } from "../utils/downloadHelper";
import { listClients, ClientUser } from "../services/tissus.service";
import { addOutline, closeOutline, createOutline, downloadOutline } from "ionicons/icons";
import "./CommonDesign.css";
import TopMenu from "../components/TopMenu";
import { listMachines } from "../services/machines.service";
import {
  listTissus,
  getTissuDetails,
  createTissu,
  downloadTissuQr,
  generateDemandePdf,
  TissuForm,
  updateTissu,
} from "../services/tissus.service";

type ComboBoxProps = {
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
  onAddNew?: (value: string) => void;
};

function ComboBox({ value, options, placeholder, onChange, onAddNew }: ComboBoxProps) {
  const [open, setOpen] = useState(false);

  const filtered = options.filter((op) =>
    op.toLowerCase().includes((value || "").toLowerCase())
  );

  return (
    <div className="combo-box">
      <input
        className="input-plain combo-input"
        value={value}
        placeholder={placeholder}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onBlur={() => {
          setTimeout(() => {
            setOpen(false);
            if (value.trim()) onAddNew?.(value);
          }, 150);
        }}
      />

      <span className="combo-arrow">⌄</span>

      {open && (
        <div className="combo-list">
          {filtered.length > 0 ? (
            filtered.map((op) => (
              <div
                key={op}
                className="combo-item"
                onMouseDown={() => {
                  onChange(op);
                  setOpen(false);
                }}
              >
                {op}
              </div>
            ))
          ) : value.trim() ? (
            <div
              className="combo-item combo-add"
              onMouseDown={() => {
                onAddNew?.(value);
                setOpen(false);
              }}
            >
              + Ajouter "{value}"
            </div>
          ) : (
            <div className="combo-item combo-empty">Aucune option</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Tissus() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [details, setDetails] = useState<any>(null);
  const [selectedMachineId, setSelectedMachineId] = useState<string>("");
  const [clients, setClients] = useState<ClientUser[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [toast, setToast] = useState({ open: false, msg: "" });
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editSelectedMachineId, setEditSelectedMachineId] = useState<string>("");
  const [nomCouleurDemandee, setNomCouleurDemandee] = useState("");
  const [nomCouleurEnvoyee, setNomCouleurEnvoyee] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [machineCodeMap, setMachineCodeMap] = useState<Record<string, string>>({});

  const [supportOptions, setSupportOptions] = useState(["etop", "bretelle", "elastique"]);
  const [compositionOptions, setCompositionOptions] = useState([
    "coton",
    "polyester",
    "polyamide",
    "viscose",
  ]);
  const [pantoneOptions, setPantoneOptions] = useState([
    "Pantone 100 C",
    "Pantone 185 C",
    "Pantone 286 C",
    "Pantone 355 C",
    "Pantone Black C",
  ]);

  const [form, setForm] = useState<TissuForm>({
    code: "",
    clientEmail: "",
    demande: {
      numeroDemande: "",
      client: "",
      support: "",
      referenceSupportClient: "",
      Recette: "",
      ColorantDemandee: "",
      Quantite: "",
      remarques: "",
      Composition: "",
      Process: "",
      Disignateur: "",
      couleurEnvoyee: "",
      StandardClient: "",
      Prix: "",
      dateReception: "",
      dateLancement: null,
      delai: null,
    },
    routeMachineIds: [],
  });

  const [editForm, setEditForm] = useState<TissuForm>({
    code: "",
    clientEmail: "",
    demande: {
      numeroDemande: "",
      client: "",
      support: "",
      referenceSupportClient: "",
      Recette: "",
      Composition: "",
      Process: "",
      Disignateur: "",
      couleurEnvoyee: "",
      StandardClient: "",
      Prix: "",
      ColorantDemandee: "",
      Quantite: "",
      remarques: "",
      dateReception: "",
      dateLancement: null,
      delai: null,
    },
    routeMachineIds: [],
  });

  const colorNames: Record<string, { r: number; g: number; b: number }> = {
    rouge: { r: 255, g: 0, b: 0 },
    vert: { r: 0, g: 128, b: 0 },
    bleu: { r: 0, g: 0, b: 255 },
    noir: { r: 0, g: 0, b: 0 },
    blanc: { r: 255, g: 255, b: 255 },
    jaune: { r: 255, g: 255, b: 0 },
    orange: { r: 255, g: 165, b: 0 },
    rose: { r: 255, g: 192, b: 203 },
    violet: { r: 128, g: 0, b: 128 },
    gris: { r: 128, g: 128, b: 128 },
    beige: { r: 245, g: 245, b: 220 },
    marron: { r: 139, g: 69, b: 19 },
  };

  const rgbToText = (r: number, g: number, b: number) => `rgb(${r},${g},${b})`;

  const findColorName = (r: number, g: number, b: number) => {
    const found = Object.entries(colorNames).find(
      ([, value]) => value.r === r && value.g === g && value.b === b
    );
    return found ? found[0] : "";
  };

  const getRgbFromText = (value: string) => {
    const match = (value || "").match(/rgb\((\d+),(\d+),(\d+)\)/);
    if (!match) return { r: 255, g: 255, b: 255 };

    return {
      r: Number(match[1]),
      g: Number(match[2]),
      b: Number(match[3]),
    };
  };

  const addOptionIfNew = (
    value: string,
    options: string[],
    setOptions: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const v = value.trim();
    if (!v) return;

    const exists = options.some((op) => op.toLowerCase() === v.toLowerCase());
    if (!exists) setOptions([...options, v]);
  };

  const addPantoneIfNew = (value: string) => {
    const v = value.trim();
    if (!v) return;

    const exists = pantoneOptions.some((p) => p.toLowerCase() === v.toLowerCase());
    if (!exists) setPantoneOptions([...pantoneOptions, v]);
  };

  const getNextNumeroDemande = () => {
    const lastNumber = Number(localStorage.getItem("lastNumeroDemande") || "1000");
    return `D-${lastNumber + 1}`;
  };

  const confirmNumeroDemandeCreated = () => {
    const lastNumber = Number(localStorage.getItem("lastNumeroDemande") || "1000");
    localStorage.setItem("lastNumeroDemande", String(lastNumber + 1));
  };

  const loadMachineCodes = async () => {
    try {
      const data = await listMachines();
      const arr = Array.isArray(data) ? data : [];
      const map: Record<string, string> = {};

      arr.forEach((m: any) => {
        if (m?.id) map[m.id] = m.code || m.nom || "--";
      });

      setMachineCodeMap(map);
    } catch (e) {
      console.error("Erreur chargement machines", e);
    }
  };

  const load = async () => {
    const data = await listTissus(q.trim() ? q.trim() : undefined);
    setItems(data);
  };

  const loadMachines = async () => {
    const ms = await listMachines();
    setMachines(ms);
  };

  useEffect(() => {
    loadMachineCodes();
    loadMachines();
  }, []);

  useEffect(() => {
    listClients().then(setClients).catch((err) => console.error("Erreur chargement clients", err));
  }, []);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [q]);

  const openDetails = async (t: any) => {
    setSelected(t);
    const d = await getTissuDetails(t.id);
    setDetails(d);
  };

  const handleDownloadQr = async (id: string) => {
    try {
      const blob = await downloadTissuQr(id);
      await downloadBlob(blob, `qr-${id}.png`);
    } catch (e) {
      console.error("Erreur QR =", e);
      setToast({ open: true, msg: "Erreur téléchargement QR" });
    }
  };

  const handleDownloadPdf = async (id: string) => {
    try {
      const blob = await generateDemandePdf(id);
      await downloadBlob(blob, `demande-${id}.pdf`);
    } catch (e) {
      console.error("Erreur PDF =", e);
      setToast({ open: true, msg: "Erreur téléchargement PDF" });
    }
  };

  const onCreate = async () => {
    try {
      if (!form.code.trim()) return setToast({ open: true, msg: "Code Article obligatoire" });
      if (!form.demande.client.trim()) return setToast({ open: true, msg: "Client obligatoire" });
      if (form.routeMachineIds.length === 0)
        return setToast({ open: true, msg: "Workflow machines obligatoire" });

      const numeroAuto = getNextNumeroDemande();
      const dataToSend = {
        ...form,
        demande: {
          ...form.demande,
          numeroDemande: numeroAuto,
        },
      };

      await createTissu(dataToSend, file);
      confirmNumeroDemandeCreated();

      setToast({ open: true, msg: "✅ Article ajouté (statut EN_STOCK)" });
      setAddOpen(false);
      setFile(null);
      setNomCouleurDemandee("");
      setNomCouleurEnvoyee("");

      setForm({
        code: "",
        clientEmail: "",
        demande: {
          numeroDemande: "",
          client: "",
          support: "",
          referenceSupportClient: "",
          Recette: "",
          ColorantDemandee: "",
          Quantite: "",
          Composition: "",
          Process: "",
          Disignateur: "",
          couleurEnvoyee: "",
          StandardClient: "",
          Prix: "",
          remarques: "",
          dateReception: "",
          dateLancement: null,
          delai: null,
        },
        routeMachineIds: [],
      });

      load();
    } catch (e: any) {
      setToast({ open: true, msg: e?.response?.data || "❌ Erreur ajout Article" });
    }
  };

  const openEditModal = async (t: any) => {
    setEditId(t.id);
    const d = await getTissuDetails(t.id);
    const tissu = d?.tissu ?? d;

    setEditForm({
      code: tissu?.code ?? t.code ?? "",
      clientEmail: tissu?.clientEmail ?? t.clientEmail ?? "",
      demande: {
        numeroDemande: tissu?.demande?.numeroDemande ?? "",
        client: tissu?.demande?.client ?? "",
        support: tissu?.demande?.support ?? "",
        referenceSupportClient: tissu?.demande?.referenceSupportClient ?? "",
        Recette: tissu?.demande?.codeRecette ?? tissu?.demande?.Recette ?? "",
        ColorantDemandee: tissu?.demande?.typeColorant ?? tissu?.demande?.ColorantDemandee ?? "",
        Quantite: tissu?.demande?.dimensions ?? tissu?.demande?.Quantite ?? "",
        remarques: tissu?.demande?.remarques ?? "",
        Composition: tissu?.demande?.Composition ?? "",
        Process: tissu?.demande?.Process ?? "",
        Disignateur: tissu?.demande?.Disignateur ?? "",
        couleurEnvoyee: tissu?.demande?.couleurEnvoyee ?? "",
        StandardClient: tissu?.demande?.StandardClient ?? "",
        Prix: tissu?.demande?.Prix ?? "",
        dateReception: tissu?.demande?.dateReception ?? "",
        dateLancement: tissu?.demande?.dateLancement ?? null,
        delai: tissu?.demande?.delai ?? null,
      },
      routeMachineIds: tissu?.routeMachineIds ?? tissu?.routeMachine?.map((m: any) => m.id) ?? [],
    });

    const rgbEnv = getRgbFromText(tissu?.demande?.couleurEnvoyee ?? "");
    const rgbDem = getRgbFromText(tissu?.demande?.ColorantDemandee ?? tissu?.demande?.typeColorant ?? "");
    setNomCouleurEnvoyee(findColorName(rgbEnv.r, rgbEnv.g, rgbEnv.b));
    setNomCouleurDemandee(findColorName(rgbDem.r, rgbDem.g, rgbDem.b));

    setEditFile(null);
    setEditSelectedMachineId("");
    setEditOpen(true);
  };

  const getClientLabel = (c: ClientUser) => `${c.nom} ${c.prenom} - ${c.email}`;
  const clientOptions = clients.map(getClientLabel);

  const getMachineLabel = (m: any) => `${m.code} - ${m.nom}`;
  const machineOptions = machines.map(getMachineLabel);

  const addMachineToRoute = (machineLabel: string) => {
    const machine = machines.find((m) => getMachineLabel(m) === machineLabel);
    if (!machine?.id) return;
    if (form.routeMachineIds.includes(machine.id)) return;

    setForm({
      ...form,
      routeMachineIds: [...form.routeMachineIds, machine.id],
    });

    setSelectedMachineId("");
  };

  const addEditMachineToRoute = (machineLabel: string) => {
    const machine = machines.find((m) => getMachineLabel(m) === machineLabel);
    if (!machine?.id) return;
    if (editForm.routeMachineIds.includes(machine.id)) return;

    setEditForm({
      ...editForm,
      routeMachineIds: [...editForm.routeMachineIds, machine.id],
    });

    setEditSelectedMachineId("");
  };

  const onUpdate = async () => {
    try {
      if (!editId) return;
      if (!editForm.code.trim()) return setToast({ open: true, msg: "Code Article obligatoire" });
      if (!editForm.demande.numeroDemande.trim())
        return setToast({ open: true, msg: "N° Demande obligatoire" });
      if (!editForm.demande.client.trim()) return setToast({ open: true, msg: "Client obligatoire" });
      if (editForm.routeMachineIds.length === 0)
        return setToast({ open: true, msg: "Workflow machines obligatoire" });

      await updateTissu(editId, editForm, editFile);
      setToast({ open: true, msg: "✅ Article mis à jour" });
      setEditOpen(false);
      setEditId(null);
      setEditFile(null);
      load();
    } catch (e: any) {
      setToast({ open: true, msg: e?.response?.data || "❌ Erreur update Article" });
    }
  };

  return (
    <IonPage>
      <IonContent className="page-bg">
        <TopMenu title="🧵 Articles" />

        <div className="container">
          <div className="top-row">
            <IonSearchbar
              value={q}
              onIonChange={(e) => setQ(e.detail.value!)}
              placeholder="Rechercher un Article..."
            />
            <IonButton className="btn-main" onClick={() => setAddOpen(true)}>
              <IonIcon icon={addOutline} slot="start" />
              Ajouter
            </IonButton>
          </div>

          {items.map((t) => (
            <div key={t.id} className="card card-tissu" onClick={() => openDetails(t)}>
              <IonButton
                className="tissu-edit-btn"
                fill="clear"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(t);
                }}
              >
                <IonIcon icon={createOutline} />
              </IonButton>

              <div className="card-title">{t.code}</div>
              <div
                className={`badge ${
                  t.statut === "LIVRE"
                    ? "badge-ok"
                    : t.statut === "EN_TRAITEMENT"
                    ? "badge-warn"
                    : "badge-stock"
                }`}
              >
                {t.statut === "LIVRE"
                  ? "Livré"
                  : t.statut === "EN_TRAITEMENT"
                  ? "En traitement"
                  : "En stock"}
              </div>
            </div>
          ))}
        </div>

        <IonModal isOpen={addOpen} onDidDismiss={() => setAddOpen(false)} className="date-modal">
          <IonContent className="date-modal-content">
            <div className="modal-head">
              <h3>Ajouter un Article</h3>
              <IonButton fill="clear" onClick={() => setAddOpen(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </div>

            <div className="field">
              <label className="label">Code Article</label>
              <IonInput
                className="input-plain"
                value={form.code}
                placeholder="T-001"
                onIonInput={(e) => setForm({ ...form, code: String(e.detail.value ?? "") })}
              />
            </div>

            <div className="field">
              <label className="label">Date réception</label>
              <IonInput
                className="input-plain"
                type="date"
                value={form.demande.dateReception}
                onIonInput={(e) =>
                  setForm({
                    ...form,
                    demande: { ...form.demande, dateReception: String(e.detail.value ?? "") },
                  })
                }
              />
            </div>

            <div className="field">
              <label className="label">Support</label>
              <ComboBox
                value={form.demande.support}
                options={supportOptions}
                placeholder="Choisir ou saisir un support"
                onChange={(value) =>
                  setForm({ ...form, demande: { ...form.demande, support: value } })
                }
                onAddNew={(value) => addOptionIfNew(value, supportOptions, setSupportOptions)}
              />
            </div>

            <div className="field">
              <label className="label">Composition</label>
              <ComboBox
                value={form.demande.Composition}
                options={compositionOptions}
                placeholder="Choisir ou saisir une composition"
                onChange={(value) =>
                  setForm({ ...form, demande: { ...form.demande, Composition: value } })
                }
                onAddNew={(value) => addOptionIfNew(value, compositionOptions, setCompositionOptions)}
              />
            </div>

            <div className="field">
              <label className="label">Process</label>
              <IonInput
                className="input-plain"
                placeholder="Process"
                value={form.demande.Process}
                onIonInput={(e) =>
                  setForm({
                    ...form,
                    demande: { ...form.demande, Process: String(e.detail.value ?? "") },
                  })
                }
              />
            </div>

            <div className="field">
              <label className="label">N° Demande</label>
              <IonInput
                className="input-plain"
                value={form.demande.numeroDemande}
                placeholder={getNextNumeroDemande()}
                readonly
              />
            </div>

            <div className="field">
              <label className="label">Disignation</label>
              <IonInput
                className="input-plain"
                placeholder="Disignation"
                value={form.demande.Disignateur}
                onIonInput={(e) =>
                  setForm({
                    ...form,
                    demande: { ...form.demande, Disignateur: String(e.detail.value ?? "") },
                  })
                }
              />
            </div>

            <div className="field">
              <label className="label">Client</label>
              <ComboBox
                value={form.demande.client ? `${form.demande.client} - ${form.clientEmail}` : ""}
                options={clientOptions}
                placeholder="Choisir un client"
                onChange={(value) => {
                  const client = clients.find((c) => getClientLabel(c) === value);

                  if (client) {
                    setForm({
                      ...form,
                      clientEmail: client.email,
                      demande: {
                        ...form.demande,
                        client: `${client.nom} ${client.prenom}`,
                      },
                    });
                  }
                }}
              />
            </div>

            <IonInput className="input-plain" value={form.clientEmail} placeholder="Email client" readonly />

            <div className="field">
              <label className="label">Référence support client</label>
              <IonInput
                className="input-plain"
                value={form.demande.referenceSupportClient}
                placeholder="REF-CL-001"
                onIonInput={(e) =>
                  setForm({
                    ...form,
                    demande: {
                      ...form.demande,
                      referenceSupportClient: String(e.detail.value ?? ""),
                    },
                  })
                }
              />
            </div>

            <div className="field">
              <label className="label">Couleur Envoyée</label>
              {(() => {
                const rgb = getRgbFromText(form.demande.couleurEnvoyee);
                return (
                  <>
                    <ComboBox
                      value={nomCouleurEnvoyee}
                      options={Object.keys(colorNames)}
                      placeholder="Nom couleur : rouge, bleu, beige..."
                      onChange={(value) => {
                        setNomCouleurEnvoyee(value);
                        const key = value.toLowerCase().trim();
                        if (colorNames[key]) {
                          const c = colorNames[key];
                          setForm({
                            ...form,
                            demande: {
                              ...form.demande,
                              couleurEnvoyee: rgbToText(c.r, c.g, c.b),
                            },
                          });
                        }
                      }}
                    />

                    <div className="rgb-row">
                      <input
                        className="rgb-input"
                        type="number"
                        min="0"
                        max="255"
                        placeholder="R"
                        value={rgb.r}
                        onChange={(e) => {
                          const r = Number(e.target.value);
                          const name = findColorName(r, rgb.g, rgb.b);
                          setNomCouleurEnvoyee(name);
                          setForm({
                            ...form,
                            demande: {
                              ...form.demande,
                              couleurEnvoyee: rgbToText(r, rgb.g, rgb.b),
                            },
                          });
                        }}
                      />
                      <input
                        className="rgb-input"
                        type="number"
                        min="0"
                        max="255"
                        placeholder="G"
                        value={rgb.g}
                        onChange={(e) => {
                          const g = Number(e.target.value);
                          const name = findColorName(rgb.r, g, rgb.b);
                          setNomCouleurEnvoyee(name);
                          setForm({
                            ...form,
                            demande: {
                              ...form.demande,
                              couleurEnvoyee: rgbToText(rgb.r, g, rgb.b),
                            },
                          });
                        }}
                      />
                      <input
                        className="rgb-input"
                        type="number"
                        min="0"
                        max="255"
                        placeholder="B"
                        value={rgb.b}
                        onChange={(e) => {
                          const b = Number(e.target.value);
                          const name = findColorName(rgb.r, rgb.g, b);
                          setNomCouleurEnvoyee(name);
                          setForm({
                            ...form,
                            demande: {
                              ...form.demande,
                              couleurEnvoyee: rgbToText(rgb.r, rgb.g, b),
                            },
                          });
                        }}
                      />
                      <div className="color-preview" style={{ background: form.demande.couleurEnvoyee }} />
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="field">
              <label className="label">Couleur Demandée</label>
              {(() => {
                const rgb = getRgbFromText(form.demande.ColorantDemandee);
                return (
                  <>
                    <ComboBox
                      value={nomCouleurDemandee}
                      options={Object.keys(colorNames)}
                      placeholder="Nom couleur : rouge, bleu, beige..."
                      onChange={(value) => {
                        setNomCouleurDemandee(value);
                        const key = value.toLowerCase().trim();
                        if (colorNames[key]) {
                          const c = colorNames[key];
                          setForm({
                            ...form,
                            demande: {
                              ...form.demande,
                              ColorantDemandee: rgbToText(c.r, c.g, c.b),
                            },
                          });
                        }
                      }}
                    />

                    <div className="rgb-row">
                      <input
                        className="rgb-input"
                        type="number"
                        min="0"
                        max="255"
                        placeholder="R"
                        value={rgb.r}
                        onChange={(e) => {
                          const r = Number(e.target.value);
                          const name = findColorName(r, rgb.g, rgb.b);
                          setNomCouleurDemandee(name);
                          setForm({
                            ...form,
                            demande: {
                              ...form.demande,
                              ColorantDemandee: rgbToText(r, rgb.g, rgb.b),
                            },
                          });
                        }}
                      />
                      <input
                        className="rgb-input"
                        type="number"
                        min="0"
                        max="255"
                        placeholder="G"
                        value={rgb.g}
                        onChange={(e) => {
                          const g = Number(e.target.value);
                          const name = findColorName(rgb.r, g, rgb.b);
                          setNomCouleurDemandee(name);
                          setForm({
                            ...form,
                            demande: {
                              ...form.demande,
                              ColorantDemandee: rgbToText(rgb.r, g, rgb.b),
                            },
                          });
                        }}
                      />
                      <input
                        className="rgb-input"
                        type="number"
                        min="0"
                        max="255"
                        placeholder="B"
                        value={rgb.b}
                        onChange={(e) => {
                          const b = Number(e.target.value);
                          const name = findColorName(rgb.r, rgb.g, b);
                          setNomCouleurDemandee(name);
                          setForm({
                            ...form,
                            demande: {
                              ...form.demande,
                              ColorantDemandee: rgbToText(rgb.r, rgb.g, b),
                            },
                          });
                        }}
                      />
                      <div className="color-preview" style={{ background: form.demande.ColorantDemandee }} />
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="field">
              <label className="label">Standard Client</label>
              <ComboBox
                value={form.demande.StandardClient}
                options={pantoneOptions}
                placeholder="Ex: Pantone 185 C"
                onChange={(value) =>
                  setForm({ ...form, demande: { ...form.demande, StandardClient: value } })
                }
                onAddNew={(value) => addPantoneIfNew(value)}
              />
            </div>

            <div className="field">
              <label className="label">Recette</label>
              <IonInput
                className="input-plain"
                value={form.demande.Recette}
                placeholder="recette"
                onIonInput={(e) =>
                  setForm({ ...form, demande: { ...form.demande, Recette: String(e.detail.value ?? "") } })
                }
              />
            </div>

            <div className="field">
              <label className="label">Quantite</label>
              <IonInput
                className="input-plain"
                value={form.demande.Quantite}
                placeholder="20k"
                onIonInput={(e) =>
                  setForm({ ...form, demande: { ...form.demande, Quantite: String(e.detail.value ?? "") } })
                }
              />
            </div>

            <div className="field">
              <label className="label">Prix</label>
              <IonInput
                className="input-plain"
                value={form.demande.Prix}
                placeholder="5500DT"
                onIonInput={(e) =>
                  setForm({ ...form, demande: { ...form.demande, Prix: String(e.detail.value ?? "") } })
                }
              />
            </div>

            <div className="field">
              <label className="label">Remarques</label>
              <IonInput
                className="input-plain"
                value={form.demande.remarques}
                placeholder="votre remarques"
                onIonInput={(e) =>
                  setForm({ ...form, demande: { ...form.demande, remarques: String(e.detail.value ?? "") } })
                }
              />
            </div>

            <div className="field">
              <label className="label">Workflow machines (ordre)</label>
              <ComboBox
                value={selectedMachineId}
                options={machineOptions}
                placeholder="Choisir une machine"
                onChange={(value) => setSelectedMachineId(value)}
              />

              <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                <IonButton
                  className="go-btn"
                  fill="outline"
                  disabled={!selectedMachineId}
                  onClick={() => addMachineToRoute(selectedMachineId)}
                >
                  Ajouter à la route
                </IonButton>
              </div>

              <div style={{ marginTop: 12 }}>
                {form.routeMachineIds.length === 0 ? (
                  <div className="muted">Aucune machine dans le workflow.</div>
                ) : (
                  form.routeMachineIds.map((mid, idx) => {
                    const m = machines.find((x) => x.id === mid);
                    return (
                      <div key={mid} className="erp-card" style={{ marginBottom: 10, cursor: "default" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <b>Étape {idx + 1}</b> — {m ? `${m.code} - ${m.nom}` : mid}
                          </div>
                          <div className="route-actions" style={{ display: "flex", gap: 8 }}>
                            <IonButton
                              fill="clear"
                              disabled={idx === 0}
                              onClick={() => {
                                const arr = [...form.routeMachineIds];
                                [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                                setForm({ ...form, routeMachineIds: arr });
                              }}
                            >
                              ↑
                            </IonButton>
                            <IonButton
                              fill="clear"
                              disabled={idx === form.routeMachineIds.length - 1}
                              onClick={() => {
                                const arr = [...form.routeMachineIds];
                                [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
                                setForm({ ...form, routeMachineIds: arr });
                              }}
                            >
                              ↓
                            </IonButton>
                            <IonButton
                              fill="clear"
                              onClick={() => {
                                const arr = form.routeMachineIds.filter((x) => x !== mid);
                                setForm({ ...form, routeMachineIds: arr });
                              }}
                            >
                              Supprimer
                            </IonButton>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="field">
              <label className="label">Fichier demande (optionnel)</label>
              <input type="file" className="input-plain" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>

            <div className="row">
              <IonButton className="go-btn" fill="outline" onClick={onCreate}>
                Ajouter
              </IonButton>
            </div>
          </IonContent>
        </IonModal>

        <IonModal isOpen={editOpen} onDidDismiss={() => setEditOpen(false)} className="date-modal">
          <IonContent className="date-modal-content">
            <div className="modal-head">
              <h3>Modifier un Article</h3>
              <IonButton fill="clear" onClick={() => setEditOpen(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </div>

            <div className="field">
              <label className="label">Code Article</label>
              <IonInput
                className="input-plain"
                value={editForm.code}
                placeholder="T-001"
                onIonInput={(e) => setEditForm({ ...editForm, code: String(e.detail.value ?? "") })}
              />
            </div>

            <div className="field">
              <label className="label">Date réception</label>
              <IonInput
                className="input-plain"
                type="date"
                value={editForm.demande.dateReception}
                onIonInput={(e) =>
                  setEditForm({
                    ...editForm,
                    demande: { ...editForm.demande, dateReception: String(e.detail.value ?? "") },
                  })
                }
              />
            </div>

            <div className="field">
              <label className="label">Support</label>
              <ComboBox
                value={editForm.demande.support}
                options={supportOptions}
                placeholder="Choisir ou saisir un support"
                onChange={(value) =>
                  setEditForm({ ...editForm, demande: { ...editForm.demande, support: value } })
                }
                onAddNew={(value) => addOptionIfNew(value, supportOptions, setSupportOptions)}
              />
            </div>

            <div className="field">
              <label className="label">Composition</label>
              <ComboBox
                value={editForm.demande.Composition}
                options={compositionOptions}
                placeholder="Choisir ou saisir une composition"
                onChange={(value) =>
                  setEditForm({ ...editForm, demande: { ...editForm.demande, Composition: value } })
                }
                onAddNew={(value) => addOptionIfNew(value, compositionOptions, setCompositionOptions)}
              />
            </div>

            <div className="field">
              <label className="label">Process</label>
              <IonInput
                className="input-plain"
                value={editForm.demande.Process}
                placeholder="Process"
                onIonInput={(e) =>
                  setEditForm({
                    ...editForm,
                    demande: { ...editForm.demande, Process: String(e.detail.value ?? "") },
                  })
                }
              />
            </div>

            <div className="field">
              <label className="label">N° Demande</label>
              <IonInput
                className="input-plain"
                value={editForm.demande.numeroDemande}
                placeholder="D-100"
                onIonInput={(e) =>
                  setEditForm({
                    ...editForm,
                    demande: { ...editForm.demande, numeroDemande: String(e.detail.value ?? "") },
                  })
                }
              />
            </div>

            <div className="field">
              <label className="label">Disignation</label>
              <IonInput
                className="input-plain"
                value={editForm.demande.Disignateur}
                placeholder="Disignation"
                onIonInput={(e) =>
                  setEditForm({
                    ...editForm,
                    demande: { ...editForm.demande, Disignateur: String(e.detail.value ?? "") },
                  })
                }
              />
            </div>

            <div className="field">
              <label className="label">Client</label>
              <ComboBox
                value={editForm.demande.client ? `${editForm.demande.client} - ${editForm.clientEmail}` : ""}
                options={clientOptions}
                placeholder="Choisir un client"
                onChange={(value) => {
                  const client = clients.find((c) => getClientLabel(c) === value);

                  if (client) {
                    setEditForm({
                      ...editForm,
                      clientEmail: client.email,
                      demande: {
                        ...editForm.demande,
                        client: `${client.nom} ${client.prenom}`,
                      },
                    });
                  }
                }}
              />
            </div>

            <IonInput className="input-plain" value={editForm.clientEmail} placeholder="Email client" readonly />

            <div className="field">
              <label className="label">Référence support client</label>
              <IonInput
                className="input-plain"
                value={editForm.demande.referenceSupportClient}
                placeholder="REF-CL-001"
                onIonInput={(e) =>
                  setEditForm({
                    ...editForm,
                    demande: {
                      ...editForm.demande,
                      referenceSupportClient: String(e.detail.value ?? ""),
                    },
                  })
                }
              />
            </div>

            <div className="field">
              <label className="label">Couleur Envoyée</label>
              {(() => {
                const rgb = getRgbFromText(editForm.demande.couleurEnvoyee);
                return (
                  <>
                    <ComboBox
                      value={nomCouleurEnvoyee}
                      options={Object.keys(colorNames)}
                      placeholder="Nom couleur : rouge, bleu, beige..."
                      onChange={(value) => {
                        setNomCouleurEnvoyee(value);
                        const key = value.toLowerCase().trim();
                        if (colorNames[key]) {
                          const c = colorNames[key];
                          setEditForm({
                            ...editForm,
                            demande: {
                              ...editForm.demande,
                              couleurEnvoyee: rgbToText(c.r, c.g, c.b),
                            },
                          });
                        }
                      }}
                    />

                    <div className="rgb-row">
                      <input
                        className="rgb-input"
                        type="number"
                        min="0"
                        max="255"
                        placeholder="R"
                        value={rgb.r}
                        onChange={(e) => {
                          const r = Number(e.target.value);
                          setNomCouleurEnvoyee(findColorName(r, rgb.g, rgb.b));
                          setEditForm({
                            ...editForm,
                            demande: {
                              ...editForm.demande,
                              couleurEnvoyee: rgbToText(r, rgb.g, rgb.b),
                            },
                          });
                        }}
                      />
                      <input
                        className="rgb-input"
                        type="number"
                        min="0"
                        max="255"
                        placeholder="G"
                        value={rgb.g}
                        onChange={(e) => {
                          const g = Number(e.target.value);
                          setNomCouleurEnvoyee(findColorName(rgb.r, g, rgb.b));
                          setEditForm({
                            ...editForm,
                            demande: {
                              ...editForm.demande,
                              couleurEnvoyee: rgbToText(rgb.r, g, rgb.b),
                            },
                          });
                        }}
                      />
                      <input
                        className="rgb-input"
                        type="number"
                        min="0"
                        max="255"
                        placeholder="B"
                        value={rgb.b}
                        onChange={(e) => {
                          const b = Number(e.target.value);
                          setNomCouleurEnvoyee(findColorName(rgb.r, rgb.g, b));
                          setEditForm({
                            ...editForm,
                            demande: {
                              ...editForm.demande,
                              couleurEnvoyee: rgbToText(rgb.r, rgb.g, b),
                            },
                          });
                        }}
                      />
                      <div className="color-preview" style={{ background: editForm.demande.couleurEnvoyee }} />
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="field">
              <label className="label">Couleur Demandée</label>
              {(() => {
                const rgb = getRgbFromText(editForm.demande.ColorantDemandee);
                return (
                  <>
                    <ComboBox
                      value={nomCouleurDemandee}
                      options={Object.keys(colorNames)}
                      placeholder="Nom couleur : rouge, bleu, beige..."
                      onChange={(value) => {
                        setNomCouleurDemandee(value);
                        const key = value.toLowerCase().trim();
                        if (colorNames[key]) {
                          const c = colorNames[key];
                          setEditForm({
                            ...editForm,
                            demande: {
                              ...editForm.demande,
                              ColorantDemandee: rgbToText(c.r, c.g, c.b),
                            },
                          });
                        }
                      }}
                    />

                    <div className="rgb-row">
                      <input
                        className="rgb-input"
                        type="number"
                        min="0"
                        max="255"
                        placeholder="R"
                        value={rgb.r}
                        onChange={(e) => {
                          const r = Number(e.target.value);
                          setNomCouleurDemandee(findColorName(r, rgb.g, rgb.b));
                          setEditForm({
                            ...editForm,
                            demande: {
                              ...editForm.demande,
                              ColorantDemandee: rgbToText(r, rgb.g, rgb.b),
                            },
                          });
                        }}
                      />
                      <input
                        className="rgb-input"
                        type="number"
                        min="0"
                        max="255"
                        placeholder="G"
                        value={rgb.g}
                        onChange={(e) => {
                          const g = Number(e.target.value);
                          setNomCouleurDemandee(findColorName(rgb.r, g, rgb.b));
                          setEditForm({
                            ...editForm,
                            demande: {
                              ...editForm.demande,
                              ColorantDemandee: rgbToText(rgb.r, g, rgb.b),
                            },
                          });
                        }}
                      />
                      <input
                        className="rgb-input"
                        type="number"
                        min="0"
                        max="255"
                        placeholder="B"
                        value={rgb.b}
                        onChange={(e) => {
                          const b = Number(e.target.value);
                          setNomCouleurDemandee(findColorName(rgb.r, rgb.g, b));
                          setEditForm({
                            ...editForm,
                            demande: {
                              ...editForm.demande,
                              ColorantDemandee: rgbToText(rgb.r, rgb.g, b),
                            },
                          });
                        }}
                      />
                      <div className="color-preview" style={{ background: editForm.demande.ColorantDemandee }} />
                    </div>
                  </>
                );
              })()}
            </div>

            <div className="field">
              <label className="label">Standard Client</label>
              <ComboBox
                value={editForm.demande.StandardClient}
                options={pantoneOptions}
                placeholder="Ex: Pantone 185 C"
                onChange={(value) =>
                  setEditForm({ ...editForm, demande: { ...editForm.demande, StandardClient: value } })
                }
                onAddNew={(value) => addPantoneIfNew(value)}
              />
            </div>

            <div className="field">
              <label className="label">Recette</label>
              <IonInput
                className="input-plain"
                value={editForm.demande.Recette}
                placeholder="RC-2026-01"
                onIonInput={(e) =>
                  setEditForm({
                    ...editForm,
                    demande: { ...editForm.demande, Recette: String(e.detail.value ?? "") },
                  })
                }
              />
            </div>

            <div className="field">
              <label className="label">Quantite</label>
              <IonInput
                className="input-plain"
                value={editForm.demande.Quantite}
                placeholder="20k"
                onIonInput={(e) =>
                  setEditForm({
                    ...editForm,
                    demande: { ...editForm.demande, Quantite: String(e.detail.value ?? "") },
                  })
                }
              />
            </div>

            <div className="field">
              <label className="label">Prix</label>
              <IonInput
                className="input-plain"
                value={editForm.demande.Prix}
                placeholder="500DT"
                onIonInput={(e) =>
                  setEditForm({
                    ...editForm,
                    demande: { ...editForm.demande, Prix: String(e.detail.value ?? "") },
                  })
                }
              />
            </div>

            <div className="field">
              <label className="label">remarques</label>
              <IonInput
                className="input-plain"
                value={editForm.demande.remarques}
                placeholder="remarques"
                onIonInput={(e) =>
                  setEditForm({
                    ...editForm,
                    demande: { ...editForm.demande, remarques: String(e.detail.value ?? "") },
                  })
                }
              />
            </div>

            <div className="field">
              <label className="label">Workflow machines (ordre)</label>
              <ComboBox
                value={editSelectedMachineId}
                options={machineOptions}
                placeholder="Choisir une machine"
                onChange={(value) => setEditSelectedMachineId(value)}
              />

              <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
                <IonButton
                  className="go-btn"
                  fill="outline"
                  disabled={!editSelectedMachineId}
                  onClick={() => addEditMachineToRoute(editSelectedMachineId)}
                >
                  Ajouter à la route
                </IonButton>
              </div>

              <div style={{ marginTop: 12 }}>
                {editForm.routeMachineIds.length === 0 ? (
                  <div className="muted">Aucune machine dans le workflow.</div>
                ) : (
                  editForm.routeMachineIds.map((mid, idx) => {
                    const m = machines.find((x) => x.id === mid);
                    return (
                      <div key={mid} className="erp-card" style={{ marginBottom: 10, cursor: "default" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <b>Étape {idx + 1}</b> — {m ? `${m.code} - ${m.nom}` : mid}
                          </div>
                          <div className="route-actions" style={{ display: "flex", gap: 8 }}>
                            <IonButton
                              fill="clear"
                              disabled={idx === 0}
                              onClick={() => {
                                const arr = [...editForm.routeMachineIds];
                                [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
                                setEditForm({ ...editForm, routeMachineIds: arr });
                              }}
                            >
                              ↑
                            </IonButton>
                            <IonButton
                              fill="clear"
                              disabled={idx === editForm.routeMachineIds.length - 1}
                              onClick={() => {
                                const arr = [...editForm.routeMachineIds];
                                [arr[idx + 1], arr[idx]] = [arr[idx], arr[idx + 1]];
                                setEditForm({ ...editForm, routeMachineIds: arr });
                              }}
                            >
                              ↓
                            </IonButton>
                            <IonButton
                              fill="clear"
                              onClick={() => {
                                const arr = editForm.routeMachineIds.filter((x) => x !== mid);
                                setEditForm({ ...editForm, routeMachineIds: arr });
                              }}
                            >
                              Supprimer
                            </IonButton>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="field">
              <label className="label">Remplacer fichier demande (optionnel)</label>
              <input type="file" className="input-plain" onChange={(e) => setEditFile(e.target.files?.[0] || null)} />
            </div>

            <div className="row">
              <IonButton className="go-btn" fill="outline" onClick={() => setConfirmUpdateOpen(true)}>
                Mettre à jour
              </IonButton>
            </div>
          </IonContent>
        </IonModal>

        <IonModal
          isOpen={confirmUpdateOpen}
          onDidDismiss={() => setConfirmUpdateOpen(false)}
          className="confirm-update-modal"
        >
          <div className="confirm-modal">
            <div className="modal-head">
              <h3>Confirmation</h3>
              <IonButton fill="clear" onClick={() => setConfirmUpdateOpen(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </div>
            <div className="confirm-body">
              <p>Voulez-vous enregistrer les modifications ?</p>
            </div>
            <div className="confirm-actions">
              <IonButton className="btn-cancel" fill="outline" onClick={() => setConfirmUpdateOpen(false)}>
                Annuler
              </IonButton>
              <IonButton
                className="btn-confirm"
                onClick={async () => {
                  setConfirmUpdateOpen(false);
                  await onUpdate();
                }}
              >
                Oui, enregistrer
              </IonButton>
            </div>
          </div>
        </IonModal>

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
                    <div className="card-title">{selected.code}</div>
                    <div className="muted">
                      Statut: {selected.statut} <br />
                      Date lancement:{" "}
                      {selected.demande?.dateLancement
                        ? new Date(selected.demande.dateLancement).toLocaleString()
                        : "-"}
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-title">Téléchargements</div>
                    <div className="row">
                      <IonButton onClick={() => handleDownloadQr(selected.id)}>
                        <IonIcon icon={downloadOutline} slot="start" />
                        Télécharger QR
                      </IonButton>
                      <div className="field" style={{ marginTop: 10 }}>
                        <IonButton onClick={() => handleDownloadPdf(selected.id)}>
                          <IonIcon icon={downloadOutline} slot="start" />
                          Télécharger PDF (Demande)
                        </IonButton>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="card-title">Temps par machine</div>
                    {details?.secondsByMachine ? (
                      Object.entries(details.secondsByMachine).map(([mid, sec]: any) => (
                        <div key={mid} className="muted">
                          Machine {machineCodeMap[mid] || mid} : {Math.round(Number(sec) / 60)} min
                        </div>
                      ))
                    ) : (
                      <div className="muted">Aucune donnée</div>
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
