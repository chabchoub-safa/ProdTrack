// import React from "react";
// import { IonIcon, IonButton } from "@ionic/react";
// import {
//   menuOutline,
//   homeOutline,
//   notificationsOutline,
//   cubeOutline,
//   hardwareChipOutline,
//   logOutOutline,
//   personOutline,
// } from "ionicons/icons";
// import { useLocation } from "react-router";
// import { useIonRouter } from "@ionic/react";
// import "./TopMenu.css";
// import { personAddOutline } from "ionicons/icons";

// type Props = {
//   title: string;
//   onMenuClick?: () => void; // si tu as un side menu plus tard
//   showLogout?: boolean;
// };

// const Menusec: React.FC<Props> = ({ title, onMenuClick, showLogout = true }) => {
//   const router = useIonRouter();
//   const location = useLocation();

//   const go = (path: string) => {
//     if (location.pathname !== path) router.push(path, "root", "replace");
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("role");
//     router.push("/login", "root", "replace");
//   };

//   return (
//     <div className="topbar">
//       <div className="topbar-glass">
//         <div className="topbar-left">
//          {/* <IonButton fill="clear" className="topbar-icon" onClick={onMenuClick}>
//             <IonIcon icon={menuOutline} />
//           </IonButton> */}

//           <div className="topbar-title">
//             <span className="topbar-badge" />
//             <span className="topbar-text">{title}</span>
//           </div>
//         </div>

//         <div className="topbar-nav">
//            <button
//             className={`topnav-btn ${location.pathname === "/SuiviITPP" ? "active" : ""}`}
//             onClick={() => go("/ITP")}
//           >
//             <IonIcon icon={cubeOutline} />
//             <span>ITS</span>
//           </button>

//           <button
//             className={`topnav-btn ${location.pathname === "/SuiviPlanAction" ? "active" : ""}`}
//             onClick={() => go("/plan")}
//           >
//             <IonIcon icon={hardwareChipOutline} />
//             <span>Suivi Plan Action</span>
//           </button>
// <button
//             className={`topnav-btn ${location.pathname === "/AssTech" ? "active" : ""}`}
//             onClick={() => go("/tech")}
//           >
//             <IonIcon icon={personOutline} />
//             <span>Ass Tech</span>
//           </button>

// <button
//   className={`topnav-btn ${location.pathname === "/Diagnostic" ? "active" : ""}`}
//   onClick={() => go("/diag")}
// >
//   <IonIcon icon={personAddOutline} />
//   <span>Diagnostic</span>
// </button>



//           <button
//             className={`topnav-btn ${location.pathname === "/Formation" ? "active" : ""}`}
//             onClick={() => go("/formation")}
//           >
//             <IonIcon icon={notificationsOutline} />
//             <span>Formation</span>
//           </button>

//          <button
//             className={`topnav-btn ${location.pathname === "/GeneralDashboard" ? "active" : ""}`}
//             onClick={() => go("/general")}
//           >
//             <IonIcon icon={notificationsOutline} />
//             <span>GeneralDashboard</span>
//           </button>


          
          
//         </div>

//         {showLogout && (
//           <div className="topbar-right">
//             <IonButton fill="clear" className="topbar-icon danger" onClick={logout}>
//               <IonIcon icon={logOutOutline} />
//             </IonButton>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Menusec;

import React from "react";
import { IonIcon, IonButton } from "@ionic/react";
import {
  documentTextOutline,
  clipboardOutline,
  constructOutline,
  flaskOutline,
  schoolOutline,
  gridOutline,
   peopleOutline,
  businessOutline,
  logOutOutline,
} from "ionicons/icons";
import { useLocation } from "react-router";
import { useIonRouter } from "@ionic/react";
import "./TopMenu.dark.css";
import "./TopMenu.light.css";
import {  IonToggle } from '@ionic/react';
import { sunny, moon } from 'ionicons/icons';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

type Props = {
  title: string;
  onMenuClick?: () => void;
  showLogout?: boolean;
};

const Menusec: React.FC<Props> = ({ title, onMenuClick, showLogout = true }) => {
  const router = useIonRouter();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const go = (path: string) => {
    if (location.pathname !== path) router.push(path, "root", "replace");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");
    router.push("/login", "root", "replace");
  };

  return (
    <div className="topbar">
      <div className="topbar-glass">
        <div className="topbar-left">
          <div className="topbar-title">
            <span className="topbar-badge" />
            <span className="topbar-text">{title}</span>
          </div>
        </div>

        <div className="topbar-nav">
          <button
            className={`topnav-btn ${location.pathname === "/itp" ? "active" : ""}`}
            onClick={() => go("/itp")}
          >
            <IonIcon icon={documentTextOutline} />
            <span>ITS</span>
          </button>

          <button
            className={`topnav-btn ${location.pathname === "/plan" ? "active" : ""}`}
            onClick={() => go("/plan")}
          >
            <IonIcon icon={clipboardOutline} />
            <span> Plan Action</span>
          </button>

          <button
            className={`topnav-btn ${location.pathname === "/tech" ? "active" : ""}`}
            onClick={() => go("/tech")}
          >
            <IonIcon icon={constructOutline} />
            <span>Ass Tech</span>
          </button>

          <button
            className={`topnav-btn ${location.pathname === "/diag" ? "active" : ""}`}
            onClick={() => go("/diag")}
          >
            <IonIcon icon={flaskOutline} />
            <span>Diagnostic</span>
          </button>

          <button
            className={`topnav-btn ${location.pathname === "/formation" ? "active" : ""}`}
            onClick={() => go("/formation")}
          >
            <IonIcon icon={schoolOutline} />
            <span>Formation</span>
          </button>

 <button
            className={`topnav-btn ${location.pathname === "/somme" ? "active" : ""}`}
            onClick={() => go("/somme")}
          >
            <IonIcon icon={schoolOutline} />
            <span>h/j Par Person</span>
          </button>

          <button
            className={`topnav-btn ${location.pathname === "/general" ? "active" : ""}`}
            onClick={() => go("/general")}
          >
            <IonIcon icon={gridOutline} />
            <span>General Dashboard</span>
          </button>
          {/* <button
            className={`topnav-btn ${location.pathname === "/personnel" ? "active" : ""}`}
            onClick={() => go("/personnel")}
          >
            <IonIcon icon={peopleOutline} />
            <span>personnel</span>
          </button> */}
          <button
            className={`topnav-btn ${location.pathname === "/Entreprise" ? "active" : ""}`}
            onClick={() => go("/entreprise")}
          >
            <IonIcon icon={businessOutline} />
            <span>Entreprise</span>
          </button>
        </div>

 <div className="theme-toggle-wrapper">
      <IonIcon icon={sunny} className="toggle-icon" />
      <IonToggle
        checked={theme === 'dark'}
        onIonChange={toggleTheme}
      />
      <IonIcon icon={moon} className="toggle-icon" />
    </div>
    
        {showLogout && (
          <div className="topbar-right">
            <IonButton fill="clear" className="topbar-icon danger" onClick={logout}>
              <IonIcon icon={logOutOutline} />
            </IonButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menusec;