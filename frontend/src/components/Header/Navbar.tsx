import { useTranslation } from "react-i18next";
import { KEYS } from "../../i18n/KEYS";
import { useInView } from "motion/react";
import { useRefStore } from "../../stores/refStore";
import { motion } from "framer-motion";

const spanVariants = {
  initial: {
    width: "3rem",
    backgroundColor: "var(--color-light)",
  },
  visible: {
    width: "4rem",
    backgroundColor: "var(--color-primary)",
    transition: { duration: 0.3 },
  },
};

const Navbar = () => {
  const { t } = useTranslation();
  const aboutRef = useRefStore((state) => state.refs["about"]);
  const projectsRef = useRefStore((state) => state.refs["projects"]);
  const contactRef = useRefStore((state) => state.refs["contact"]);

  const isAboutInView = useInView(aboutRef ?? { current: null });
  const isProjectsInView = useInView(projectsRef ?? { current: null }, {
    margin: "-50% 0px 0px 0px",
  });
  const isContactInView = useInView(contactRef ?? { current: null }, {
    amount: "all",
  });

  const currentView = isAboutInView
    ? "about"
    : isContactInView
      ? "contact"
      : isProjectsInView
        ? "projects"
        : "";

  return (
    <nav className="max-lg:hidden">
      <ul className="flex flex-col gap-3">
        <li className="flex items-center gap-5">
          <motion.span
            initial="initial"
            animate={currentView === "about" ? "visible" : "initial"}
            variants={spanVariants}
            transition={{ duration: 0.3 }}
            className={`h-0.5`}
          />
          <a href="#about">{t(KEYS.NAV.ABOUT)}</a>
        </li>
        <li className="flex items-center gap-5">
          <motion.span
            initial="initial"
            animate={currentView === "projects" ? "visible" : "initial"}
            variants={spanVariants}
            transition={{ duration: 0.3 }}
            className={`h-0.5`}
          />
          <a href="#projects">{t(KEYS.NAV.PROJECTS)}</a>
        </li>
        <li className="flex items-center gap-5">
          <motion.span
            initial="initial"
            animate={currentView === "contact" ? "visible" : "initial"}
            variants={spanVariants}
            transition={{ duration: 0.3 }}
            className={`h-0.5`}
          />
          <a href="#contact">{t(KEYS.NAV.CONTACT)}</a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
