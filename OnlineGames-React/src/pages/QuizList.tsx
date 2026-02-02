import { useEffect, useState } from "react";
import { getQuizzes } from "../services/quizService";
import type { Quiz } from "../types/quiz";
import QuizCard from "../components/quiz/QuizCard";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    getQuizzes().then(setQuizzes);
  }, []);

  return (
    <>
      <h2>Select a Quiz</h2>
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </>
  );
};

export default QuizList;
