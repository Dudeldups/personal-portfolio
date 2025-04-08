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
    <div className="mx-auto flex min-h-screen max-w-page flex-col items-start justify-center lg:flex-row">
      <Meta />

      <Header />

      <div className="">
        <main className="">
          <Intro />
          <Skills />
          <Projects />
          <Contact />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
