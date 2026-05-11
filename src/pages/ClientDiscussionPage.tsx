import React, { useEffect, useRef, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonTextarea,
  IonIcon,
  IonSpinner,
  IonToast,
} from "@ionic/react";
import { sendOutline, arrowBackOutline, refreshOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import {
  MessageChat,
  getMyDiscussion,
  sendClientMessage,
} from "../services/discussionService";
import "./ClientDiscussionPage.dark.css";
import "./ClientDiscussionPage.light.css";
import Menuclient from "../components/Menuclient";
import { markClientMessagesRead } from "../services/discussionService";

const ClientDiscussionPage: React.FC = () => {
  const history = useHistory();
  const contentRef = useRef<HTMLIonContentElement>(null);

  const [messages, setMessages] = useState<MessageChat[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState("");

  const scrollBottom = () => {
    setTimeout(() => {
      contentRef.current?.scrollToBottom(300);
    }, 100);
  };

const loadMessages = async () => {
  try {
    setLoading(true);
    const data = await getMyDiscussion();
    setMessages(data);
    await markClientMessagesRead();
    scrollBottom();
  } catch (error) {
    console.error(error);
    setToast("Erreur lors du chargement des messages");
  } finally {
    setLoading(false);
  }
};

  const handleSend = async () => {
    if (!newMsg.trim()) return;

    try {
      setSending(true);
      await sendClientMessage(newMsg.trim());
      setNewMsg("");
      await loadMessages();
    } catch (error) {
      console.error(error);
      setToast("Erreur lors de l’envoi du message");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <IonPage>
      

      <IonContent ref={contentRef} className="client-chat-page">
         <Menuclient title="🧵 Mes Article" />
        <div className="client-chat-container">
          <div className="client-chat-header">
            <h2>💬 Discussion avec l’admin</h2>
            <p>Envoyez un message à l’administrateur et consultez ses réponses.</p>
          </div>

          <div className="client-messages-box">
            {loading ? (
              <div className="chat-empty-box">
                <IonSpinner name="crescent" />
              </div>
            ) : messages.length === 0 ? (
              <div className="chat-empty-box">Aucun message pour le moment.</div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={
                    msg.senderRole === "ROLE_ADMIN"
                      ? "chat-row admin-row"
                      : "chat-row client-row"
                  }
                >
                  <div
                    className={
                      msg.senderRole === "ROLE_ADMIN"
                        ? "chat-bubble admin-bubble"
                        : "chat-bubble client-bubble"
                    }
                  >
                    <p>{msg.contenu}</p>
                    <span>
                      {msg.senderRole === "ROLE_ADMIN" ? "Admin" : "Moi"} ·{" "}
                      {new Date(msg.createdAt).toLocaleString("fr-FR")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="client-send-box">
            <IonTextarea
              className="client-message-input"
              value={newMsg}
              placeholder="Écrire votre message..."
              autoGrow
              onIonInput={(e) => setNewMsg(String(e.detail.value ?? ""))}
            />

            <IonButton
              className="client-send-btn"
              onClick={handleSend}
              disabled={sending || !newMsg.trim()}
            >
              {sending ? <IonSpinner name="crescent" /> : <IonIcon icon={sendOutline} />}
            </IonButton>
          </div>
        </div>

        <IonToast
          isOpen={!!toast}
          message={toast}
          duration={2500}
          color="danger"
          onDidDismiss={() => setToast("")}
        />
      </IonContent>
    </IonPage>
  );
};

export default ClientDiscussionPage;