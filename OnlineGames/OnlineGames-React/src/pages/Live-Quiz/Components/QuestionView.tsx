import { useEffect, useState } from "react";
import "../../../styles/Live-Quiz/questionView.css";

const colors = ["#e21b3c", "#1368ce", "#d89e00", "#26890c"];

export default function QuestionView({ question, onAnswer }: any) {
  const [hasAnswered, setHasAnswered] = useState(false);

  // 🔁 reset új kérdésnél
  useEffect(() => {
    setHasAnswered(false);
  }, [question?.id]);

  if (!question) return <div className="question-loading">Loading...</div>;

  const handleClick = (answerId: string) => {
    if (hasAnswered) return;

    onAnswer(answerId);
    setHasAnswered(true);
  };

  return (
    <div className="question-container">
      {question.answers?.map((a: any, index: number) => (
        <button
          key={a.id}
          onClick={() => handleClick(a.id)}
          disabled={hasAnswered}
          className="answer-btn"
          style={{
            backgroundColor: colors[index % colors.length],
          }}
        />
      ))}
    </div>
  );
}