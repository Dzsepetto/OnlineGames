import { API_BASE } from "../../api/apiClient";

export const getFollows = async () => {
  const response = await fetch(`${API_BASE}/follows.php`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok || data.success !== true) {
    throw new Error(data.message || "Nem sikerült betölteni a követéseket.");
  }

  return data.data;
};

export const getProfile = async (nickname?: string) => {
  const query = nickname ? `?nickname=${encodeURIComponent(nickname)}` : "";

  const response = await fetch(`${API_BASE}/profile.php${query}`, {
    method: "GET",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok || data.success !== true) {
    throw new Error(data.message || "Nem sikerült betölteni a profilt.");
  }

  return data.data;
};

export const followUser = async (userId: string | number) => {
  const response = await fetch(`${API_BASE}/follow.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ user_id: userId }),
  });

  const data = await response.json();

  if (!response.ok || data.success !== true) {
    throw new Error(data.message || "Nem sikerült bekövetni.");
  }

  return data.data;
};

export const unfollowUser = async (userId: string | number) => {
  const response = await fetch(`${API_BASE}/unfollow.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ user_id: userId }),
  });

  const data = await response.json();

  if (!response.ok || data.success !== true) {
    throw new Error(data.message || "Nem sikerült kikövetni.");
  }

  return data.data;
};