'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type Role = 'superadmin' | 'clinicadmin' | 'staff'

export type Permission = 
  | 'view_dashboard'
  | 'manage_branches'
  | 'manage_clinics'
  | 'manage_users'
  | 'view_patients'
  | 'manage_media_buying'
  | 'view_reports'
  | 'manage_settings'

// Default permissions for each role
const rolePermissions: Record<Role, Permission[]> = {
  superadmin: [
    'view_dashboard', 'manage_branches', 'manage_clinics', 'manage_users', 
    'view_patients', 'manage_media_buying', 'view_reports', 'manage_settings'
  ],
  clinicadmin: [
    'view_dashboard', 'manage_users', 'view_patients', 'view_reports', 'manage_settings'
  ],
  staff: [
    'view_dashboard', 'view_patients'
  ]
}

type AuthContextType = {
  role: Role
  setRole: (role: Role) => void
  hasPermission: (permission: Permission) => boolean
  permissions: Record<Role, Permission[]>
  updatePermissions: (role: Role, newPermissions: Permission[]) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('superadmin')
  
  // We keep this in state so the Settings page can modify it
  const [permissions, setPermissions] = useState<Record<Role, Permission[]>>(rolePermissions)

  const hasPermission = (permission: Permission) => {
    return permissions[role].includes(permission)
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
      hasPermission,
      permissions,
      updatePermissions
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
