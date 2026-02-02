import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/AppRouter";
import "./styles/globals.css";
import "./styles/layout.css";
import "./styles/buttons.css";
import "./styles/cards.css";
import "./styles/quiz.css";




ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
