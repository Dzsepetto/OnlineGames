import { useTranslation } from "react-i18next";
import { useAuth } from "../auth/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE } from "../config/api";
import { deleteQuiz } from "../features/quiz/services/quizService";
import { getProfile } from "../features/user/userServices";
import QuizCard from "../features/quiz/components/QuizCard";
import type { Quiz } from "../features/quiz/types/quiz";
import "../styles/profilePage.css";

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { nickname: profileNickname } = useParams();

  const [activeTab, setActiveTab] = useState("quizzes");
  const [nickname, setNickname] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [profile, setProfile] = useState<any>(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [myQuizzes, setMyQuizzes] = useState<Quiz[]>([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile(profileNickname);

        setProfile(data.profile);
        setIsOwnProfile(data.is_own_profile);
        setIsFollowing(data.is_following);
        setFollowersCount(data.followers_count || 0);
        setFollowingCount(data.following_count || 0);

        setNickname(data.profile?.nickname || "");
        setDescription(data.profile?.description || "");
      } catch (error) {
        console.error("Profil betöltési hiba:", error);
      }
    };

    loadProfile();
  }, [profileNickname]);

  const fetchMyQuizzes = async () => {
    if (!isOwnProfile) return;

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
    if (activeTab === "quizzes" && isOwnProfile) {
      fetchMyQuizzes();
    }
  }, [activeTab, isOwnProfile]);

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

    if (isSubmitting || !isOwnProfile) return;

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
      <header className="profile-header">
        <div className="header-banner-container">
          <div className="header-banner-background"></div>

          {isOwnProfile && (
            <button className="edit-icon-btn banner-edit" onClick={handleEditBanner}>
              ✏️
            </button>
          )}
        </div>

        <div className="profile-info-row">
          <div className="profile-avatar-wrapper">
            <img
              src={profile?.profilePic || "/prof_pic_placeholder.png"}
              alt={profile?.name || "User"}
              className="profile-avatar"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/prof_pic_placeholder.png";
              }}
            />

            {isOwnProfile && (
              <button className="edit-icon-btn avatar-edit" onClick={handleEditAvatar}>
                ✏️
              </button>
            )}
          </div>

          <div className="profile-details-and-stats">
            <div className="profile-identity">
              <div className="profile-name-tag">
                <h2>{profile?.nickname || profile?.name || "Felhasználó"}</h2>
              </div>

              <p className="profile-description">
                {profile?.description || "Nincs megadva bemutatkozás."}
              </p>

              {!isOwnProfile && (
                <div className="profile-actions">
                  <button className="btn-primary">
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              )}
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-value">{followersCount}</span>
                <span className="stat-label">Followers</span>
              </div>

              <div className="stat-item">
                <span className="stat-value">{followingCount}</span>
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

      <nav className="profile-tabs">
        <button className={getClassName("quizzes")} onClick={() => setActiveTab("quizzes")}>
          Quizzes
        </button>

        <button className={getClassName("stats")} onClick={() => setActiveTab("stats")}>
          Stats
        </button>

        {isOwnProfile && (
          <button className={getClassName("settings")} onClick={() => setActiveTab("settings")}>
            Settings
          </button>
        )}
      </nav>

      <div className="profile-tabs-container">
        {activeTab === "quizzes" && (
          <div className="tab-content quizzes-content">
            <div className="quizzes-header-row">
              <h3>{isOwnProfile ? "Saját Kvízek" : "Felhasználó kvízei"}</h3>
            </div>

            {!isOwnProfile ? (
              <p className="no-data-msg">
                Más felhasználók publikus kvízeinek lekérése még nincs bekötve.
              </p>
            ) : isLoadingQuizzes ? (
              <div className="profile-loading">Kvízek betöltése...</div>
            ) : myQuizzes.length === 0 ? (
              <p className="no-data-msg">Még nem hoztál létre egyetlen kvízt sem.</p>
            ) : (
              <div className="profile-quiz-grid">
                {myQuizzes.map((quiz) => (
                  <div key={quiz.id} className="quiz-wrapper">
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

        {activeTab === "settings" && isOwnProfile && (
          <div className="tab-content settings-content">
            <div className="settings-section">
              <h3>Fiók Beállítások</h3>
              <p className="settings-subtitle">
                Itt módosíthatod a profilodon megjelenő nyilvános adatokat.
              </p>

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
                  />
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
                <p>
                  A fiók törlése végleges és nem visszavonható folyamat. Minden kvízed
                  és eredményed elveszik.
                </p>
              </div>

              <button
                className="btn-delete"
                onClick={() => {
                  if (
                    confirm(
                      "Biztosan törölni szeretnéd a fiókodat? Ez a művelet nem vonható vissza!"
                    )
                  ) {
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