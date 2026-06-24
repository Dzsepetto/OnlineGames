import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getQuizzes } from "../services/quizService";
import QuizCard from "../components/QuizCard";
import { useAuth } from "../../../auth/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../styles/QuizList.css";

import type { Quiz } from "../types/quiz";

const QuizList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");

  const load = async () => {
    try {
      const data: Quiz[] = await getQuizzes();
      setQuizzes(data ?? []);
    } catch (err) {
      console.error("getQuizzes error:", err);
      setQuizzes([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredQuizzes =
    selectedLanguage === "all"
      ? quizzes
      : quizzes.filter(
          (q) =>
            q.language?.toLowerCase() ===
            selectedLanguage.toLowerCase()
        );

  return (
    <div className="quizlist-container">
      {/* ================= HEADER ================= */}
      <div className="quizlist-header">
        <div className="quizlist-left">
          <select
            className="quiz-language-select"
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="all">
              🌍 {t("quizList.all")}
            </option>
            <option value="hu">🇭🇺 Magyar</option>
            <option value="en">🇬🇧 English</option>
          </select>
        </div>

        <div className="quizlist-center">
          <h2 className="quizlist-title">
            {t("quizList.title")}
          </h2>
        </div>

        <div className="quizlist-right">
          <button  className="join-live-btn" onClick={() => navigate("/join")} >
              ⚡ {t("quizList.joinLive") || "Join Live Quiz"}
          </button>

          {user && (
            <Link to="/create-quiz" className="create-quiz-btn">
              + {t("quizList.create")}
            </Link>
          )}
        </div>
      </div>

      {/* ================= QUIZ LIST ================= */}
      {filteredQuizzes.length > 0 ? (
        <div className="profile-quiz-grid">
          {filteredQuizzes.map((quiz) => (
            <div key={quiz.id} className="quiz-wrapper">
              <QuizCard quiz={quiz} />

              {quiz.creator_name && (
                <span className="creator-name">
                  {t("quizList.createdBy")}: {quiz.creator_name}
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>{t("quizList.noQuizzes")}</p>
      )}
    </div>
  );
};

export default QuizList;