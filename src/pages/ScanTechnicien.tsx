import { listMachines } from "../services/machines.service";
import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  IonPage,
  IonContent,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInput,
  IonToast,
  IonText,
  IonSpinner,
  IonBadge,
} from "@ionic/react";

import {
  qrCodeOutline,
  closeOutline,
  playOutline,
  stopOutline,
  alertCircleOutline,
} from "ionicons/icons";


import MenuTech from "../components/MenuTech";
import "./ScanTechnicien.dark.css";
import "./ScanTechnicien.light.css";
import { listTissus } from "../services/tissus.service";
import {
  getWorkflowByTissu,
  startScan,
  stopScan,
} from "../services/scan.service";
import { startQrScanner, stopQrScanner } from "../utils/qrScanner";

type WorkflowState = {
  machineId: string;
  machineName?: string;
  status: "NON_COMMENCE" | "EN_COURS" | "TERMINE";
  startedAt?: string;
  stoppedAt?: string;
  estimatedMinutes?: number;
  reminderAt?: string;
  startedBy?: string;
  stoppedBy?: string;
};

type TissuType = {
  id: string;
  clientNom?: string;
  clientEmail?: string;
  statut?: string;
  code?: string;
  routeMachineIds?: string[];
  workflowStates?: WorkflowState[];
};

type WorkflowResponse = {
  tissu: TissuType;
  events: any[];
};

export default function ScanTechnicien() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<TissuType[]>([]);
  const [loading, setLoading] = useState(false);
const [machineCodeMap, setMachineCodeMap] = useState<Record<string, string>>({});
  const scanLocked = useRef(false);
const scannerModeRef = useRef<"tissu" | "start" | "stop" | null>(null);
const currentMachineIdRef = useRef<string | null>(null);
const selectedTissuRef = useRef<TissuType | null>(null);
  const [selectedTissu, setSelectedTissu] = useState<TissuType | null>(null);
  const [workflowOpen, setWorkflowOpen] = useState(false);
  const [workflowData, setWorkflowData] = useState<WorkflowResponse | null>(null);

  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannerMode, setScannerMode] = useState<"tissu" | "start" | "stop" | null>(null);
  const [currentMachineId, setCurrentMachineId] = useState<string | null>(null);

  const [estimatedMap, setEstimatedMap] = useState<Record<string, string>>({});
  const [toast, setToast] = useState({
    open: false,
    msg: "",
    color: "success" as "success" | "danger" | "warning",
  });

 

  const [confirmStart, setConfirmStart] = useState(false);
  const [confirmStop, setConfirmStop] = useState(false);
useEffect(() => {
  scannerModeRef.current = scannerMode;
}, [scannerMode]);

useEffect(() => {
  currentMachineIdRef.current = currentMachineId;
}, [currentMachineId]);

useEffect(() => {
  selectedTissuRef.current = selectedTissu;
}, [selectedTissu]);
  useEffect(() => {
    loadTissus();
  }, []);
  useEffect(() => {
  loadMachineCodes();
}, []);
const loadMachineCodes = async () => {
  try {
    const data = await listMachines();
    const arr = Array.isArray(data) ? data : [];

    const map: Record<string, string> = {};
    arr.forEach((m: any) => {
      if (m?.id) {
        map[m.id] = m.code || "--";
      }
    });

    setMachineCodeMap(map);
  } catch (e) {
    console.error("Erreur chargement codes machines =", e);
  }
};
  const loadTissus = async () => {
    try {
      setLoading(true);
      const data = await listTissus();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setToast({
        open: true,
        msg: e?.response?.data || "Erreur chargement tissus",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };
  

  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim();
    if (!term) return items;

    return items.filter((t) =>
      [t.id, t.code, t.clientNom, t.clientEmail, t.statut]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term))
    );
  }, [q, items]);

const openWorkflow = async (tissu: TissuType) => {
  try {
    console.log("openWorkflow() tissu =", tissu);

    const data = await getWorkflowByTissu(tissu.id);
    console.log("workflow reçu =", data);

    setSelectedTissu(data.tissu);
    setWorkflowData(data);
    setWorkflowOpen(true);

    const m: Record<string, string> = {};
    (data.tissu?.workflowStates || []).forEach((s: WorkflowState) => {
      m[s.machineId] =
        s.estimatedMinutes !== undefined &&
        s.estimatedMinutes !== null &&
        s.estimatedMinutes > 0
          ? String(s.estimatedMinutes)
          : "";
    });
    setEstimatedMap(m);
  } catch (e: any) {
    console.error("Erreur openWorkflow =", e);
    setToast({
      open: true,
      msg: e?.response?.data || e?.message || "Erreur chargement workflow",
      color: "danger",
    });
  }
};

const openScannerForTissu = async () => {
  try {
    scanLocked.current = false;

    scannerModeRef.current = "tissu";
    currentMachineIdRef.current = null;

    setScannerMode("tissu");
    setCurrentMachineId(null);
    setScannerOpen(true);

    setTimeout(async () => {
      try {
        console.log("Ouverture scanner tissu...");
        await startQrScanner("qr-reader", async (decodedText) => {
          if (scanLocked.current) return;
          scanLocked.current = true;
          await handleQrResult(decodedText);
        });
      } catch (e) {
        console.error("Erreur startQrScanner tissu =", e);
        setToast({
          open: true,
          msg: "Impossible d'ouvrir la caméra",
          color: "danger",
        });
      }
    }, 400);
  } catch (e) {
    console.error(e);
  }
};
const openScannerForStart = async (machineId: string) => {
  currentMachineIdRef.current = machineId;
  scannerModeRef.current = "start";

  setCurrentMachineId(machineId);
  setScannerMode("start");
  setConfirmStart(true);
};

  const openScannerForStop = async (machineId: string) => {
  currentMachineIdRef.current = machineId;
  scannerModeRef.current = "stop";

  setCurrentMachineId(machineId);
  setScannerMode("stop");
  setConfirmStop(true);
};

 const reallyOpenScanCamera = async () => {
  try {
    scanLocked.current = false;
    setScannerOpen(true);

    setTimeout(async () => {
      try {
        console.log("Ouverture scanner machine...");
        await startQrScanner("qr-reader", async (decodedText) => {
          if (scanLocked.current) return;
          scanLocked.current = true;
          await handleQrResult(decodedText);
        });
      } catch (e) {
        console.error("Erreur startQrScanner machine =", e);
        setToast({
          open: true,
          msg: "Impossible d'ouvrir la caméra",
          color: "danger",
        });
      }
    }, 400);
  } catch (e) {
    console.error(e);
  }
};

  const closeScanner = async () => {
  try {
    await stopQrScanner();
  } catch {}

  setScannerOpen(false);
  setScannerMode(null);
  setCurrentMachineId(null);

  scannerModeRef.current = null;
  currentMachineIdRef.current = null;

  scanLocked.current = false;
};

 const handleQrResult = async (decodedText: string) => {
  try {
    const rawValue = normalizeQrValue(decodedText);
    const mode = scannerModeRef.current;
    const currentMachine = currentMachineIdRef.current;
    const currentTissu = selectedTissuRef.current;

    console.log("QR brut =", decodedText);
    console.log("QR normalisé =", rawValue);
    console.log("scannerModeRef =", mode);

    // ===== SCAN TISSU =====
    if (mode === "tissu") {
      let tissuValue = rawValue;

      if (rawValue.toUpperCase().startsWith("TISSU:")) {
        tissuValue = rawValue.substring(rawValue.indexOf(":") + 1).trim();
      }

      console.log("Valeur tissu extraite =", tissuValue);

      await closeScanner();

      const found = items.find((t) => {
        const id = String(t.id || "").trim().toLowerCase();
        const code = String(t.code || "").trim().toLowerCase();
        const val = tissuValue.trim().toLowerCase();

        return id === val || code === val;
      });

      console.log("Tissu trouvé dans items =", found);
      console.log("Liste items =", items);

      if (found) {
        await openWorkflow(found);
        return;
      }

      setToast({
        open: true,
        msg: `Article introuvable pour le QR: ${tissuValue}`,
        color: "warning",
      });
      return;
    }

    // ===== SCAN MACHINE =====
    if (!currentTissu || !currentMachine || !mode) {
      scanLocked.current = false;
      return;
    }

    let machineId = rawValue;

    if (rawValue.toUpperCase().startsWith("MACHINE:")) {
      machineId = rawValue.substring(rawValue.indexOf(":") + 1).trim();
    }

    console.log("Machine extraite =", machineId, "machine attendue =", currentMachine);

    if (machineId !== currentMachine) {
      setToast({
        open: true,
msg: `QR incorrect. Veuillez scanner la machine ${getMachineLabel(currentMachine)}`,  
      color: "warning",
      });
      scanLocked.current = false;
      return;
    }

    await closeScanner();

    if (mode === "start") {
      const raw = estimatedMap[currentMachine]?.trim();
      let estimated: number | null = null;

      if (raw) {
        estimated = Number(raw);

        if (Number.isNaN(estimated) || estimated <= 0) {
          setToast({
            open: true,
            msg: "Le temps estimé doit être un nombre positif",
            color: "warning",
          });
          return;
        }
      }

      await startScan({
        tissuId: currentTissu.id,
        machineId: currentMachine,
        estimatedMinutes: estimated,
      });

      setToast({
        open: true,
        msg: "START enregistré avec succès",
        color: "success",
      });
    } else if (mode === "stop") {
      await stopScan({
        tissuId: currentTissu.id,
        machineId: currentMachine,
      });

      setToast({
        open: true,
        msg: "STOP enregistré avec succès",
        color: "success",
      });
    }

    await openWorkflow({ id: currentTissu.id });
    await loadTissus();
  } catch (e: any) {
    console.error("Erreur handleQrResult =", e);
    await closeScanner();
    setToast({
      open: true,
      msg: e?.response?.data || e?.message || "Erreur pendant le scan",
      color: "danger",
    });
  } finally {
    scanLocked.current = false;
  }
};

  const formatDate = (d?: string) => {
    if (!d) return "--";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return d;
    }
  };

  const getStatusClass = (status?: string) => {
    if (status === "TERMINE") return "done";
    if (status === "EN_COURS") return "progress";
    return "idle";
  };

  const overdueAlerts = useMemo(() => {
    const states = workflowData?.tissu?.workflowStates || [];
    const now = new Date().getTime();

    return states.filter((s) => {
      return (
        s.status === "EN_COURS" &&
        s.reminderAt &&
        new Date(s.reminderAt).getTime() < now
      );
    });
  }, [workflowData]);

  const workflowSteps =
    workflowData?.tissu?.workflowStates?.length
      ? workflowData.tissu.workflowStates
      : (workflowData?.tissu?.routeMachineIds || []).map((id) => ({
          machineId: id,
          machineName: id,
          status: "NON_COMMENCE" as const,
          startedAt: undefined,
          stoppedAt: undefined,
          estimatedMinutes: undefined,
          reminderAt: undefined,
          startedBy: undefined,
          stoppedBy: undefined,
        }));
const normalizeQrValue = (value: string) => {
  return String(value || "")
    .trim()
    .replace(/\n/g, "")
    .replace(/\r/g, "");
};
const getMachineLabel = (machineId?: string | null) => {
  if (!machineId) return "--";
  return machineCodeMap[machineId] || "--";
};
  return (
    <IonPage>
      <IonContent className="page-bg">
        <MenuTech title="🧵 Les Articles" />

        <div className="scan-container">
          <div className="glass-card">
            <div className="section-title">Choix Article</div>

            <div className="top-row">
              <IonSearchbar
  value={q}
  debounce={0}
  onIonInput={(e) => setQ(String(e.detail.value ?? ""))}
  placeholder="Rechercher un Article..."
  className="custom-searchbar"
/>

              <IonButton className="btn-main" onClick={openScannerForTissu}>
                <IonIcon icon={qrCodeOutline} slot="start" />
                Scanner QR Article
              </IonButton>
            </div>

            {loading ? (
              <div className="center-box">
                <IonSpinner name="crescent" />
              </div>
            ) : (
              <div className="tissu-list">
                {filtered.length === 0 ? (
                  <div className="empty-box">Aucun Article trouvé</div>
                ) : (
                  filtered.map((t) => (
                    <div
                      key={t.id}
                      className="tissu-item"
                      onClick={() => openWorkflow(t)}
                    >
                      <div className="tissu-main">
                        <div className="tissu-id">Article: {t.code || "--"}</div>
                        <div className="tissu-client">
                          Client: {t.clientNom || t.clientEmail || "--"}
                        </div>
                      </div>

                      <IonBadge className={`badge-status ${getStatusClass(t.statut)}`}>
                        {t.statut || "Sans statut"}
                      </IonBadge>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        <IonModal
          isOpen={workflowOpen}
          onDidDismiss={() => setWorkflowOpen(false)}
          className="workflow-modal"
        >
          <IonHeader>
            <IonToolbar className="modal-toolbar">
              <IonTitle>Article sélectionné</IonTitle>
              <IonButton slot="end" fill="clear" onClick={() => setWorkflowOpen(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonToolbar>
          </IonHeader>

          <IonContent className="modal-content">
            {selectedTissu && (
              <div className="modal-wrap">
                <div className="glass-card">
                  <div className="info-grid">
                    <div>
                     <strong>Code Article :</strong> {selectedTissu.code || "--"}
                     </div>
                    <div>
                      <strong>Client :</strong>{" "}
                      {selectedTissu.clientNom || selectedTissu.clientEmail || "--"}
                    </div>
                    <div>
                      <strong>Statut :</strong> {selectedTissu.statut || "--"}
                    </div>
                  </div>
                </div>

                {overdueAlerts.length > 0 && (
                  <div className="glass-card alert-card">
                    <div className="section-title alert-title">
                      <IonIcon icon={alertCircleOutline} />
                      Alertes
                    </div>

                    {overdueAlerts.map((a) => (
                      <div key={a.machineId} className="alert-item">
                        Attention: STOP oublié sur machine {getMachineLabel(a.machineId)}
                      </div>
                    ))}
                  </div>
                )}

                <div className="glass-card">
                  <div className="section-title">
                    Route workflow de machine sélectionnée
                  </div>

                  <div className="workflow-list">
                    {workflowSteps.length === 0 ? (
                      <div className="empty-box">
                        Aucune étape workflow trouvée pour ce Article
                      </div>
                    ) : (
                      workflowSteps.map((step) => (
                        <div className="workflow-item" key={step.machineId}>
                          <div className="workflow-header">
                            <div className="machine-name">
                              {getMachineLabel(step.machineId)}
                            </div>
                            <IonBadge className={`badge-status ${getStatusClass(step.status)}`}>
                              {step.status}
                            </IonBadge>
                          </div>

                          <div className="workflow-info">
                            <div>
                              <strong>Date start :</strong> {formatDate(step.startedAt)}
                            </div>
                            <div>
                              <strong>Date stop :</strong> {formatDate(step.stoppedAt)}
                            </div>
                          </div>

                          <IonInput
                            className="custom-input"
                            type="number"
                            placeholder="Temps estimé (minutes)"
                            value={estimatedMap[step.machineId] || ""}
                            onIonInput={(e) =>
                              setEstimatedMap((prev) => ({
                                ...prev,
                                [step.machineId]: e.detail.value || "",
                              }))
                            }
                          />

                          <div className="btn-row">
                            <IonButton
                              className="btn-start"
                              disabled={
                                step.status === "EN_COURS" || step.status === "TERMINE"
                              }
                              onClick={() => openScannerForStart(step.machineId)}
                            >
                              <IonIcon icon={playOutline} slot="start" />
                              Scanner START
                            </IonButton>

                            <IonButton
                              className="btn-stop"
                              fill="outline"
                              disabled={step.status !== "EN_COURS"}
                              onClick={() => openScannerForStop(step.machineId)}
                            >
                              <IonIcon icon={stopOutline} slot="start" />
                              Scanner STOP
                            </IonButton>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </IonContent>
        </IonModal>

        <IonModal
          isOpen={scannerOpen}
          onDidDismiss={closeScanner}
          className="scanner-modal"
        >
          <IonHeader>
            <IonToolbar className="modal-toolbar">
              <IonTitle>
                {scannerMode === "tissu"
                  ? "Scanner QR Article"
                  : scannerMode === "start"
                  ? "Scanner QR machine pour START"
                  : "Scanner QR machine pour STOP"}
              </IonTitle>
              <IonButton slot="end" fill="clear" onClick={closeScanner}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonToolbar>
          </IonHeader>

          <IonContent className="modal-content">
            <div className="scanner-wrap">
              <IonText>
                <p className="scanner-help">Place le QR code devant la caméra</p>
              </IonText>
              <div id="qr-reader" className="qr-reader-box"></div>
            </div>
          </IonContent>
        </IonModal>

        <IonModal
          isOpen={confirmStart}
          onDidDismiss={() => setConfirmStart(false)}
          className="confirm-scan-modal"
        >
          <div className="confirm-modal">
            <div className="modal-head">
              <h3>Confirmation</h3>
              <IonButton fill="clear" onClick={() => setConfirmStart(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </div>

            <div className="confirm-body">
              <p>Voulez-vous scanner la machine pour enregistrer le START ?</p>
            </div>

            <div className="confirm-actions">
              <IonButton
                className="btn-cancel"
                fill="outline"
                onClick={() => setConfirmStart(false)}
              >
                Annuler
              </IonButton>

              <IonButton
                className="btn-confirm"
                onClick={async () => {
                  setConfirmStart(false);
                  await reallyOpenScanCamera();
                }}
              >
                Oui, scanner
              </IonButton>
            </div>
          </div>
        </IonModal>

        <IonModal
          isOpen={confirmStop}
          onDidDismiss={() => setConfirmStop(false)}
          className="confirm-scan-modal"
        >
          <div className="confirm-modal">
            <div className="modal-head">
              <h3>Confirmation</h3>
              <IonButton fill="clear" onClick={() => setConfirmStop(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </div>

            <div className="confirm-body">
              <p>Voulez-vous scanner la machine pour enregistrer le STOP ?</p>
            </div>

            <div className="confirm-actions">
              <IonButton
                className="btn-cancel"
                fill="outline"
                onClick={() => setConfirmStop(false)}
              >
                Annuler
              </IonButton>

              <IonButton
                className="btn-confirm"
                onClick={async () => {
                  setConfirmStop(false);
                  await reallyOpenScanCamera();
                }}
              >
                Oui, scanner
              </IonButton>
            </div>
          </div>
        </IonModal>

        <IonToast
          isOpen={toast.open}
          message={toast.msg}
          color={toast.color}
          duration={2200}
          onDidDismiss={() => setToast((p) => ({ ...p, open: false }))}
        />
      </IonContent>
    </IonPage>
  );
}