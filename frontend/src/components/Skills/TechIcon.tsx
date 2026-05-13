import { FaCss3Alt, FaHtml5, FaLess, FaReact, FaSass } from "react-icons/fa6";
import type { IconType } from "react-icons";
import {
  SiMongodb,
  SiNodedotjs,
  SiPostgresql,
  SiStyledcomponents,
  SiTailwindcss,
  SiTypescript,
} from "react-icons/si";

type TechIconProps = {
  tech: string;
  className?: string;
  isColored?: boolean;
  delayMs?: number;
};

const techIcons: Record<string, IconType> = {
  HTML: FaHtml5,
  CSS: FaCss3Alt,
  TypeScript: SiTypescript,
  React: FaReact,
  "Node.js": SiNodedotjs,
  MongoDB: SiMongodb,
  PostgreSQL: SiPostgresql,
  Sass: FaSass,
  "Tailwind CSS": SiTailwindcss,
  "Styled Components": SiStyledcomponents,
  Less: FaLess,
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

const TechIcon = ({
  tech,
  className,
  isColored = false,
  delayMs = 0,
}: TechIconProps) => {
  const Icon = techIcons[tech];

  if (!Icon) {
    return null;
  }

  return (
    <span className="relative inline-grid place-items-center">
      <Icon className={className} style={{ color: "var(--color-light)" }} />
      <span
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{
          clipPath: isColored
            ? "polygon(0 0, 150% 0, 150% 150%, 0 150%)"
            : "polygon(0 0, 0 0, 0 0, 0 0)",
          transition: `clip-path 1700ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms`,
        }}
      >
        <Icon className={className} style={{ color: techColors[tech] }} />
      </span>
    </span>
  );
};

export default TechIcon;
