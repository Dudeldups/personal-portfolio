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

export const skills = [
  {
    name: "HTML",
    icon: <FaHtml5 />,
    isHidden: false,
  },
  {
    name: "CSS",
    icon: <FaCss3Alt />,
    isHidden: false,
  },
  {
    name: "TypeScript",
    icon: <SiTypescript />,
    isHidden: false,
  },
  {
    name: "React",
    icon: <FaReact />,
    isHidden: false,
  },
  {
    name: "Node.js",
    icon: <SiNodedotjs />,
    isHidden: false,
  },
  {
    name: "MongoDB",
    icon: <SiMongodb />,
    isHidden: false,
  },
  {
    name: "PostgreSQL",
    icon: <SiPostgresql />,
    isHidden: false,
  },
  {
    name: "Sass",
    icon: <FaSass />,
    isHidden: true,
  },
  {
    name: "Less",
    icon: <FaLess />,
    isHidden: true,
  },
  {
    name: "Tailwind CSS",
    icon: <SiTailwindcss />,
    isHidden: true,
  },
  {
    name: "Styled Components",
    icon: <SiStyledcomponents />,
    isHidden: true,
  },
];
