import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css'

import TelaPrincipal from "./pages/telaPrincipal";
import LoginPage from "./pages/login";
import AtividadesTurma
 from "./pages/atividadesTurma";
const router = createBrowserRouter([

  {
    path: "/telaPrincipal",
    element:  <TelaPrincipal />,
  },

  {
    path: "/login",
    element: <LoginPage />
  },

  {
    path: "/atividades",
    element: <AtividadesTurma />
  }


]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)