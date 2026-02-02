import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizQuestions } from "../services/quizService";
import type { QuizQuestion } from "../types/quiz";
import QuizQuestionComponent from "../components/quiz/QuizQuestion";
import QuizResult from "../components/quiz/QuizResult";

const QuizPlay = () => {
  const { id } = useParams();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (id) getQuizQuestions(id).then(setQuestions);
  }, [id]);

  if (current >= questions.length)
    return <QuizResult score={score} total={questions.length} />;

  return (
    <QuizQuestionComponent
      question={questions[current]}
      onAnswer={(correct) => {
        if (correct) setScore((s) => s + 1);
        setCurrent((c) => c + 1);
      }}
    />
  );
};

export default QuizPlay;
