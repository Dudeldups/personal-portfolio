import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import ImprintPage from "./pages/ImprintPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/impressum",
        element: <ImprintPage />,
      },
      {
        path: "/datenschutz",
        element: <PrivacyPolicyPage />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
