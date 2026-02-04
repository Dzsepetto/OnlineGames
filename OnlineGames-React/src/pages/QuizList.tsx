import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getQuizzes } from "../services/quizService";
import type { Quiz } from "../types/quiz";
import QuizCard from "../components/quiz/QuizCard";
import { useAuth } from "../auth/AuthContext";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    getQuizzes()
      .then((data) => {
        // Most már a konzolban is látni fogod: kisbetűs kulcsok érkeznek!
        console.log("quizzes from api:", data);
        setQuizzes(data);
      })
      .catch((err) => console.error("getQuizzes error:", err));
  }, []);

  return (
    <div>
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "20px" 
      }}>
        <h2 style={{ margin: 0 }}>Select a Quiz</h2>
        {user && (
          <Link to="/create-quiz" style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
              fontWeight: "bold"
            }}> + Create Quiz </Link>
        )}
      </div>

      {quizzes.length > 0 ? (
        quizzes.map((quiz) => (
          /* JAVÍTÁS: A key most már a valódi kisbetűs 'id' értéke lesz */
          <div key={quiz.id} style={{ position: "relative", marginBottom: "10px" }}>
            <QuizCard quiz={quiz} />
            
            {quiz.creator_name && (
              <span style={{ 
                position: "absolute", 
                right: "15px", 
                bottom: "10px", 
                fontSize: "0.8rem", 
                color: "#666",
                fontStyle: "italic",
                pointerEvents: "none"
              }}>
                Created by: {quiz.creator_name}
              </span>
            )}
          </div>
        ))
      ) : (
        <p>No quizzes available.</p>
      )}
    </div>
  );
};

export default QuizList;