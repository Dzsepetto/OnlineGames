import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import QuizList from "../pages/QuizList";
import QuizPlay from "../pages/QuizPlay";
import NotFound from "../pages/NotFound";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/quizzes", element: <QuizList /> },
      { path: "/quiz/:slug", element: <QuizPlay /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
 