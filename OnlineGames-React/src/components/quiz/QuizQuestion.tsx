import type { QuizQuestion } from "../../types/quiz";


const QuizQuestionComponent = ({
  question,
  onAnswer,
}: {
  question: QuizQuestion;
  onAnswer: (correct: boolean) => void;
}) => (
  <div className="quiz-question">
    <h3>{question.question}</h3>
    
  <div className="quiz-answers">
    {question.answers.map((a, i) => (
      <button
        key={i}
        onClick={() => onAnswer(i === question.correctIndex)}
      >
        {a}
      </button>
    ))}
    </div>
  </div>
);

export default QuizQuestionComponent;
