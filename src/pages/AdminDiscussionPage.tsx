import React, { useEffect, useMemo, useState } from "react";
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
  getAllDiscussions,
  replyToClient,
} from "../services/discussionService";
import "./AdminDiscussionPage.dark.css";
import "./AdminDiscussionPage.light.css";

import TopMenu from "../components/TopMenu";
import { markAdminMessagesRead } from "../services/discussionService";

const AdminDiscussionPage: React.FC = () => {
  const history = useHistory();

  const [messages, setMessages] = useState<MessageChat[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState("");

  const loadMessages = async (keepClient?: string) => {
  try {
    setLoading(true);
    const data = await getAllDiscussions();
    setMessages(data);

    if (keepClient) {
      setSelectedClient(keepClient);
    } else if (data.length > 0 && !selectedClient) {
      setSelectedClient(data[0].clientEmail);
    }
  } catch (error) {
    console.error(error);
    setToast("Erreur lors du chargement des discussions");
  } finally {
    setLoading(false);
  }
};
  const clients = useMemo(() => {
    return Array.from(new Set(messages.map((m) => m.clientEmail)));
  }, [messages]);

  const selectedMessages = useMemo(() => {
    return messages
      .filter((m) => m.clientEmail === selectedClient)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }, [messages, selectedClient]);

  const handleReply = async () => {
    if (!newMsg.trim() || !selectedClient) return;

    try {
      setSending(true);
      await replyToClient(selectedClient, newMsg.trim());
      setNewMsg("");
      await loadMessages();
    } catch (error) {
      console.error(error);
      setToast("Erreur lors de l’envoi de la réponse");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <IonPage>
     

      <IonContent className="admin-chat-page">
                <TopMenu title="" />

        <div className="admin-chat-container">
          <div className="admin-chat-header">
            <h2>💬 Discussion clients</h2>
            <p>Consultez les messages envoyés par les clients et répondez directement.</p>
          </div>

          <div className="admin-chat-layout">
            <div className="admin-clients-list">
              <h3>Clients</h3>

              {loading ? (
                <div className="admin-empty-box">
                  <IonSpinner name="crescent" />
                </div>
              ) : clients.length === 0 ? (
                <div className="admin-empty-box">Aucun message</div>
              ) : (
                clients.map((client) => (
                 <button
  key={client}
  className={
    selectedClient === client
      ? "admin-client-item active-client"
      : "admin-client-item"
  }
  onClick={async () => {
    await markAdminMessagesRead(client);
    await loadMessages(client);
  }}
>
  <span>{client}</span>

  <small>
    {
      messages.filter(
        (m) =>
          m.clientEmail === client &&
          m.senderRole === "ROLE_USER" &&
          !m.lu
      ).length
    } non lus
  </small>
</button>
                ))
              )}
            </div>

            <div className="admin-conversation-panel">
              {!selectedClient ? (
                <div className="admin-select-empty">
                  Sélectionnez un client pour voir la discussion.
                </div>
              ) : (
                <>
                  <div className="admin-conversation-title">
                    <h3>{selectedClient}</h3>
                    <span>{selectedMessages.length} messages</span>
                  </div>

                  <div className="admin-messages-box">
                    {selectedMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={
                          msg.senderRole === "ROLE_ADMIN"
                            ? "admin-chat-row admin-row"
                            : "admin-chat-row client-row"
                        }
                      >
                        <div
                          className={
                            msg.senderRole === "ROLE_ADMIN"
                              ? "admin-chat-bubble admin-bubble"
                              : "admin-chat-bubble client-bubble"
                          }
                        >
                          <p>{msg.contenu}</p>
                          <span>
                            {msg.senderRole === "ROLE_ADMIN" ? "Admin" : "Client"} ·{" "}
                            {new Date(msg.createdAt).toLocaleString("fr-FR")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="admin-send-box">
                    <IonTextarea
                      className="admin-message-input"
                      value={newMsg}
                      placeholder="Écrire une réponse..."
                      autoGrow
                      onIonInput={(e) => setNewMsg(String(e.detail.value ?? ""))}
                    />

                    <IonButton
                      className="admin-send-btn"
                      onClick={handleReply}
                      disabled={sending || !newMsg.trim()}
                    >
                      {sending ? <IonSpinner name="crescent" /> : <IonIcon icon={sendOutline} />}
                    </IonButton>
                  </div>
                </>
              )}
            </div>
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

export default AdminDiscussionPage;