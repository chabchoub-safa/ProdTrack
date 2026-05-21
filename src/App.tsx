import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter, IonReactHashRouter } from "@ionic/react-router";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import rappels from "./pages/rappels";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Tissus from "./pages/Tissus";
import Machines from "./pages/Machines";
import ClientsTechniciens from "./pages/ClientsTechniciens";
import ClientTissus from "./pages/ClientTissus";
import ScanTechnicien from "./pages/ScanTechnicien";
import SuiviITPP from "./pages/SuiviITPP";
import SuiviPlanAction from "./pages/SuiviPlanAction";
import AssTech from "./pages/AssTech";
import Diagnostic from "./pages/Diagnostic";
import Formation from "./pages/formations";
import GeneralSummaryPage from "./pages/GeneralSummaryPage";
import HjSummaryPage from "./pages/HjSummaryPage";
import WaterRealtimePage from "./pages/WaterRealtimePage";
import EnergyDashboardPage from "./pages/EnergyDashboardPage";
import ClientDiscussionPage from "./pages/ClientDiscussionPage";
import AdminDiscussionPage from "./pages/AdminDiscussionPage";
import Entreprise from "./pages/Entreprise";

import { ThemeProvider } from "./context/ThemeContext";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./theme/home.css";

setupIonicReact();

const isElectron = window.location.protocol === "file:";
const Router = isElectron ? IonReactHashRouter : IonReactRouter;

const App: React.FC = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAuth = !!token;

  const defaultRedirect = () => {
    if (!isAuth) return "/home";

    if (role === "ROLE_ADMIN") return "/tissus";
    if (role === "ROLE_TECHNICIEN") return "/scan";
    if (role === "ROLE_CLIENT") return "/client/tissus";
    if (role === "ROLE_SECRETAIRE") return "/itp";

    return "/login";
  };

  return (
    <ThemeProvider>
      <IonApp>
        <Router>
          <IonRouterOutlet>
            <Route exact path="/">
              <Redirect to={defaultRedirect()} />
            </Route>

            <Route exact path="/home" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/forgot-password" component={ForgotPassword} />
            <Route exact path="/reset-password" component={ResetPassword} />

            <Route
              exact
              path="/tissus"
              render={() =>
                isAuth && role === "ROLE_ADMIN" ? (
                  <Tissus />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />

            <Route
              exact
              path="/scan"
              render={() =>
                isAuth && role === "ROLE_TECHNICIEN" ? (
                  <ScanTechnicien />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />

            <Route
              exact
              path="/client/tissus"
              render={() =>
                isAuth && role === "ROLE_CLIENT" ? (
                  <ClientTissus />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />

            <Route
              exact
              path="/itp"
              render={() =>
                isAuth && role === "ROLE_SECRETAIRE" ? (
                  <SuiviITPP />
                ) : (
                  <Redirect to="/login" />
                )
              }
            />

            <Route exact path="/rappels" component={rappels} />
            <Route exact path="/machines" component={Machines} />
            <Route exact path="/utilisateur" component={ClientsTechniciens} />
            <Route exact path="/client/discussion" component={ClientDiscussionPage} />
            <Route exact path="/admin/discussion" component={AdminDiscussionPage} />
            <Route exact path="/plan" component={SuiviPlanAction} />
            <Route exact path="/tech" component={AssTech} />
            <Route exact path="/diag" component={Diagnostic} />
            <Route exact path="/formation" component={Formation} />
            <Route exact path="/general" component={GeneralSummaryPage} />
            <Route exact path="/somme" component={HjSummaryPage} />
            <Route exact path="/eau" component={WaterRealtimePage} />
            <Route exact path="/courant" component={EnergyDashboardPage} />
            <Route exact path="/entreprise" component={Entreprise} />
          </IonRouterOutlet>
        </Router>
      </IonApp>
    </ThemeProvider>
  );
};

export default App;