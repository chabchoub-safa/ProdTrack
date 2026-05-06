import React from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonIcon,
} from "@ionic/react";
import {
  analyticsOutline,
  barChartOutline,
  businessOutline,
  peopleOutline,
  speedometerOutline,
  constructOutline,
  warningOutline,
} from "ionicons/icons";

import "./Home.css";

type CardItem = {
  title: string;
  desc: string;
  icon: string;
  image?: string;
  cta?: string;
};

const welcomeCards: CardItem[] = [
  {
    title: "Suivi de la production",
    desc: "Traçabilité des lots et suivi de leur passage machine",
    icon: analyticsOutline,
    image: "/assets/sui.jpg",
  },
  {
    title: "Analyse production",
    desc: "Estimation du temps de production et de livraison",
    icon: barChartOutline,
    image: "/assets/liv.jpg",
  },
  {
    title: "Alertes & contrôle",
    desc: "Contrôle des consommations et gestion des alertes",
    icon: warningOutline,
    image: "/assets/aler.png",
  },
];

const services: CardItem[] = [
  {
    title: "Dashboard",
    desc: "Statistiques (semaine/mois), KPIs, tendances, anomalies.",
    icon: speedometerOutline,
    
  },
  {
    title: "Machines",
    desc: "État ON/OFF, consommation électrique, historique par machine.",
    icon: businessOutline,
    cta: "Read More",
  },
  {
    title: "Clients",
    desc: "Fiches clients, historique tissus/commandes, recherche rapide.",
    icon: peopleOutline,
    cta: "Read More",
  },
  {
    title: "Maintenance",
    desc: "Rappels planifiés, techniciens, notifications email + mobile.",
    icon: constructOutline,
    cta: "Read More",
  },
];
const DEFAULT_IMG = "/assets/hero.jpg";
const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader className="home-header">
        <IonToolbar className="home-toolbar">
          <IonTitle className="brand">
  <div className="brand-container">
    <img
      src="/assets/lo.png"
      alt="ProdTrack logo"
      className="brand-logo"
    />
    
  </div>
</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" className="navBtn" onClick={() => scrollTo("home")}>
  Accueil
</IonButton>

<IonButton fill="clear" className="navBtn" onClick={() => scrollTo("services")}>
  Services
</IonButton>

<IonButton fill="clear" className="navBtn" onClick={() => scrollTo("about")}>
  À propos
</IonButton>

<IonButton fill="clear" className="navBtn" onClick={() => scrollTo("contact")}>
  Contact
</IonButton>

           
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/* HERO */}
        <section className="hero" id="home" style={{ backgroundImage: "url('/assets/hero.jpg')" }}>
          <div className="heroOverlay" />
          <IonGrid className="heroGrid">
            <IonRow>
              <IonCol size="12" sizeMd="7">
                <p className="heroKicker"></p>
                <h1 className="heroTitle">Bienvenue dans ProdTrack</h1>
                <p className="heroSubtitle">
                 Traçabilité des produits, surveillance des machines, alertes intelligentes, maintenance préventive et dashboards de consommation en temps réel.
                </p>
                <div className="heroActions">
                  
                  <IonButton fill="outline" className="secondaryCta" routerLink="/login">
                    Connexion
                  </IonButton>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </section>

        {/* WELCOME */}
        <section className="section" id="services">
          <div className="sectionHeader">
            <h2>Bienvenue dans ProdTrack</h2>
            <p>
               – Intelligent Production Tracking -
            </p>
          </div>

          <IonGrid>
            
            <IonRow className="cardsRow">
  {welcomeCards.map((c) => {
    const imageUrl =
      c.image && c.image.trim() !== "" ? c.image : DEFAULT_IMG;

    return (
      <IonCol key={c.title} size="12" sizeMd="4">
        <IonCard className="welcomeCard">
          <div
            className="welcomeImage"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <IonCardContent className="welcomeContent">
                      <div className="circleIcon">
                        <IonIcon icon={c.icon} />
                      </div>
                      <h3>{c.title}</h3>
                      <p>{c.desc}</p>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
    );
})}
            </IonRow>
          </IonGrid>
        </section>

        {/* WHAT WE DO */}
        <section className="section sectionAlt" id="about">
          <div className="sectionHeader">
            <h2>CE QUE NOUS FAISONS</h2>
            <p>
              Des modules clairs : lots, machines, clients, alertes, maintenance.
            </p>
          </div>

          <IonGrid>
            <IonRow className="cardsRow">
              {services.map((s) => (
                <IonCol key={s.title} size="12" sizeMd="3">
                  <IonCard className="serviceCard">
                    <IonCardContent>
                      <div className="serviceIcon">
                        <IonIcon icon={s.icon} />
                      </div>
                      <h3>{s.title}</h3>
                      <p>{s.desc}</p>
                     
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </section>

        {/* CTA */}
        <section className="cta" id="contact">
          <div className="ctaWave" />
          <IonGrid className="ctaGrid">
            <IonRow className="ion-align-items-center">
               <IonCol size="12" sizeMd="8" offsetMd="2">
               <h2 className="contact-title">Informations de contact</h2>

<p className="contact-inline">
  <span>📧Email : <strong>production@ss.com</strong></span>
  <span>📍 Adresse : Sousse, Tunisie</span>
  <span>📞Téléphone : +216 71 222 555</span>
</p>
              </IonCol>
              
            </IonRow>
          </IonGrid>
        </section>
      </IonContent>
    </IonPage>
  );
};

export default Home;
