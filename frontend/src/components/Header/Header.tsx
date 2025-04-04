import { useEffect, useRef } from "react";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";

const Header = () => {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > 0) {
          headerRef.current.classList.add(
            "bg-dark-light",
            "shadow-lg",
            "shadow-darkest",
          );
          headerRef.current.classList.remove("bg-darkest");
        } else {
          headerRef.current.classList.remove(
            "bg-dark-light",
            "shadow-lg",
            "shadow-darkest",
          );
          headerRef.current.classList.add("bg-darkest");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-100 w-full bg-darkest px-page backdrop-blur-sm transition-colors duration-300"
    >
      <div className="mx-auto flex max-w-page items-center py-5">
        <a href="#" className="mr-auto font-oswald text-2xl sm:text-3xl">
          <span className="text-primary">A</span>rne{" "}
          <span className="text-accent">J</span>
          acob
        </a>

        <Navbar />
        <MobileNavbar />
      </div>
    </header>
  );
};

export default Header;
