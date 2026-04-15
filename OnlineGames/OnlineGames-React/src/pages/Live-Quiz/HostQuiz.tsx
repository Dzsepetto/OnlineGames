import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizMeta } from "../../services/quizService";
import { API_BASE } from "../../config/api";
import type { QuizMeta } from "../../types/quiz";

type Player = {
  id: number;
  name: string;
  score: number;
};

type Question = {
  id: string;
  text: string;
  type: string;
  answers?: { id: string; text: string }[];
};

export default function HostQuiz() {
  const { slug } = useParams<{ slug: string }>();

  const [meta, setMeta] = useState<QuizMeta | null>(null);
  const [gamePin, setGamePin] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [state, setState] = useState<string>("lobby");
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [question, setQuestion] = useState<Question | null>(null);

  // ❗ slug guard
  if (!slug) {
    return <div>Invalid quiz</div>;
  }

  // 🔥 QUIZ META LOAD
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getQuizMeta(slug);
        setMeta(data);
      } catch (err) {
        console.error("Meta load error:", err);
      }
    };

    load();
  }, [slug]);

  // 🎮 CREATE GAME
  const handleCreateGame = async () => {
    try {
      const res = await fetch(`${API_BASE}/live-quiz/create-game.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quiz_id: slug,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("API error:", text);
        return;
      }

      const data = await res.json();

      if (!data.ok) {
        console.error("Backend error:", data);
        return;
      }

      setGamePin(data.pin);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔁 POLLING
  useEffect(() => {
    if (!gamePin) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/live-quiz/get-game-state.php?pin=${gamePin}`
        );

        const data = await res.json();

        setPlayers(data.players || []);
        setState(data.game?.state || "lobby");
        setQuestionIndex(data.game?.current_question_index || 0);
        setQuestion(data.question || null);
      } catch (err) {
        console.error(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [gamePin]);

  // ▶️ START GAME
  const handleStartGame = async () => {
    try {
      await fetch(`${API_BASE}/live-quiz/start-game.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin: gamePin }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ⏭ NEXT QUESTION
  const handleNextQuestion = async () => {
    try {
      await fetch(`${API_BASE}/live-quiz/next-question.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin: gamePin }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>Host Quiz</h1>

      {/* 🔥 QUIZ INFO */}
      <p style={{ opacity: 0.7 }}>
        Hosting quiz: <b>{meta?.title ?? "Loading..."}</b>
      </p>

      {/* 🎮 CREATE */}
      {!gamePin ? (
        <button onClick={handleCreateGame}>
          Start Quiz
        </button>
      ) : (
        <div>
          <h2>Game PIN:</h2>
          <h1 style={{ fontSize: "3rem" }}>{gamePin}</h1>

          {/* 👥 PLAYERS */}
          <h3>Players:</h3>
          {players.length === 0 && <p>No players yet...</p>}

          {players.map((p) => (
            <div key={p.id}>{p.name}</div>
          ))}

          {/* 🎯 STATE */}
          <p>State: {state}</p>
          <p>Question: {questionIndex + 1}</p>

          {/* ▶️ START */}
          {state === "lobby" && (
            <button onClick={handleStartGame}>
              Start Game
            </button>
          )}

          {/* ❓ QUESTION DISPLAY (Kahoot host view) */}
          {state === "playing" && question && (
            <div style={{ marginTop: 40 }}>
              <h2>{question.text}</h2>

              <div style={{ marginTop: 20 }}>
                {question.answers?.map((a) => (
                  <div
                    key={a.id}
                    style={{
                      margin: 10,
                      padding: 10,
                      border: "1px solid #ccc",
                      borderRadius: 10,
                    }}
                  >
                    {a.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ⏭ NEXT */}
          {state === "playing" && (
            <button
              onClick={handleNextQuestion}
              style={{ marginTop: 30 }}
            >
              Next Question →
            </button>
          )}
        </div>
      )}
    </div>
  );
}