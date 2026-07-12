'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getSupabaseBrowser } from '@/lib/supabase/client'

export type Role = 'Clinic Owner' | 'Moderator' | 'Receptionist' | 'Accountant' | 'Media Buyer' | 'Content Creator' | 'Guest'

export type Permission = 
  | 'view_dashboard'
  | 'manage_branches'
  | 'manage_clinics'
  | 'manage_users'
  | 'view_patients'
  | 'manage_media_buying'
  | 'view_reports'
  | 'manage_settings'

// Default permissions mapped to database roles
const rolePermissions: Record<Role, Permission[]> = {
  'Clinic Owner': [
    'view_dashboard', 'manage_branches', 'manage_clinics', 'manage_users', 
    'view_patients', 'manage_media_buying', 'view_reports', 'manage_settings'
  ],
  'Moderator': [
    'view_dashboard', 'view_patients', 'view_reports'
  ],
  'Receptionist': [
    'view_dashboard', 'view_patients'
  ],
  'Accountant': [
    'view_dashboard', 'view_reports'
  ],
  'Media Buyer': [
    'view_dashboard', 'manage_media_buying', 'view_reports'
  ],
  'Content Creator': [
    'view_dashboard', 'manage_media_buying'
  ],
  'Guest': []
}

type AuthContextType = {
  role: Role
  setRole: (role: Role) => void
  user: any // Adding user to context
  hasPermission: (permission: Permission) => boolean
  permissions: Record<Role, Permission[]>
  updatePermissions: (role: Role, newPermissions: Permission[]) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('Guest')
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // We keep this in state so the Settings page can modify it
  const [permissions, setPermissions] = useState<Record<Role, Permission[]>>(rolePermissions)

  const supabase = getSupabaseBrowser()

  useEffect(() => {
    let mounted = true

    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user && mounted) {
          setUser(user)
          // Fetch profile
          const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
            
          if (data?.role) {
            setRole(data.role as Role)
          } else {
            // fallback if profile not found or role missing
            const rawRole = user.raw_user_meta_data?.role as Role
            if (rawRole) setRole(rawRole)
          }
        } else if (mounted) {
          setRole('Guest')
          setUser(null)
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    loadProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        loadProfile()
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          setRole('Guest')
          setUser(null)
          setIsLoading(false)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  const hasPermission = (permission: Permission) => {
    return permissions[role]?.includes(permission) || false
  }

  const updatePermissions = (targetRole: Role, newPermissions: Permission[]) => {
    setPermissions(prev => ({
      ...prev,
      [targetRole]: newPermissions
    }))
  }

  return (
    <AuthContext.Provider value={{
      role,
      setRole,
      user,
      hasPermission,
      permissions,
      updatePermissions,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
