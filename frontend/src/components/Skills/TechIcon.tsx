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
  isColored?: boolean;
};

const techColors: Record<string, string> = {
  HTML: "#E34F26",
  CSS: "#1572B6",
  TypeScript: "#3178C6",
  React: "#61DAFB",
  "Node.js": "#5FA04E",
  MongoDB: "#47A248",
  PostgreSQL: "#4169E1",
  Sass: "#CC6699",
  "Tailwind CSS": "#06B6D4",
  "Styled Components": "#DB7093",
  Less: "#1D365D",
};

const TechIcon = ({ tech, className, isColored = false }: TechIconProps) => {
  const iconStyle = {
    color: isColored ? techColors[tech] : "var(--color-light)",
  };

  switch (tech) {
    case "HTML":
      return <FaHtml5 className={className} style={iconStyle} />;
    case "CSS":
      return <FaCss3Alt className={className} style={iconStyle} />;
    case "TypeScript":
      return <SiTypescript className={className} style={iconStyle} />;
    case "React":
      return <FaReact className={className} style={iconStyle} />;
    case "Node.js":
      return <SiNodedotjs className={className} style={iconStyle} />;
    case "MongoDB":
      return <SiMongodb className={className} style={iconStyle} />;
    case "PostgreSQL":
      return <SiPostgresql className={className} style={iconStyle} />;
    case "Sass":
      return <FaSass className={className} style={iconStyle} />;
    case "Tailwind CSS":
      return <SiTailwindcss className={className} style={iconStyle} />;
    case "Styled Components":
      return <SiStyledcomponents className={className} style={iconStyle} />;
    case "Less":
      return <FaLess className={className} style={iconStyle} />;
    default:
      return null;
  }
};

export default TechIcon;
