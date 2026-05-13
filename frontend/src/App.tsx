import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./i18n/i18n";

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return <Outlet />;
}

export default App;
