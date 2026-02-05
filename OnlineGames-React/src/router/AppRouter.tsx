import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import QuizList from "../pages/QuizList";
import QuizPlay from "../pages/QuizPlay";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import CreateQuiz from "../pages/CreateQuiz";
import EditQuiz from "../pages/EditQuiz";


export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/quizzes", element: <QuizList /> },
      { path: "/quiz/:slug", element: <QuizPlay /> },
       { path: "/login", element: <Login /> },
       { path: "/create-quiz", element: <CreateQuiz /> }, 
      { path:"/edit-quiz/:id", element: <EditQuiz />} 

       
    ],
  },
  { path: "*", element: <NotFound /> },
]);
 