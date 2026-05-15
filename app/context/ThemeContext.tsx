'use client'

import { createContext, useContext, useEffect, useState } from 'react'


type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme  
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProviderContext({ children }: { children: React.ReactNode }) {
  
  const [theme, setTheme] = useState<Theme>('light') 

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    
    setTheme(initialTheme)
    applyTheme(initialTheme)
  }, []) 

  const applyTheme = (newTheme: Theme) => {
   
    const root = document.documentElement
    
   
    if (newTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    applyTheme(newTheme)
  }


  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
export function useTheme() {
 
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error(
      'useTheme must be used within ThemeProviderContext. ' +
      'Make sure your component is wrapped by ThemeProviderContext in layout.tsx'
    )
  }
  
 
  return context
}

export default ThemeContext