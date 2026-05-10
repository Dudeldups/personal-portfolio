import Meta from "./Meta";
import { Outlet } from "react-router-dom";
import "./i18n/i18n";

function App() {
  return (
    <>
      <Meta />
      <Outlet />
    </>
  );
}

export default App;
