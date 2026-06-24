import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/AuthContext";
import { useState, useEffect } from "react"; 
import { API_BASE } from "../config/api";
import "../styles/profilePage.css";

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth(); 
  const [activeTab, setActiveTab] = useState("quizzes");
  
  const [nickname, setNickname] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || "");
      setDescription(user.description || "");
    }
  }, [user]);

  const getClassName = (tabName: string) => {
    return activeTab === tabName ? "tab-item active" : "tab-item";
  };

  const handleEditBanner = () => {
    alert("Banner szerkesztése ablak megnyitása...");
  };

  const handleEditAvatar = () => {
    alert("Profilkép szerkesztése ablak megnyitása...");
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/update_profile.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({
          nickname: nickname,
          description: description
        }),
      });

      const data = await response.json();

      if (!response.ok || data.status === "error") {
        throw new Error(data.message || "Valami hiba történt a mentés során.");
      }

      alert("Profil sikeresen frissítve!");
      window.location.reload();

    } catch (error: any) {
      console.error("Mentési hiba:", error);
      alert(error.message || "Nem sikerült kapcsolódni a szerverhez.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-container">
      {/* 1. FEJLÉC SZAKASZ */}
      <header className="profile-header">
        <div className="header-banner-container">
          <div className="header-banner-background"></div>
          <button className="edit-icon-btn banner-edit" onClick={handleEditBanner} title="Banner módosítása">
            ✏️
          </button>
        </div>
        
        <div className="profile-info-row">
          <div className="profile-avatar-wrapper">
            <img 
              src={user?.profilePic || "prof_pic_placeholder.png"} 
              alt={user?.name || "User"} 
              className="profile-avatar" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = "prof_pic_placeholder.png";
              }}
            />          
            <button className="edit-icon-btn avatar-edit" onClick={handleEditAvatar} title="Profilkép módosítása">
              ✏️
            </button>
          </div>

          <div className="profile-details-and-stats">
            <div className="profile-identity">
              <div className="profile-name-tag">
                {/* Ha van beállítva nickname, azt írjuk ki, ha nincs, az alap nevet */}
                <h2>{user?.nickname || user?.name || "Felhasználó"}</h2>
              </div>
              <p className="profile-description">{user?.description || "Nincs megadva bemutatkozás."}</p>

              <div className="profile-actions">
                <button className="btn-primary">Follow</button>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">2,985</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">132</span>
                <span className="stat-label">Following</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">548</span>
                <span className="stat-label">Likes</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. AL-NAVIGÁCIÓ (Tabs) */}
      <nav className="profile-tabs">
        <button className={getClassName("quizzes")} onClick={() => setActiveTab("quizzes")}>
          Quizzes
        </button>
        <button className={getClassName("stats")} onClick={() => setActiveTab("stats")}>
          Stats
        </button>
        <button className={getClassName("settings")} onClick={() => setActiveTab("settings")}>
          Settings
        </button>
      </nav>

      {/* TARTALOM KONTÉNER */}
      <div className="profile-tabs-container">
        {activeTab === "quizzes" && (
          <div className="tab-content quizzes-content">
            <h3>Saját Kvízek</h3>
            <p>Itt fognak megjelenni a felhasználó kvízei...</p>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="tab-content stats-content">
            <h3>Statisztikák</h3>
            <p>Eredmények, kitöltött kvízek száma, pontszámok grafikonjai.</p>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="tab-content settings-content">
            <div className="settings-section">
              <h3>Fiók Beállítások</h3>
              <p className="settings-subtitle">Itt módosíthatod a profilodon megjelenő nyilvános adatokat.</p>
              
              <form className="settings-form" onSubmit={handleSaveSettings}>
                {/* BECENÉV MEZŐ */}
                <div className="form-group">
                  <label htmlFor="nickname">Becenév (Nickname)</label>
                  <input 
                    type="text" 
                    id="nickname" 
                    placeholder={user?.name || "Felhasználónév"} 
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={80} // Szinkronizálva a PHP 80-as limitjével
                  />
                  <small className="form-help">Ez a név fog megjelenni a kvízeid mellett. Ha üresen hagyod, a teljes neved látszódik.</small>
                </div>

                {/* BEMUTATKOZÁS MEZŐ */}
                <div className="form-group">
                  <label htmlFor="description">Bemutatkozás (Description)</label>
                  <textarea 
                    id="description" 
                    rows={4}
                    placeholder="Mesélj magadról pár szót..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={255} // Szinkronizálva a PHP 255-ös limitjével
                  ></textarea>
                  <small className="form-help">Maximum 255 karakter.</small>
                </div>

                {/* MENTÉS GOMB */}
                <div className="form-actions">
                  <button type="submit" className="btn-save" disabled={isSubmitting}>
                    {isSubmitting ? "Mentés..." : "Módosítások mentése"}
                  </button>
                </div>
              </form>
            </div>

            {/* VESZÉLYZÓNA (Törlés) */}
            <div className="settings-section danger-zone">
              <div className="danger-zone-header">
                <h4>Veszélyes zóna</h4>
                <p>A fiók törlése végleges és nem visszavonható folyamat. Minden kvízed és eredményed elveszik.</p>
              </div>
              <button 
                className="btn-delete" 
                onClick={() => {
                  if(confirm("Biztosan törölni szeretnéd a fiókodat? Ez a művelet nem vonható vissza!")) {
                    alert("Törlés API meghívása...");
                  }
                }}
              >
                Fiók törlése
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;