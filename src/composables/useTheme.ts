import { ref } from 'vue'

const STORAGE_KEY = 'theme'
const DARK_CLASS = 'app-dark'

function readInitial(): boolean {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return saved === 'dark'
  } catch {
    // localStorage no disponible: usamos la preferencia del sistema
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

// Estado compartido: todos los componentes que usen useTheme() ven el mismo valor
const isDark = ref(readInitial())
document.documentElement.classList.toggle(DARK_CLASS, isDark.value)

export function useTheme() {
  function toggleDark() {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle(DARK_CLASS, isDark.value)
    try {
      localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
    } catch {
      // ignorar
    }
  }

  return { isDark, toggleDark }
}
