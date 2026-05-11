import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonToast,
  IonText,
  IonIcon,
  useIonRouter,
} from "@ionic/react";
import { mailOutline, keyOutline, lockClosedOutline, arrowBackOutline } from "ionicons/icons";
import "./ForgotPassword.dark.css";
import "./ForgotPassword.light.css";
import { resetPassword } from "../services/auth";

const ResetPassword: React.FC = () => {
  const ionRouter = useIonRouter();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastOpen(true);
  };

  const onReset = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email.trim()) return showToast("Veuillez saisir votre email");
    if (!code.trim()) return showToast("Veuillez saisir le code");
    if (!newPassword.trim()) return showToast("Veuillez saisir le nouveau mot de passe");

    setLoading(true);
    try {
      await resetPassword(email.trim(), code.trim(), newPassword);
      showToast("Mot de passe mis à jour ✅");
      setTimeout(() => ionRouter.push("/login", "root", "replace"), 600);
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data;
      if (status === 400) showToast(msg || "Code invalide / expiré");
      else showToast("Erreur serveur. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="fp-bg">
        <div className="fp-wrap">
          <div className="fp-card">
            <div className="fp-top">
              <IonButton
                fill="clear"
                className="fp-back"
                onClick={() => ionRouter.push("/forgot-password", "back")}
              >
                <IonIcon icon={arrowBackOutline} />
              </IonButton>

              <IonText className="fp-title">Réinitialiser</IonText>
              <IonText className="fp-sub">
                Entrez le code reçu par email et choisissez un nouveau mot de passe.
              </IonText>
            </div>

            <form onSubmit={onReset}>
              <div className="fp-field">
                <IonIcon icon={mailOutline} className="fp-icon" />
                <IonInput
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value || "")}
                  type="email"
                  placeholder="Email"
                  className="fp-input"
                />
              </div>

              <div className="fp-field">
                <IonIcon icon={keyOutline} className="fp-icon" />
                <IonInput
                  value={code}
                  onIonInput={(e) => setCode(e.detail.value || "")}
                  type="text"
                  inputmode="numeric"
                  placeholder="Code (6 chiffres)"
                  className="fp-input"
                />
              </div>

              <div className="fp-field">
                <IonIcon icon={lockClosedOutline} className="fp-icon" />
                <IonInput
                  value={newPassword}
                  onIonInput={(e) => setNewPassword(e.detail.value || "")}
                  type="password"
                  placeholder="Nouveau mot de passe"
                  className="fp-input"
                />
              </div>

              <IonButton
                expand="block"
                className="fp-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Validation..." : "Confirmer"}
              </IonButton>
            </form>
          </div>
        </div>

        <IonToast
          isOpen={toastOpen}
          message={toastMsg}
          duration={2000}
          onDidDismiss={() => setToastOpen(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default ResetPassword;
