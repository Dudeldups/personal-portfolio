import LanguageSwitcher from "./LanguageSwitcher";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <header className="w-full">
      <a href="/" className="font-bebas text-2xl font-bold">
        Arne Jacob
      </a>
      <Navbar />

      <LanguageSwitcher />
    </header>
  );
};

export default Header;
