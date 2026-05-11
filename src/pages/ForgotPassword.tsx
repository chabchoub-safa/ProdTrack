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
import { mailOutline, arrowBackOutline } from "ionicons/icons";
import "./ForgotPassword.dark.css";
import "./ForgotPassword.light.css";

import { forgotPassword } from "../services/auth";

const ForgotPassword: React.FC = () => {
  const ionRouter = useIonRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastOpen(true);
  };

  const onSendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!email.trim()) return showToast("Veuillez saisir votre email");

    setLoading(true);
    try {
      await forgotPassword(email.trim());
      showToast("Code envoyé par email ✅");
      // rediriger vers reset (on passe email en state)
      setTimeout(() => ionRouter.push("/reset-password", "forward"), 400);
    } catch (err: any) {
      const status = err?.response?.status;
      const msg = err?.response?.data;
      if (status === 400) showToast(msg || "Données invalides");
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
                onClick={() => ionRouter.push("/login", "back")}
              >
                <IonIcon icon={arrowBackOutline} />
              </IonButton>

              <IonText className="fp-title">Mot de passe oublié</IonText>
              <IonText className="fp-sub">
                Entrez votre email, on vous envoie un code de réinitialisation.
              </IonText>
            </div>

            <form onSubmit={onSendCode}>
              <div className="fp-field">
                <IonIcon icon={mailOutline} className="fp-icon" />
                <IonInput
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value || "")}
                  type="email"
                  placeholder="Email (gmail.com)"
                  className="fp-input"
                />
              </div>

              <IonButton
                expand="block"
                className="fp-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Envoi..." : "Envoyer le code"}
              </IonButton>

              <IonText className="fp-link" onClick={() => ionRouter.push("/login", "back")}>
                Retour à la connexion
              </IonText>
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

export default ForgotPassword;
