import { API_BASE } from "../config/api";

export type MessageChat = {
  id: string;
  clientEmail: string;
  senderEmail: string;
  senderRole: "ROLE_ADMIN" | "ROLE_USER" | string;
  contenu: string;
  createdAt: string;
  lu: boolean;
};

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

/* ================= CLIENT ================= */

export async function getMyDiscussion(): Promise<MessageChat[]> {
  const res = await fetch(`${API_BASE}/api/messages/client/my`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des messages");
  }

  return res.json();
}

export async function sendClientMessage(contenu: string): Promise<MessageChat> {
  const res = await fetch(`${API_BASE}/api/messages/client/send`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ contenu }),
  });

  if (!res.ok) {
    throw new Error("Erreur lors de l’envoi du message");
  }

  return res.json();
}

/* ================= ADMIN ================= */

export async function getAllDiscussions(): Promise<MessageChat[]> {
  const res = await fetch(`${API_BASE}/api/messages/admin/all`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des discussions");
  }

  return res.json();
}

export async function replyToClient(
  clientEmail: string,
  contenu: string
): Promise<MessageChat> {
  const res = await fetch(
    `${API_BASE}/api/messages/admin/reply/${encodeURIComponent(clientEmail)}`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ contenu }),
    }
  );

  if (!res.ok) {
    throw new Error("Erreur lors de l’envoi de la réponse");
  }

  return res.json();
}
export async function getClientUnreadCount(): Promise<number> {
  const messages = await getMyDiscussion();
  return messages.filter((m) => m.senderRole === "ROLE_ADMIN" && !m.lu).length;
}

export async function getAdminUnreadCount(): Promise<number> {
  const messages = await getAllDiscussions();
  return messages.filter((m) => m.senderRole === "ROLE_USER" && !m.lu).length;
}
export async function markClientMessagesRead(): Promise<void> {
  const res = await fetch(`${API_BASE}/api/messages/client/mark-read`, {
    method: "PUT",
    headers: authHeaders(),
  });

  if (!res.ok) {
    throw new Error("Erreur lors du marquage des messages client");
  }
}

export async function markAdminMessagesRead(clientEmail: string): Promise<void> {
  const res = await fetch(
    `${API_BASE}/api/messages/admin/mark-read/${encodeURIComponent(clientEmail)}`,
    {
      method: "PUT",
      headers: authHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error("Erreur lors du marquage des messages admin");
  }
}
