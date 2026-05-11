import React from "react";
import { IonIcon, IonButton } from "@ionic/react";
import {
  menuOutline,
  homeOutline,
  notificationsOutline,
  cubeOutline,
  hardwareChipOutline,
  logOutOutline,
  personOutline,
} from "ionicons/icons";
import { useLocation } from "react-router";
import { useIonRouter } from "@ionic/react";
import "./TopMenu.dark.css";
import "./TopMenu.light.css";
import {  IonToggle } from '@ionic/react';
import { sunny, moon } from 'ionicons/icons';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';
import { personAddOutline } from "ionicons/icons";
import { documentTextOutline, chatbubblesOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { getAdminUnreadCount, getClientUnreadCount } from "../services/discussionService";
type Props = {
  title: string;
  onMenuClick?: () => void; // si tu as un side menu plus tard
  showLogout?: boolean;
};

const Menuclient: React.FC<Props> = ({ title, onMenuClick, showLogout = true }) => {
  const router = useIonRouter();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const go = (path: string) => {
    if (location.pathname !== path) router.push(path, "root", "replace");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login", "root", "replace");
  };
const [discussionCount, setDiscussionCount] = useState(0);

useEffect(() => {
  const loadCount = async () => {
    try {
      const role = localStorage.getItem("role");

      if (role === "ROLE_ADMIN") {
        const count = await getAdminUnreadCount();
        setDiscussionCount(count);
      } else {
        const count = await getClientUnreadCount();
        setDiscussionCount(count);
      }
    } catch (error) {
      console.error(error);
    }
  };

  loadCount();

  const interval = setInterval(loadCount, 10000);

  return () => clearInterval(interval);
}, []);
  return (
    <div className="topbar">
      <div className="topbar-glass">
        <div className="topbar-left">
         {/* <IonButton fill="clear" className="topbar-icon" onClick={onMenuClick}>
            <IonIcon icon={menuOutline} />
          </IonButton> */}

          <div className="topbar-title">
            <span className="topbar-badge" />
            <span className="topbar-text">{title}</span>
          </div>
        </div>
 <div className="topbar-nav">
           <button
  className={`topnav-btn ${location.pathname === "/client/tissus" ? "active" : ""}`}
  onClick={() => go("/client/tissus")}
>
  <IonIcon icon={documentTextOutline} />
  <span>Mes demandes</span>
</button>

<button
  className={`topnav-btn discussion-btn ${
    location.pathname === "/client/discussion" || location.pathname === "/admin/discussion"
      ? "active"
      : ""
  }`}
  onClick={() => {
    const role = localStorage.getItem("role");

    if (role === "ROLE_ADMIN") {
      go("/admin/discussion");
    } else {
      go("/client/discussion");
    }
  }}
>
  <div className="icon-badge-wrap">
    <IonIcon icon={chatbubblesOutline} />

    {discussionCount > 0 && (
      <span className="msg-badge">{discussionCount}</span>
    )}
  </div>

  <span>Discussion</span>
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

export default Menuclient;
