import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import "../../styles/layout.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate("/login");
  };

  const changeLanguage = (lang: "en" | "hu") => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      {/* LEFT */}
      <div className="nav-left">
        {/* Hamburger button (mobile only) */}
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
          <div className="profile-dropdown-container" ref={dropdownRef}>
            <button 
              className="profile-trigger" 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              title={user.name || user.email}
            >
              <img 
                src={user.profilePic || "/prof_pic_placeholder.png"} 
                alt="Profile" 
                className="profile-icon"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/prof_pic_placeholder.png";
                }}
              />
            </button>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <strong>{user.name || "User"}</strong>
                  <span className="dropdown-email">{user.email}</span>
                </div>
                <NavLink 
                  to="/profile" 
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  {t("nav.settings", "Settings")}
                </NavLink>
                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  {t("nav.logout")}
                </button>
              </div>
            )}
          </div>
        ) : (
          <NavLink to="/login">{t("nav.login")}</NavLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;