'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/app/context/ThemeContext'

const SwitchIconLabelDemo = () => {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className='inline-flex items-center gap-2'>
      <Switch
        id='icon-label'
        checked={isDark}
        onCheckedChange={toggleTheme}
        aria-label='Toggle theme'
      />

      <Label htmlFor='icon-label'>
        <span className='sr-only'>Toggle theme</span>
        {isDark ? (
          <MoonIcon className='size-4' aria-hidden='true' />
        ) : (
          <SunIcon className='size-4' aria-hidden='true' />
        )}
      </Label>
    </div>
  )
}

export default SwitchIconLabelDemo