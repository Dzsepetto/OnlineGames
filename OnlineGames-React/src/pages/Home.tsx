import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import "../styles/home.css"

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="homeLayout">
      <h1>Mini Games</h1>
      <Button onClick={() => navigate("/quizzes")}>
        Quizzes
      </Button>
      <Button>
        Coming soon...
      </Button>
    </div>
  );
};

export default Home;
