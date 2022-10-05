import { IconSun, IconMoon } from "@tabler/icons";
import darkModeSettings from "../types/DarkMode";

export default function DarkModeToggle({
  mode: { darkMode, setDarkMode },
}: darkModeSettings): JSX.Element {
  return (
    <button
      id="darkMode"
      className="interactiveBorder rounded-md bg-inherit p-2 dark:text-dark-200"
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? <IconMoon /> : <IconSun />}
    </button>
  );
}
