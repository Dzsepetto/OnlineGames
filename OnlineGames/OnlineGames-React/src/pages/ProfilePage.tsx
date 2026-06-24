import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/AuthContext";
import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";
import { deleteQuiz } from "../features/quiz/services/quizService";
import QuizCard from "../features/quiz/components/QuizCard";  
import type { Quiz } from "../features/quiz/types/quiz";        
import "../styles/profilePage.css";

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth(); 
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState("quizzes");
  const [nickname, setNickname] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- KVÍZ STATE-EK ---
  const [myQuizzes, setMyQuizzes] = useState<Quiz[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setNickname(user.nickname || "");
      setDescription(user.description || "");
    }
  }, [user]);

  // --- KVÍZEK BETÖLTÉSE ---
 const fetchMyQuizzes = async () => {
  setIsLoadingQuizzes(true);
  try {
    const response = await fetch(`${API_BASE}/quizzes.php?mode=mine`, {
      method: "GET",
      credentials: "include",
    });
    const data = await response.json();
    if (response.ok && data.success === true) {
      setMyQuizzes(data.data?.quizzes || []);
    }
  } catch (error) {
    console.error("Hiba a kvízek betöltésekor:", error);
  } finally {
    setIsLoadingQuizzes(false);
  }
};

useEffect(() => {
  if (activeTab === "quizzes") {
    fetchMyQuizzes();
  }
}, [activeTab]);

useEffect(() => {
  fetchMyQuizzes();
}, []);

  // --- TÖRLÉS LOGIKA ---
  const onDelete = async (quiz: Quiz) => {
    if (!quiz.id) return;

    const ok = window.confirm(
      `${t("quizList.deleteConfirm") || "Biztosan törölni szeretnéd ezt a kvízt?"}\n\n${quiz.title}`
    );
    if (!ok) return;

    try {
      setDeletingId(quiz.id);
      await deleteQuiz(quiz.id);
      setMyQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
    } catch (e: any) {
      alert(e?.message || t("quizList.deleteError") || "Nem sikerült a kvíz törlése.");
    } finally {
      setDeletingId(null);
    }
  };

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
        headers: { "Content-Type": "application/json" },
        credentials: "include", 
        body: JSON.stringify({ nickname, description }),
      });

      const data = await response.json();
      if (!response.ok || data.status === "error") {
        throw new Error(data.message || "Valami hiba történt.");
      }

      alert("Profil sikeresen frissítve!");
      window.location.reload();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Hiba történt.");
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
          <button className="edit-icon-btn banner-edit" onClick={handleEditBanner}>✏️</button>
        </div>
        
        <div className="profile-info-row">
          <div className="profile-avatar-wrapper">
            <img 
              src={user?.profilePic || "prof_pic_placeholder.png"} 
              alt={user?.name || "User"} 
              className="profile-avatar" 
              onError={(e) => { (e.target as HTMLImageElement).src = "prof_pic_placeholder.png"; }}
            />          
            <button className="edit-icon-btn avatar-edit" onClick={handleEditAvatar}>✏️</button>
          </div>

          <div className="profile-details-and-stats">
            <div className="profile-identity">
              <div className="profile-name-tag">
                <h2>{user?.nickname || user?.name || "Felhasználó"}</h2>
              </div>
              <p className="profile-description">{user?.description || "Nincs megadva bemutatkozás."}</p>
              <div className="profile-actions">
                <button className="btn-primary">Follow</button>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-item"><span className="stat-value">2,985</span><span className="stat-label">Followers</span></div>
              <div className="stat-item"><span className="stat-value">132</span><span className="stat-label">Following</span></div>
              <div className="stat-item"><span className="stat-value">548</span><span className="stat-label">Likes</span></div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. AL-NAVIGÁCIÓ (Tabs) */}
      <nav className="profile-tabs">
        <button className={getClassName("quizzes")} onClick={() => setActiveTab("quizzes")}>Quizzes</button>
        <button className={getClassName("stats")} onClick={() => setActiveTab("stats")}>Stats</button>
        <button className={getClassName("settings")} onClick={() => setActiveTab("settings")}>Settings</button>
      </nav>

      {/* TARTALOM KONTÉNER */}
      <div className="profile-tabs-container">
        
        {/* === QUIZZES TAB === */}
        {activeTab === "quizzes" && (
          <div className="tab-content quizzes-content">
            <div className="quizzes-header-row">
              <h3>Saját Kvízek</h3>
            </div>
            
            {isLoadingQuizzes ? (
              <div className="profile-loading">Kvízek betöltése...</div>
            ) : myQuizzes.length === 0 ? (
              <p className="no-data-msg">Még nem hoztál létre egyetlen kvízt sem.</p>
            ) : (
              <div className="profile-quiz-grid">
                {myQuizzes.map((quiz) => (
                  <div key={quiz.id} className="quiz-wrapper">
                    
                    {/* Beágyazott akciópanel (Szerkesztés és Törlés) */}
                    <div className="quiz-actions">
                      <button
                        className="settings-btn"
                        onClick={(e) => {
                          e.stopPropagation(); 
                          navigate(`/edit-quiz/${quiz.id}`);
                        }}
                      >
                        ✏
                      </button>

                      <button
                        className="delete-btn"
                        disabled={deletingId === quiz.id}
                        onClick={(e) => {
                          e.stopPropagation(); 
                          onDelete(quiz);
                        }}
                      >
                        {deletingId === quiz.id ? "..." : "🗑"}
                      </button>
                    </div>

                    {/* A te QuizCard komponensed – már natívan a helyes Quiz típussal, casting nélkül */}
                    <QuizCard quiz={quiz} />

                    {quiz.creator_name && (
                      <span className="creator-name">
                        {t("quizList.createdBy")}: {quiz.creator_name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
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
                <div className="form-group">
                  <label htmlFor="nickname">Becenév (Nickname)</label>
                  <input 
                    type="text" 
                    id="nickname" 
                    placeholder={user?.name || "Felhasználónév"} 
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={80}
                  />
                  <small className="form-help">Ez a név fog megjelenni a kvízeid mellett. Ha üresen hagyod, a teljes neved látszódik.</small>
                </div>

                <div className="form-group">
                  <label htmlFor="description">Bemutatkozás (Description)</label>
                  <textarea 
                    id="description" 
                    rows={4}
                    placeholder="Mesélj magadról pár szót..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={255}
                  ></textarea>
                  <small className="form-help">Maximum 255 karakter.</small>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-save" disabled={isSubmitting}>
                    {isSubmitting ? "Mentés..." : "Módosítások mentése"}
                  </button>
                </div>
              </form>
            </div>

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