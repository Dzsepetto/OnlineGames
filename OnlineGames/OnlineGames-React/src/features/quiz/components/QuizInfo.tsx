import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getQuizMeta, getQuizResults } from "../services/quizService";
import { useAuth } from "../../../auth/AuthContext";
import QuizCountdownModal from "./QuizCountdownModal";
import type { QuizMeta, QuizResultRow } from "../types/quiz";

const QuizInfo = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [showCountdown, setShowCountdown] = useState(false);
  const [quiz, setQuiz] = useState<QuizMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [results, setResults] = useState<QuizResultRow[]>([]);
  const [resultsLoading, setResultsLoading] = useState(false);

  const goToProfile = (nickname?: string | null) => {
    if (!nickname) return;
    navigate(`/profile/${encodeURIComponent(nickname)}`);
  };

  useEffect(() => {
    if (!slug) return;

    const load = async () => {
      try {
        setLoading(true);

        const meta = await getQuizMeta(slug);
        setQuiz(meta);

        if (user) {
          setResultsLoading(true);
          const r = await getQuizResults(slug);
          setResults(r.results ?? []);
        }
      } catch (e: any) {
        setError(e?.message ?? "Failed to load quiz");
      } finally {
        setLoading(false);
        setResultsLoading(false);
      }
    };

    load();
  }, [slug, user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!quiz) return <div>Quiz not found</div>;

  return (
    <>
      <div
        style={{
          maxWidth: 700,
          margin: "40px auto",
          textAlign: "center",
          position: "relative",
        }}
      >
        {quiz.creator_name && (
          <div
            onClick={() => goToProfile(quiz.creator_nickname)}
            style={{
              position: "absolute",
              top: 0,
              right: -220,
              width: 190,
              padding: 14,
              borderRadius: 14,
              background: "#f6f6f6",
              border: "1px solid #ddd",
              cursor: quiz.creator_nickname ? "pointer" : "default",
              textAlign: "left",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            <div style={{ fontSize: 12, color: "#777", marginBottom: 4 }}>
              Created by
            </div>
            <strong>{quiz.creator_name}</strong>
            {quiz.creator_nickname && (
              <div style={{ fontSize: 13, color: "#6a0dad", marginTop: 4 }}>
                @{quiz.creator_nickname}
              </div>
            )}
          </div>
        )}

        <h1>{quiz.title}</h1>

        <p style={{ marginTop: 20 }}>{quiz.description}</p>

        <button
          disabled={showCountdown}
          style={{
            marginTop: 30,
            padding: "12px 30px",
            fontSize: 18,
            borderRadius: 8,
            background: "#28a745",
            color: "white",
            border: "none",
            cursor: "pointer",
            opacity: showCountdown ? 0.6 : 1,
            margin: 20,
          }}
          onClick={() => setShowCountdown(true)}
        >
          ▶ Start Quiz
        </button>

        <button
          style={{
            marginTop: 30,
            padding: "12px 30px",
            fontSize: 18,
            borderRadius: 8,
            background: "Dark Orchid",
            color: "white",
            border: "none",
            cursor: "pointer",
            opacity: showCountdown ? 0.6 : 1,
          }}
          onClick={() => navigate(`/host/${slug}`)}
        >
          ▶ Host Quiz
        </button>

        <div style={{ marginTop: 40, textAlign: "left" }}>
          <h2 style={{ textAlign: "center" }}>🏆 Leaderboard</h2>

          {!user && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              Jelentkezz be az eredmények megtekintéséhez.
            </div>
          )}

          {user && (
            <>
              {resultsLoading && (
                <div style={{ textAlign: "center" }}>Loading results...</div>
              )}

              {!resultsLoading && results.length === 0 && (
                <div style={{ textAlign: "center", opacity: 0.8 }}>
                  Még nincs eredmény ehhez a kvízhez.
                </div>
              )}

              {!resultsLoading && results.length > 0 && (
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      marginTop: 14,
                    }}
                  >
                    <thead>
                      <tr>
                        <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #ddd" }}>#</th>
                        <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #ddd" }}>User</th>
                        <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #ddd" }}>Score</th>
                        <th style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #ddd" }}>When</th>
                      </tr>
                    </thead>

                    <tbody>
                      {results.slice(0, 10).map((r, idx) => (
                        <tr key={`${r.user_id}-${idx}`}>
                          <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                            {idx + 1}
                          </td>

                          <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                            <button
                              type="button"
                              onClick={() => goToProfile(r.user_nickname)}
                              style={{
                                border: "none",
                                background: "transparent",
                                padding: 0,
                                cursor: r.user_nickname ? "pointer" : "default",
                                color: r.user_nickname ? "#6a0dad" : "inherit",
                                fontWeight: 700,
                              }}
                            >
                              {r.user_name}
                            </button>
                          </td>

                          <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                            {r.score} / {r.max_score}
                          </td>

                          <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>
                            {r.created_at}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {showCountdown && slug && (
        <QuizCountdownModal
          seconds={3}
          onComplete={() => {
            setShowCountdown(false);
            navigate(`/play/${slug}`);
          }}
        />
      )}
    </>
  );
};

export default QuizInfo;