import { API_BASE } from "../config/api";
import type { Quiz, QuizQuestion } from "../types/quiz";

type ApiAnswer = {
  ANSWER_TEXT: string;
  IS_CORRECT: number | string;
};

type ApiGroup = {
  ID: string;
  LEFT: string[];
  RIGHT: string[];
};

type ApiQuestion = {
  ID: string;
  QUESTION_TEXT: string;
  TYPE: "MULTIPLE_CHOICE" | "MATCHING";
  ANSWERS?: ApiAnswer[];
  GROUPS?: ApiGroup[];
};

type ApiQuizResponse = {
  QUIZ: {
    ID: string;
    TITLE: string;
    DESCRIPTION: string | null;
    QUESTIONS: ApiQuestion[];
  };
};

const toBool = (v: any) => v === 1 || v === "1" || v === true;

export async function getQuizzes(): Promise<Quiz[]> {
  const res = await fetch(`${API_BASE}/quizzes.php`, { credentials: "include" });
  const raw = await res.text();
  const data = JSON.parse(raw);

  if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);

  return (data ?? []).map((q: any) => ({
    id: q.ID ?? q.id,
    slug: q.SLUG ?? q.slug,
    title: q.TITLE ?? q.title,
    description: q.DESCRIPTION ?? q.description ?? null,
    creator_name: q.CREATOR_NAME ?? q.creator_name,
  }));
}

export async function getQuizQuestions(slugOrId: string): Promise<QuizQuestion[]> {
  const res = await fetch(`${API_BASE}/quiz.php?slug=${encodeURIComponent(slugOrId)}`, {
    credentials: "include",
  });

  const raw = await res.text();

  let json: ApiQuizResponse | null = null;
  try {
    json = JSON.parse(raw);
  } catch {
    throw new Error("Invalid JSON from quiz.php:\n" + raw.slice(0, 300));
  }

  if (!res.ok) {
    throw new Error((json as any)?.error ?? `HTTP ${res.status}`);
  }

  const apiQuestions = json?.QUIZ?.QUESTIONS ?? [];

  return apiQuestions.map((q): QuizQuestion => {
    if (q.TYPE === "MATCHING") {
      const pairs = (q.GROUPS ?? []).map((g) => ({
        left: (g.LEFT?.[0] ?? "").toString(),
        rights: (g.RIGHT ?? []).map((x) => x.toString()),
      }));

      return {
        id: q.ID,
        type: "MATCHING",
        question: q.QUESTION_TEXT,
        pairs,
      };
    }

    const answers = (q.ANSWERS ?? []).map((a) => ({
      text: a.ANSWER_TEXT,
      correct: toBool(a.IS_CORRECT),
    }));

    return {
      id: q.ID,
      type: "MULTIPLE_CHOICE",
      question: q.QUESTION_TEXT,
      answers,
    };
  });
}
