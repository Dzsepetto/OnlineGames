import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizQuestions, getQuizMeta, saveQuizResult } from "../services/quizService";
import type { QuizQuestion } from "../types/quiz";
import QuizQuestionComponent from "../components/quiz/QuizQuestion";
import QuizMatchingQuestion from "../components/quiz/QuizMatchingQuestion";
import QuizResult from "../components/quiz/QuizResult";

const QuizPlay = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ quiz meta (ID kell az upserthez)
  const [quizId, setQuizId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const { slug } = useParams();

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("Missing quiz slug in route params");
      return;
    }

    setLoading(true);
    setError(null);

    Promise.all([getQuizQuestions(slug), getQuizMeta(slug)])
      .then(([qs, meta]) => {
        setQuestions(qs);
        setQuizId(meta?.id ?? "");
        setCurrent(0);
        setScore(0);

        // reset save state
        setSaved(false);
        setSaving(false);
        setSaveError(null);
      })
      .catch((err) => {
        setError(err?.message ?? "Failed to load quiz");
        setQuestions([]);
        setQuizId("");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // ✅ amikor vége, mentsünk (csak egyszer)
  useEffect(() => {
    const finished = questions.length > 0 && current >= questions.length;

    if (!finished) return;
    if (!quizId) return;
    if (saved || saving) return;

    setSaving(true);
    setSaveError(null);

    saveQuizResult({
      quiz_id: quizId,
      score,
      max_score: questions.length,
    })
      .then(() => setSaved(true))
      .catch((e: any) => setSaveError(e?.message ?? "Failed to save result"))
      .finally(() => setSaving(false));
  }, [current, questions.length, quizId, saved, saving, score]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (questions.length === 0) return <div>No questions found for this quiz.</div>;

  if (current >= questions.length) {
    return (
      <div>
        <QuizResult score={score} total={questions.length} />

        <div style={{ marginTop: 12, opacity: 0.85 }}>
          {saving && <div>Saving result...</div>}
          {saved && <div>✅ Result saved!</div>}
          {saveError && <div style={{ color: "crimson" }}>❌ {saveError}</div>}
        </div>
      </div>
    );
  }

  const q = questions[current];

  const handleAnswered = (correct: boolean) => {
    if (correct) setScore((s) => s + 1);
    setCurrent((c) => c + 1);
  };

  return (
    <div className="quiz-play">
      <div className="quiz-play-header">
        <div className="quiz-progress">
          Kérdés: {current + 1} / {questions.length}
        </div>

        <div className="quiz-score">Pont: {score}</div>
      </div>

      {q.type === "MATCHING" ? (
        <QuizMatchingQuestion question={q} onAnswer={handleAnswered} />
      ) : (
        <QuizQuestionComponent question={q} onAnswer={handleAnswered} />
      )}
    </div>
  );
};

export default QuizPlay;
