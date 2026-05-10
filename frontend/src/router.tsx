import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";

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
        lazy: async () => {
          const module = await import("./pages/ImprintPage");
          return { Component: module.default };
        },
      },
      {
        path: "/datenschutz",
        lazy: async () => {
          const module = await import("./pages/PrivacyPolicyPage");
          return { Component: module.default };
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
