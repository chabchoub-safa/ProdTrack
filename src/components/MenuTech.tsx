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
import "./TopMenu.css";
import { personAddOutline } from "ionicons/icons";

type Props = {
  title: string;
  onMenuClick?: () => void; // si tu as un side menu plus tard
  showLogout?: boolean;
};

const MenuTech: React.FC<Props> = ({ title, onMenuClick, showLogout = true }) => {
  const router = useIonRouter();
  const location = useLocation();

  const go = (path: string) => {
    if (location.pathname !== path) router.push(path, "root", "replace");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/login", "root", "replace");
  };

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

export default MenuTech;
