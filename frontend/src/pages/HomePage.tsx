import Contact from "../components/Contact/Contact";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import Intro from "../components/Intro/Intro";
import Projects from "../components/Projects/Projects";
import Skills from "../components/Skills/Skills";
import Updates from "../components/Updates/Updates";

const HomePage = () => {
  return (
    <div className="mx-auto flex min-h-screen max-w-page flex-col items-start justify-center lg:flex-row">
      <Header />

      <div className="w-full">
        <main>
          <Intro />
          <Skills />
          <Projects />
          <Updates />
          <Contact />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
