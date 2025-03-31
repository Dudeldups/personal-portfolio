import { FaHtml5 } from "react-icons/fa6";
import { SiTypescript } from "react-icons/si";
import { FaReact } from "react-icons/fa6";
import { FaCss3Alt } from "react-icons/fa6";
import { SiNodedotjs } from "react-icons/si";
import { SiMongodb } from "react-icons/si";
import { SiPostgresql } from "react-icons/si";
import { FaSass } from "react-icons/fa6";
import { SiTailwindcss } from "react-icons/si";
import { SiStyledcomponents } from "react-icons/si";
import { FaLess } from "react-icons/fa6";

type TechIconProps = {
  tech: string;
  className?: string;
};

const TechIcon = ({ tech, className }: TechIconProps) => {
  switch (tech) {
    case "HTML":
      return <FaHtml5 className={className} />;
    case "CSS":
      return <FaCss3Alt className={className} />;
    case "TypeScript":
      return <SiTypescript className={className} />;
    case "React":
      return <FaReact className={className} />;
    case "Node.js":
      return <SiNodedotjs className={className} />;
    case "MongoDB":
      return <SiMongodb className={className} />;
    case "PostgreSQL":
      return <SiPostgresql className={className} />;
    case "Sass":
      return <FaSass className={className} />;
    case "Tailwind CSS":
      return <SiTailwindcss className={className} />;
    case "Styled Components":
      return <SiStyledcomponents className={className} />;
    case "Less":
      return <FaLess className={className} />;
    default:
      return null;
  }
};

export default TechIcon;
