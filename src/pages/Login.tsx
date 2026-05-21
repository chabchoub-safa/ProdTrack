import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonToast,
  useIonRouter,
  IonText
} from "@ionic/react";
import "./Login.light.css";
import "./Login.dark.css";
import { login } from "../services/auth";

const Login: React.FC = () => {
  const ionRouter = useIonRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastOpen(true);
  };

  const onSubmit = async (ev?: React.FormEvent) => {
    ev?.preventDefault();

    if (!email.trim()) return showToast("Veuillez saisir votre email");
    if (!password.trim()) return showToast("Veuillez saisir votre mot de passe");

    setLoading(true);

    try {
  const res = await login({ email, password });

  const token = res.token;
  // const role = res.role;
  const role = String(res.role || "").trim().toUpperCase();
// console.log("LOGIN RESPONSE:", res);
// console.log("ROLE EXACT:", role);
// console.log("TOKEN:", token);
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
  localStorage.setItem("isLoggedIn", "true");

  if (role === "ROLE_ADMIN") {
  window.location.replace("/tissus");
} else if (role === "ROLE_TECHNICIEN") {
  window.location.replace("/scan");
} else if (role === "ROLE_CLIENT") {
  window.location.replace("/client/tissus");
} else if (role === "ROLE_SECRETAIRE") {
  window.location.replace("/itp");
} else {
  window.location.replace("/login");
}

    
    } catch (e: any) {
  const status = e?.response?.status;
  const msg = e?.response?.data;

  // 👇 Ajoute ça temporairement
  // console.log("ERREUR STATUS:", status);
  // console.log("ERREUR MSG:", msg);
  // console.log("ERREUR FULL:", JSON.stringify(e?.message));

  if (status === 401) showToast(msg || "Email ou mot de passe incorrect");
  else if (status === 403) showToast("Accès refusé");
  else showToast(`Erreur ${status} : ${msg || e?.message}`); // ← affiche le vrai message
}
finally {
    setLoading(false); // ✅ débloque le bouton dans tous les cas
  }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-bg">
        <div className="login-shell">
          <div className="login-card">
            {/* LEFT */}
            <div className="login-left">
              <div className="brand-container">
                
                <img src="/assets/lo.png" alt="Logo" className="brand-logo" />
              </div>
              <h1>Connectez-vous à votre espace</h1>
              <p className="tagline">
                Suivi de production, traçabilité des lots et alertes en temps réel
              </p>
              <IonButton
  fill="clear"
  className="home-btn"
onClick={() => ionRouter.push("/Home", "root", "replace")}>
  ⬅ Retour à l’accueil
</IonButton>

            </div>

            {/* RIGHT */}
            <div className="login-right">
              <h2>Se connecter</h2>

<form className="form">                <label className="label">Email</label>
                <IonInput
                  className="input"
                  placeholder="Email"
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value ?? "")}
                />

                <label className="label">Mot de passe</label>
                <IonInput
                  className="input"
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value ?? "")}
                />

                <div className="row">
                  <IonText className="fp-link" onClick={() => ionRouter.push("/forgot-password")}>
  Mot de passe oublié ?
</IonText>


                  {/* <IonButton
                    type="submit"
                    className="go-btn"
                    fill="outline"
                    disabled={loading}
                  > */}
                <IonButton
  type="button"
  className="go-btn"
  fill="outline"
  disabled={loading}
  onClick={() => onSubmit()}
>
                    {loading ? "Connexion..." : "GO"}
                  </IonButton>
                </div>
              </form>
            </div>
          </div>
        </div>

        <IonToast
          isOpen={toastOpen}
          message={toastMsg}
          duration={2500}
          position="top"
          onDidDismiss={() => setToastOpen(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;
