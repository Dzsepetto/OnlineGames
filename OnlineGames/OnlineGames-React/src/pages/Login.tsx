import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { API_BASE } from "../config/api";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { t } = useTranslation();

  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  return (
    <div className="login-page">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="login-container"
      >
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">{t("login.title")}</h1>
            <p className="login-subtitle">{t("login.subtitle")}</p>
          </div>

          <div className="login-button-wrapper">
            <GoogleLogin
              theme="filled_black"
              shape="pill"
              size="large"
              width="100%"
              onSuccess={async (cred) => {
                setLoginError(null);
                setIsLoggingIn(true);

                try {
                  if (!cred.credential) {
                    setLoginError("Hiányzik a Google azonosító token.");
                    return;
                  }

                  const res = await fetch(`${API_BASE}/auth/google.php`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                      token: cred.credential,
                    }),
                  });

                  const data = await res.json();

                  if (!res.ok || !data?.success) {
                    setLoginError(
                      data?.message || "Nem sikerült bejelentkezni Google-fiókkal."
                    );
                    return;
                  }

                  const loggedInUser = await refreshUser();

                  if (!loggedInUser) {
                    setLoginError(
                      "A bejelentkezés sikeres volt, de a felhasználói adatok betöltése nem sikerült."
                    );
                    return;
                  }

                  navigate("/");
                } catch (error) {
                  console.error("Google login error:", error);
                  setLoginError("Váratlan hiba történt bejelentkezés közben.");
                } finally {
                  setIsLoggingIn(false);
                }
              }}
              onError={() => {
                setLoginError("A Google bejelentkezés megszakadt vagy sikertelen volt.");
              }}
            />
          </div>

          {loginError && (
            <div className="login-error">
              {loginError}
            </div>
          )}

          {isLoggingIn && (
            <div className="login-loading">
              Bejelentkezés folyamatban...
            </div>
          )}

          <div className="login-terms">{t("login.terms")}</div>
        </div>

        <div className="login-footer">
          © {new Date().getFullYear()} {t("login.footer")}
        </div>
      </motion.div>
    </div>
  );
}