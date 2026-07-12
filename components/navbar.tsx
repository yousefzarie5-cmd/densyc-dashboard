'use client'

import { Moon, Sun, Bell, Settings, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useAuth } from './auth-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { role, setRole } = useAuth()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 md:left-64 bg-background border-b border-border flex items-center justify-between px-6 z-20">
      <div className="flex-1">
        <h2 className="text-sm font-semibold text-muted-foreground">Welcome Back</h2>
      </div>

      <div className="flex items-center gap-2">
        {/* Role Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs font-medium border-primary text-primary capitalize hidden md:flex">
              Role: {role}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setRole('superadmin')}>Super Admin</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole('clinicadmin')}>Clinic Admin</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRole('staff')}>Staff</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Branch Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="text-sm font-medium">
              Main Branch
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Main Branch</DropdownMenuItem>
            <DropdownMenuItem>Downtown Branch</DropdownMenuItem>
            <DropdownMenuItem>Uptown Branch</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="icon">
          <Bell size={20} />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                JD
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Settings size={16} className="mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut size={16} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
