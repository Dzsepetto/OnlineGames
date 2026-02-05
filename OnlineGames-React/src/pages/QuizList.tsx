import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getQuizzes, deleteQuiz } from "../services/quizService";
import type { Quiz } from "../types/quiz";
import QuizCard from "../components/quiz/QuizCard";
import { useAuth } from "../auth/AuthContext";

const QuizList = () => {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user } = useAuth();

  const load = async () => {
    try {
      const data = await getQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error("getQuizzes error:", err);
      setQuizzes([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (quiz: Quiz) => {
    if (!quiz.id) return;

    const ok = confirm(`Biztos törlöd a kvízt?\n\n${quiz.title}`);
    if (!ok) return;

    try {
      setDeletingId(quiz.id);
      await deleteQuiz(quiz.id);
      setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
    } catch (e: any) {
      alert(e?.message ?? "Törlés sikertelen");
    } finally {
      setDeletingId(null);
    }
  };

  const userId = user?.id != null ? String(user.id) : null;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>Select a Quiz</h2>

        {user && (
          <Link
            to="/create-quiz"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
              fontWeight: "bold",
            }}
          >
            + Create Quiz
          </Link>
        )}
      </div>

      {quizzes.length > 0 ? (
        quizzes.map((quiz) => {
          const createdBy = (quiz as any).created_by ?? (quiz as any).CREATED_BY ?? null;

          const isOwner =
            userId != null &&
            createdBy != null &&
            String(createdBy) === userId;

          return (
            <div key={quiz.id} style={{ position: "relative", marginBottom: "10px" }}>
              {isOwner && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    display: "flex",
                    gap: "8px",
                    zIndex: 10,
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/edit-quiz/${quiz.id}`);
                    }}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      background: "green",
                      cursor: "pointer",
                    }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(quiz);
                    }}
                    disabled={deletingId === quiz.id}
                    style={{
                      padding: "6px 10px",
                      borderRadius: "6px",
                      border: "1px solid #dc3545",
                      background: "#dc3545",
                      color: "white",
                      cursor: deletingId === quiz.id ? "not-allowed" : "pointer",
                      opacity: deletingId === quiz.id ? 0.7 : 1,
                    }}
                  >
                    {deletingId === quiz.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              )}

              <QuizCard quiz={quiz} />

              {quiz.creator_name && (
                <span
                  style={{
                    position: "absolute",
                    right: "15px",
                    bottom: "10px",
                    fontSize: "0.8rem",
                    color: "#666",
                    fontStyle: "italic",
                    pointerEvents: "none",
                  }}
                >
                  Created by: {quiz.creator_name}
                </span>
              )}
            </div>
          );
        })
      ) : (
        <p>No quizzes available.</p>
      )}
    </div>
  );
};

export default QuizList;
