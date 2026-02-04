import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE } from "../config/api";

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/user.php`, {
        credentials: "include",
      });

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json().catch(() => null);

      if (!data?.user) {
        setUser(null);
        return;
      }

      const u = data.user;

      // Biztosítsuk a típust + legyen id string
      if (u.id == null || u.email == null || u.name == null) {
        setUser(null);
        return;
      }

      setUser({
        id: String(u.id),
        email: String(u.email),
        name: String(u.name),
      });
    } catch (error) {
      console.error("Hiba a felhasználó lekérésekor:", error);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/auth/logout.php`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Hiba a kijelentkezés során:", error);
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
