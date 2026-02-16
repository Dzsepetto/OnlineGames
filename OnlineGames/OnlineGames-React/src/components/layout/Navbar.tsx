import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import "../../styles/layout.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const changeLanguage = (lang: "en" | "hu") => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="nav-left">
        {/* 🍔 Hamburger button (mobile only) */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>
            {t("nav.home")}
          </NavLink>
          <NavLink to="/quizzes" onClick={() => setMenuOpen(false)}>
            {t("nav.quizzes")}
          </NavLink>
          <NavLink to="/help" onClick={() => setMenuOpen(false)}>
            {t("nav.help")}
          </NavLink>
        </div>
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        <div className="lang-switcher">
          <button
            className={i18n.language === "en" ? "active" : ""}
            onClick={() => changeLanguage("en")}
          >
            EN
          </button>
          <button
            className={i18n.language === "hu" ? "active" : ""}
            onClick={() => changeLanguage("hu")}
          >
            HU
          </button>
        </div>

        {user ? (
          <div className="auth-info">
            <span>
              <strong>{user.name || user.email}</strong>
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              {t("nav.logout")}
            </button>
          </div>
        ) : (
          <NavLink to="/login">{t("nav.login")}</NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
