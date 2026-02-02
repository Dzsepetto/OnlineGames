import type { Quiz,QuizQuestion } from "../types/quiz";


export const getQuizzes = async (): Promise<Quiz[]> => {
  // KÉSŐBB: fetch("/api/quizzes")
  return [
    { id: "1", title: "Quiz 1", description: "Nagy Alekosz" },
    { id: "2", title: "Quiz 2", description: "Gaming quiz" },
    { id: "3", title: "Quiz 3", description: "Tech quiz" },
  ];
};

export const getQuizQuestions = async (
  quizId: string
): Promise<QuizQuestion[]> => {
  // KÉSŐBB: fetch(`/api/quizzes/${quizId}`)
  return [
    {
      id: "q1",
      question: "Mi nem volt Nagy Alekosz",
      answers: ["Békaember", "Civil Politikai Elemző", "Gróf", "Focista"],
      correctIndex: 3,
    },
    {
      id: "q2",
      question: "Hol biztonságiőr most Nagy Alekosz?",
      answers: ["RTL", "ITT, a 3-as portán", "HBO", "NAV"],
      correctIndex: 1,
    },
  ];
};
