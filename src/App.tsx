import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Login  from './pages/Login';
import Register from "./pages/Register";
import rappels from "./pages/rappels";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import tissus from "./pages/Tissus"
/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import { IonReactHashRouter } from '@ionic/react-router';
/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/home.css';
import Machines from './pages/Machines';
import ClientsTechniciens from './pages/ClientsTechniciens';
import ClientTissus from './pages/ClientTissus';
import ScanTechnicien from './pages/ScanTechnicien';

import SuiviITPP from './pages/SuiviITPP';
import SuiviPlanAction from './pages/SuiviPlanAction';
import AssTech from './pages/AssTech';
import Diagnostic from './pages/Diagnostic';
import Formation from './pages/formations';
import GeneralSummaryPage from './pages/GeneralSummaryPage';
import HjSummaryPage from './pages/HjSummaryPage';
import WaterRealtimePage from './pages/WaterRealtimePage';
import EnergyDashboardPage from './pages/EnergyDashboardPage';
import ClientDiscussionPage from './pages/ClientDiscussionPage';
import AdminDiscussionPage from './pages/AdminDiscussionPage';
setupIonicReact();
const isElectron = window.location.protocol === 'file:';
const Router = isElectron ? IonReactHashRouter : IonReactRouter;
const App: React.FC = () => (
  <IonApp>
       <Router>

      <IonRouterOutlet>
        <Route exact path="/Home">
          <Home />
        </Route>
        <Route exact path="/">
          <Redirect to="/Home" />
        </Route>
        <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
           <Route exact path="/rappels" component={rappels} />
           <Route path="/machines" component={Machines} exact />
           <Route exact path="/forgot-password" component={ForgotPassword} />
<Route exact path="/reset-password" component={ResetPassword} />
<Route exact path="/tissus" component={tissus} />
<Route exact path="/utilisateur" component={ClientsTechniciens} />
<Route exact path="/client/tissus" component={ClientTissus} />
<Route exact path="/Scan" component={ScanTechnicien} />
<Route exact path="/client/discussion" component={ClientDiscussionPage} />
<Route path="/admin/discussion" component={AdminDiscussionPage} exact />
<Route exact path="/plan" component={SuiviPlanAction} />
<Route exact path="/tech" component={AssTech} />
<Route exact path="/diag" component={Diagnostic} />
<Route exact path="/formation" component={Formation} />
<Route exact path="/general" component={GeneralSummaryPage} />
<Route exact path="/itp" component={SuiviITPP} />
<Route exact path="/somme" component={HjSummaryPage} />
<Route exact path="/eau" component={WaterRealtimePage} />
<Route exact path="/courant" component={EnergyDashboardPage} />
      </IonRouterOutlet>
   </Router>
  </IonApp>
);

export default App;
