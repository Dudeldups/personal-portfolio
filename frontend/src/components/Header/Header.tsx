import LanguageSwitcher from "./LanguageSwitcher";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="px-page flex w-full items-center py-5">
      <a href="/" className="mr-auto font-oswald text-2xl">
        <span className="text-primary">A</span>rne{" "}
        <span className="text-accent">J</span>
        acob
      </a>
      <Navbar />

      <LanguageSwitcher />
    </header>
  );
};

export default Header;
