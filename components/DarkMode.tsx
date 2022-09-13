import { IconSun, IconMoon } from '@tabler/icons';
import { Dispatch } from 'react';

interface darkModeSettings {
  mode: {
    darkMode: boolean,
    setDarkMode: Dispatch<any>
  }
}

export default function DarkModeToggle({ mode: { darkMode, setDarkMode } }: darkModeSettings): JSX.Element {
  return (
    <button id='darkMode' className='p-2 bg-inherit rounded-md discordTextInteractive interactiveBorder' onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? <IconMoon /> : <IconSun />}
    </button>
  )
}
