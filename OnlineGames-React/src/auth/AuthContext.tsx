import { createContext, useContext, useEffect, useState } from "react";

type User = {
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
      const res = await fetch("https://dzsepetto.hu/api/auth/user.php", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? null);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Hiba a felhasználó lekérésekor:", error);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await fetch("https://dzsepetto.hu/api/auth/logout.php", {
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