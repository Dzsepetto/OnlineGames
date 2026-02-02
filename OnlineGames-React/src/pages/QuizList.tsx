import { useEffect, useState } from "react";
import { getQuizzes } from "../services/quizService";
import type { Quiz } from "../types/quiz";
import QuizCard from "../components/quiz/QuizCard";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    // #Log if needed
    console.log("QuizList mounted");
    getQuizzes()
      .then((data) => {
        // #Log if needed
         console.log("quizzes from api:", data);
        setQuizzes(data);
      })
      .catch((err) => {
        // #Log if needed
        console.error("getQuizzes error:", err);
      });
  }, []);

  return (
    <div>
      <h2>Select a Quiz</h2>
      {quizzes.map((quiz) => (
        <QuizCard key={quiz.id} quiz={quiz} />
      ))}
    </div>
  );
};

export default QuizList;
