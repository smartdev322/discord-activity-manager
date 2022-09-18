import { IconSun, IconMoon } from "@tabler/icons";
import { Dispatch } from "react";

interface darkModeSettings {
  mode: {
    darkMode: boolean;
    setDarkMode: Dispatch<boolean>;
  };
}

export default function DarkModeToggle({
  mode: { darkMode, setDarkMode },
}: darkModeSettings): JSX.Element {
  return (
    <button
      id="darkMode"
      className="discordTextInteractive interactiveBorder rounded-md bg-inherit p-2"
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? <IconMoon /> : <IconSun />}
    </button>
  );
}
