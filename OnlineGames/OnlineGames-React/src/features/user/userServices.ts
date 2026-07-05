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