

// export default Register;
import React, { useMemo, useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonInput,
  IonIcon,
  IonButton,
  IonRadio,
  IonRadioGroup,
  IonCheckbox,
  IonToast,
  useIonRouter,
  IonModal,
  IonDatetime,
  IonItem,
  IonLabel,
  IonText,
} from "@ionic/react";

import {
  eyeOutline,
  eyeOffOutline,
  checkmarkCircleOutline,
} from "ionicons/icons";

import "./Register.css";
import { register, Role } from "../services/auth";
import TopMenu from "../components/TopMenu";
// ✅ même regex que backend (mdp fort)

const isStrongPassword = (pwd: string) => {
  const re =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  return re.test(pwd);
};

// ✅ backend accepte uniquement gmail.com
const isGmail = (email: string) => {
  const re = /^[a-zA-Z0-9]+(?:[._%+-][a-zA-Z0-9]+)*@gmail\.com$/;
  return re.test(email.trim());
};

const Register: React.FC = () => {
  const ionRouter = useIonRouter();
  /*
  *********************** ma3andekch l accer bch todkhl ll page ken ki tconenty************************
  */
// useEffect(() => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     ionRouter.push("/login", "root", "replace");
//   }
// }, []);
/*
**************************************************************************************
*/
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    numero: "",
    pays: "",
    password: "",
    confirmPassword: "",
    role: "ROLE_USER" as Role,
    dateNaissance: "",
    notRobot: false,
  });

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [dateOpen, setDateOpen] = useState(false);
  const [tempDate, setTempDate] = useState("");

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastOpen(true);
  };

  const pwdOk = useMemo(() => isStrongPassword(form.password), [form.password]);
  const gmailOk = useMemo(
    () => (form.email ? isGmail(form.email) : true),
    [form.email]
  );

  const openDateModal = () => {
    setTempDate(form.dateNaissance || "");
    setDateOpen(true);
  };
  const cancelDate = () => setDateOpen(false);
  const confirmDate = () => {
    const fixed = tempDate ? String(tempDate).slice(0, 10) : "";
    set("dateNaissance", fixed);
    setDateOpen(false);
  };

  const onSubmit = async (ev?: React.FormEvent) => {
    ev?.preventDefault();

    if (!form.nom.trim()) return showToast("Nom obligatoire");
    if (!form.prenom.trim()) return showToast("Prénom obligatoire");
    if (!form.email.trim()) return showToast("Email obligatoire");
    if (!isGmail(form.email)) return showToast("Email doit être Gmail (@gmail.com)");
    if (!form.password.trim()) return showToast("Mot de passe obligatoire");
    if (!pwdOk) return showToast("MDP faible: min 8, maj, min, chiffre, spécial (@$!%*?&#)");
    if (form.password !== form.confirmPassword) return showToast("Les mots de passe ne correspondent pas");
    if (!form.notRobot) return showToast("Veuillez cocher : Je ne suis pas un robot");
if (!form.role) return showToast("Veuillez choisir un rôle");

    setLoading(true);

    try {
      const payload = {
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        email: form.email.trim(),
        numero: form.numero.trim(),
        pays: form.pays.trim(),
        password: form.password.trim(),
        confirmPassword: form.confirmPassword.trim(),
        role: form.role,
        dateNaissance: form.dateNaissance,
        isNotRobot: form.notRobot,
      };

      const msg = await register(payload);
      showToast(typeof msg === "string" ? msg : "Inscription réussie ✅");
      setTimeout(() => ionRouter.push("/register", "root", "replace"), 900);
    } catch (e: any) {
      const msg =
        typeof e?.response?.data === "string"
          ? e.response.data
          : e?.response?.data?.message || "Erreur inscription. Réessayez";
      showToast(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="login-bg">
  <TopMenu title="Création des comptes" />
  
        <div className="login-shell">
          <div className="register-card">
            <div className="form-head">
              <h2 className="form-title"></h2>
              <p className="form-sub">
               
              </p>
            </div>

            <form onSubmit={onSubmit} className="form">
              {/* NOM */}
              <div className="field">
                <label className="label"><span className="req">*</span>Nom</label>
                <div className="input-line">
                  <IonInput
                    className="input-plain"
                    placeholder="Votre nom"
                    value={form.nom}
                    onIonInput={(e) => set("nom", e.detail.value ?? "")}
                  />
                </div>
              </div>

              {/* PRENOM */}
              <div className="field">
                <label className="label"><span className="req">*</span>Prénom</label>
                <div className="input-line">
                  <IonInput
                    className="input-plain"
                    placeholder="Votre prénom"
                    value={form.prenom}
                    onIonInput={(e) => set("prenom", e.detail.value ?? "")}
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="field">
                <label className="label"><span className="req">*</span>Email</label>
                <div className="input-line">
                  <IonInput
                    className="input-plain"
                    placeholder="exemple@gmail.com"
                    value={form.email}
                    onIonInput={(e) => set("email", e.detail.value ?? "")}
                  />
                  {gmailOk && form.email && (
                    <IonIcon icon={checkmarkCircleOutline} className="icon-ok" />
                  )}
                </div>
                {!gmailOk && form.email && (
                  <IonText className="hint-warn">⚠️ Email doit être Gmail</IonText>
                )}
              </div>

              {/* TELEPHONE */}
              <div className="field">
                <label className="label">Téléphone</label>
                <div className="input-line">
                  <IonInput
                    className="input-plain"
                    placeholder="Optionnel"
                    value={form.numero}
                    onIonInput={(e) => set("numero", e.detail.value ?? "")}
                  />
                </div>
              </div>

              {/* PAYS */}
              <div className="field">
                <label className="label">Pays</label>
                <div className="input-line">
                  <IonInput
                    className="input-plain"
                    placeholder="Optionnel"
                    value={form.pays}
                    onIonInput={(e) => set("pays", e.detail.value ?? "")}
                  />
                </div>
              </div>

              {/* ROLE */}
<label className="label">
  <span className="req">*</span> Rôle
</label>

<IonRadioGroup
  value={form.role}
  onIonChange={(e) => set("role", e.detail.value as Role)}
  className="roleRow"
>
  <label className="roleChoice">
    <IonRadio value="ROLE_ADMIN" />
    <span>Admin</span>
  </label>

  <label className="roleChoice">
    <IonRadio value="ROLE_CLIENT" />
    <span>client</span>
  </label>

  <label className="roleChoice">
    <IonRadio value="ROLE_TECHNICIEN" />
    <span>Technicien</span>
  </label>

   <label className="roleChoice">
  <IonRadio value="ROLE_SECRETAIRE" />
  <span>Secrétaire</span>
</label>
</IonRadioGroup>



              {/* DATE */}
              <div className="field">
  <label className="label">Date de naissance</label>
  <div className="input-line">
    <IonInput
      className="input-plain"
      type="date"
      value={form.dateNaissance} // ex: 2002-02-20
      onIonInput={(e) => set("dateNaissance", String(e.detail.value ?? ""))}
    />
  </div>
</div>


              {/* PASSWORD */}
              <div className="field">
                <label className="label"><span className="req">*</span>Mot de passe</label>
                <div className="input-line">
                  <IonInput
                    className="input-plain"
                    type={showPwd ? "text" : "password"}
                    placeholder="Min 8 • Maj • Min • Chiffre • Spécial"
                    value={form.password}
                    onIonInput={(e) => set("password", e.detail.value ?? "")}
                  />
                  <IonIcon
                    icon={showPwd ? eyeOffOutline : eyeOutline}
                    className="icon-eye"
                    onClick={() => setShowPwd(!showPwd)}
                  />
                </div>
                {form.password && !pwdOk && (
                  <IonText className="hint-warn">⚠️ Mot de passe trop faible</IonText>
                )}
              </div>

              {/* CONFIRM */}
              <div className="field">
                <label className="label"><span className="req">*</span>Confirmer</label>
                <div className="input-line">
                  <IonInput
                    className="input-plain"
                    type={showConfirmPwd ? "text" : "password"}
                    placeholder="Doit être identique"
                    value={form.confirmPassword}
                    onIonInput={(e) => set("confirmPassword", e.detail.value ?? "")}
                  />
                  <IonIcon
                    icon={showConfirmPwd ? eyeOffOutline : eyeOutline}
                    className="icon-eye"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                  />
                </div>
              </div>

              {/* ROBOT */}
              <div className="field">
                <label className="label"><span className="req">*</span>Vérification</label>
                <IonItem
                  lines="none"
                  className="robot-item"
                  onClick={() => set("notRobot", !form.notRobot)}
                >
                  <IonCheckbox
                    slot="start"
                    checked={form.notRobot}
                    onIonChange={(e) => set("notRobot", e.detail.checked)}
                  />
                  <IonLabel>Je ne suis pas un robot</IonLabel>
                </IonItem>
              </div>
<div className="row">
              <IonButton
    type="submit"
    className="go-btn"
    fill="outline"
    disabled={loading}
  >
    {loading ? "Inscription..." : "Go"}
  </IonButton>
  </div>

            </form>
          </div>
        </div>

        <IonToast
          isOpen={toastOpen}
          message={toastMsg}
          duration={2600}
          position="top"
          

          onDidDismiss={() => setToastOpen(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;
