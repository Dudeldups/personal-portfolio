import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Intro from "./components/Intro/Intro";
import Projects from "./components/Projects/Projects";
import Skills from "./components/Skills/Skills";
import Meta from "./Meta";
import "./i18n/i18n";

function App() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <Meta />

      <Header />

      <main className="w-full flex-1">
        <Intro />
        <Skills />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;
