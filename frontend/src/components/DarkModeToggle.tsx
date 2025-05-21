import { useDarkMode } from '../hooks/useDarkMode'

export function DarkModeToggle() {
    const [isDark, setIsDark] = useDarkMode()

    return (
        <button
            onClick={() => setIsDark(!isDark)}
            className="px-3 py-1 border rounded bg-black text-white dark:bg-white dark:text-black dark:border-gray-700"
        >
            {isDark ? '☀️ Claro' : '🌙 Escuro'}
        </button>
    )
}
