import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1>Mini Games</h1>
      <Button onClick={() => navigate("/quizzes")}>
        Quizzes
      </Button>
    </>
  );
};

export default Home;
