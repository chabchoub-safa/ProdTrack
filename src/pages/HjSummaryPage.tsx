
// import React, { useEffect, useMemo, useState } from "react";
// import {
//   IonPage,
//   IonContent,
//   IonSpinner,
//   IonSearchbar,
//   IonButton,
//   IonInput,
//   IonIcon,
// } from "@ionic/react";

// import {
//   addOutline,
//   refreshOutline,
//   trashOutline,
//   archiveOutline,
// } from "ionicons/icons";

// import {
//   listHjSummary,
//   HjSummaryRow,
//   listComplements,
//   createComplement,
//   ComplementOption,
//   softDeleteComplement,
//   getDeletedComplements,
//   restoreComplement,
// } from "../services/hjSummary.service";

// import "./HjSummaryPage.dark.css";
// import "./HjSummaryPage.light.css";
// import Menusec from "../components/Menusec";

// const HjSummaryPage: React.FC = () => {
//   const [rows, setRows] = useState<HjSummaryRow[]>([]);
//   const [complements, setComplements] = useState<ComplementOption[]>([]);
//   const [deletedComplements, setDeletedComplements] = useState<ComplementOption[]>([]);

//   const [newComplement, setNewComplement] = useState("");
//   const [deleteComplementName, setDeleteComplementName] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [q, setQ] = useState("");
//   const [showTrash, setShowTrash] = useState(false);

//   const load = async () => {
//     try {
//       setLoading(true);

//       const [summaryData, complementData] = await Promise.all([
//         listHjSummary(),
//         listComplements(),
//       ]);

//       setRows(summaryData);
//       setComplements(complementData);
//     } catch (e) {
//       console.error("Erreur chargement", e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadTrash = async () => {
//     try {
//       const data = await getDeletedComplements();
//       setDeletedComplements(data);
//       setShowTrash(true);
//     } catch (e) {
//       console.error("Erreur corbeille", e);
//     }
//   };

//   useEffect(() => {
//     load();
//   }, []);

//   const handleAddComplement = async () => {
//     const nom = newComplement.trim();

//     if (!nom) return;

//     try {
//       await createComplement(nom);
//       setNewComplement("");
//       await load();
//     } catch (e) {
//       console.error("Erreur ajout complément", e);
//     }
//   };

//   const normalizeText = (value: any) =>
//   String(value || "")
//     .trim()
//     .toLowerCase()
//     .normalize("NFD")
//     .replace(/[\u0300-\u036f]/g, "");

// const handleDeleteByName = async () => {
//   const nom = normalizeText(deleteComplementName);

//   if (!nom) return;

//   const comp = complements.find(
//     (c) => normalizeText(c.nom) === nom
//   );

//   if (!comp?.id) {
//     alert("Complément introuvable");
//     return;
//   }

//   try {
//     await softDeleteComplement(comp.id);
//     setDeleteComplementName("");
//     await load();
//   } catch (e) {
//     console.error("Erreur suppression complément", e);
//   }
// };

//   const handleRestore = async (id?: string) => {
//     if (!id) return;

//     try {
//       await restoreComplement(id);
//       await loadTrash();
//       await load();
//     } catch (e) {
//       console.error("Erreur restauration complément", e);
//     }
//   };

//   const complementNames = useMemo(() => {
//     const names = new Set<string>();

//     complements.forEach((c) => {
//   if (c.nom && c.nom.trim() !== "") {
//     names.add(c.nom.trim());
//   }
// });

//     rows.forEach((r) => {
//       Object.keys(r.valeurs || {}).forEach((k) => names.add(k));
//     });

//     return Array.from(names);
//   }, [complements, rows]);

//   const filtered = useMemo(() => {
//     const s = q.trim().toLowerCase();

//     if (!s) return rows;

//     return rows.filter(
//       (r) =>
//         r.cat.toLowerCase().includes(s) ||
//         r.nature.toLowerCase().includes(s)
//     );
//   }, [rows, q]);

//   const total = useMemo(() => {
//     const acc: Record<string, number> = {};

//     complementNames.forEach((name) => {
//       acc[name] = 0;
//     });

//     filtered.forEach((row) => {
//       complementNames.forEach((name) => {
//         acc[name] += row.valeurs?.[name] || 0;
//       });
//     });

//     return acc;
//   }, [filtered, complementNames]);

//   const formatCell = (value: number) => {
//     return !value || value === 0 ? "--" : value.toFixed(2);
//   };

//   return (
//     <IonPage>
//       <IonContent className="hj-page">
//         <Menusec title="H/J Par Person" />

//         <div className="hj-container">
//           <div className="hj-topbar">
//             <IonSearchbar
//               value={q}
//               onIonInput={(e) => setQ(e.detail.value || "")}
//               placeholder="Rechercher par CAT ou NATURE"
//               className="hj-search"
//             />

//             <IonInput
//               value={newComplement}
//               onIonInput={(e) => setNewComplement(e.detail.value || "")}
//               placeholder="Nouveau complément"
//               className="hj-complement-input"
//             />

//             <IonButton onClick={handleAddComplement} className="hj-btn-add">
//               <IonIcon icon={addOutline} />
//             </IonButton>

//             <IonInput
//               value={deleteComplementName}
//               onIonInput={(e) => setDeleteComplementName(e.detail.value || "")}
//               placeholder="Nom complément à supprimer"
//               className="hj-complement-input"
//             />

//             <IonButton color="danger" onClick={handleDeleteByName}>
//               <IonIcon icon={trashOutline} />
//             </IonButton>

//             <IonButton onClick={load}>
//               <IonIcon icon={refreshOutline} />
//             </IonButton>

//             <IonButton color="medium" onClick={loadTrash}>
//               <IonIcon icon={archiveOutline} />
//             </IonButton>
//           </div>

//           {showTrash && (
//             <div className="hj-trash-box">
//               <h3>Corbeille des compléments</h3>

//               {deletedComplements.length === 0 ? (
//                 <p>Aucun complément supprimé.</p>
//               ) : (
//                 deletedComplements.map((comp) => (
//                   <div key={comp.id} className="hj-trash-row">
//                     <span>{comp.nom}</span>

//                     <IonButton
//                       size="small"
//                       color="success"
//                       onClick={() => handleRestore(comp.id)}
//                     >
//                       Restaurer
//                     </IonButton>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}

//           {loading ? (
//             <div className="hj-loading">
//               <IonSpinner name="crescent" />
//             </div>
//           ) : (
//             <div className="hj-table-wrap">
//               <table className="hj-table">
//                 <thead>
//                   <tr>
//                     <th>CAT</th>
//                     <th>NATURE</th>

//                     {complementNames.map((name) => (
//                       <th key={name}>{name}</th>
//                     ))}
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {filtered.map((row, index) => (
//                     <tr key={`${row.cat}-${row.nature}-${index}`}>
//                       <td>{row.cat}</td>
//                       <td>{row.nature}</td>

//                       {complementNames.map((name) => (
//                         <td key={name}>
//                           {formatCell(row.valeurs?.[name] || 0)}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>

//                 <tfoot>
//                   <tr>
//                     <th colSpan={2}>TOTAL</th>

//                     {complementNames.map((name) => (
//                       <th key={name}>{formatCell(total[name] || 0)}</th>
//                     ))}
//                   </tr>
//                 </tfoot>
//               </table>
//             </div>
//           )}
//         </div>
//       </IonContent>
//     </IonPage>
//   );
// };

// export default HjSummaryPage;

import React, { useEffect, useMemo, useState } from "react";
import {
  IonPage,
  IonContent,
  IonSpinner,
  IonSearchbar,
  IonButton,
  IonInput,
  IonIcon,
} from "@ionic/react";

import {
  addOutline,
  refreshOutline,
  trashOutline,
  archiveOutline,
} from "ionicons/icons";

import {
  listHjSummary,
  HjSummaryRow,
  listComplements,
  createComplement,
  ComplementOption,
  softDeleteComplement,
  getDeletedComplements,
  restoreComplement,
} from "../services/hjSummary.service";

import "./HjSummaryPage.dark.css";
import "./HjSummaryPage.light.css";
import Menusec from "../components/Menusec";

const normalizeText = (value: any) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const HjSummaryPage: React.FC = () => {
  const [rows, setRows] = useState<HjSummaryRow[]>([]);
  const [complements, setComplements] = useState<ComplementOption[]>([]);
  const [deletedComplements, setDeletedComplements] = useState<ComplementOption[]>([]);

  const [newComplement, setNewComplement] = useState("");
  const [deleteComplementName, setDeleteComplementName] = useState("");
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [showTrash, setShowTrash] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [summaryData, complementData] = await Promise.all([
        listHjSummary(),
        listComplements(),
      ]);

      setRows(summaryData);
      setComplements(complementData.filter((c) => c.nom && c.nom.trim() !== ""));
    } catch (e) {
      console.error("Erreur chargement", e);
    } finally {
      setLoading(false);
    }
  };

  const loadTrash = async () => {
    try {
      const data = await getDeletedComplements();
      setDeletedComplements(data.filter((c) => c.nom && c.nom.trim() !== ""));
      setShowTrash(true);
    } catch (e) {
      console.error("Erreur corbeille", e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAddComplement = async () => {
    const nom = newComplement.trim();
    if (!nom) return;

    try {
      await createComplement(nom);
      setNewComplement("");
      await load();
    } catch (e) {
      console.error("Erreur ajout complément", e);
    }
  };

  const handleDeleteByName = async () => {
    const nom = normalizeText(deleteComplementName);
    if (!nom) return;

    const comp = complements.find((c) => normalizeText(c.nom) === nom);

    if (!comp?.id) {
      alert("Complément introuvable");
      return;
    }

    try {
      await softDeleteComplement(comp.id);

      setComplements((prev) => prev.filter((c) => c.id !== comp.id));
      setDeleteComplementName("");
      await loadTrash();
    } catch (e) {
      console.error("Erreur suppression complément", e);
    }
  };

  const handleRestore = async (id?: string) => {
    if (!id) return;

    try {
      await restoreComplement(id);
      await load();
      await loadTrash();
    } catch (e) {
      console.error("Erreur restauration complément", e);
    }
  };

  const complementNames = useMemo(() => {
    const names = new Set<string>();

    complements.forEach((c) => {
      if (c.nom && c.nom.trim() !== "") names.add(c.nom.trim());
    });

    return Array.from(names);
  }, [complements]);

  const filtered = useMemo(() => {
    const s = normalizeText(q);
    if (!s) return rows;

    return rows.filter(
      (r) =>
        normalizeText(r.cat).includes(s) ||
        normalizeText(r.nature).includes(s)
    );
  }, [rows, q]);

  const total = useMemo(() => {
    const acc: Record<string, number> = {};

    complementNames.forEach((name) => {
      acc[name] = 0;
    });

    filtered.forEach((row) => {
      complementNames.forEach((name) => {
        acc[name] += row.valeurs?.[name] || 0;
      });
    });

    return acc;
  }, [filtered, complementNames]);

  const formatCell = (value: number) => {
    return !value || value === 0 ? "--" : value.toFixed(2);
  };

  return (
    <IonPage>
      <IonContent className="hj-page">
        <Menusec title="H/J Par Person" />

        <div className="hj-container">
          <div className="hj-topbar">
            <IonSearchbar
              value={q}
              onIonInput={(e) => setQ(e.detail.value || "")}
              placeholder="Rechercher par CAT ou NATURE"
              className="hj-search-big"
            />

            <IonInput
              value={newComplement}
              onIonInput={(e) => setNewComplement(e.detail.value || "")}
              placeholder="Nouveau complément"
              className="hj-input-small"
            />

            <IonButton onClick={handleAddComplement} className="hj-btn-icon">
              <IonIcon icon={addOutline} />
            </IonButton>

            <IonInput
              value={deleteComplementName}
              onIonInput={(e) => setDeleteComplementName(e.detail.value || "")}
              placeholder="Complément à supprimer"
              className="hj-input-small"
            />

            <IonButton color="danger" onClick={handleDeleteByName} className="hj-btn-icon">
              <IonIcon icon={trashOutline} />
            </IonButton>

            <IonButton onClick={load} className="hj-btn-icon">
              <IonIcon icon={refreshOutline} />
            </IonButton>

            <IonButton color="medium" onClick={loadTrash} className="hj-btn-icon">
              <IonIcon icon={archiveOutline} />
            </IonButton>
          </div>

          {showTrash && (
            <div className="hj-trash-box">
              <h3>Corbeille des compléments</h3>

              {deletedComplements.length === 0 ? (
                <p>Aucun complément supprimé.</p>
              ) : (
                deletedComplements.map((comp) => (
                  <div key={comp.id} className="hj-trash-row">
                    <span>{comp.nom}</span>

                    <IonButton
                      size="small"
                      color="success"
                      onClick={() => handleRestore(comp.id)}
                    >
                      <IonIcon icon={refreshOutline} />
                    </IonButton>
                  </div>
                ))
              )}
            </div>
          )}

          {loading ? (
            <div className="hj-loading">
              <IonSpinner name="crescent" />
            </div>
          ) : (
            <div className="hj-table-wrap">
              <table className="hj-table">
                <thead>
                  <tr>
                    <th>CAT</th>
                    <th>NATURE</th>
                    {complementNames.map((name) => (
                      <th key={name}>{name}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((row, index) => (
                    <tr key={`${row.cat}-${row.nature}-${index}`}>
                      <td>{row.cat}</td>
                      <td>{row.nature}</td>

                      {complementNames.map((name) => (
                        <td key={name}>{formatCell(row.valeurs?.[name] || 0)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr>
                    <th colSpan={2}>TOTAL</th>
                    {complementNames.map((name) => (
                      <th key={name}>{formatCell(total[name] || 0)}</th>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HjSummaryPage;