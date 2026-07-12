'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Save, Trash2, Shield } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'

// Sample user data (in real app, fetch by ID)
const sampleUser = {
  id: 1,
  name: 'Dr. Ahmed Hassan',
  email: 'ahmed.hassan@densyc.com',
  phone: '+20 100 123 4567',
  role: 'Clinic Owner',
  branches: ['Main Branch'],
  status: 'active',
  permissions: {
    dashboard: true,
    patients: { view: true, add: true, edit: true, delete: true },
    reservations: { view: true, add: true, edit: true, delete: true },
    users: { view: true, add: true, edit: true, delete: true },
    mediaBuying: { view: true, add: true, edit: true, delete: true },
    reports: { view: true, export: true },
    clinics: { view: true, add: true, edit: true, delete: true },
    branches: { view: true, add: true, edit: true, delete: true },
    settings: { view: true, edit: true },
  },
}

// All available branches
const allBranches = ['Main Branch', 'Downtown Branch', 'Uptown Branch', 'West Side Branch']

// Permission templates by role
const rolePermissionTemplates: Record<string, typeof sampleUser.permissions> = {
  'Clinic Owner': {
    dashboard: true,
    patients: { view: true, add: true, edit: true, delete: true },
    reservations: { view: true, add: true, edit: true, delete: true },
    users: { view: true, add: true, edit: true, delete: true },
    mediaBuying: { view: true, add: true, edit: true, delete: true },
    reports: { view: true, export: true },
    clinics: { view: true, add: true, edit: true, delete: true },
    branches: { view: true, add: true, edit: true, delete: true },
    settings: { view: true, edit: true },
  },
  'Moderator': {
    dashboard: true,
    patients: { view: true, add: true, edit: true, delete: false },
    reservations: { view: true, add: false, edit: false, delete: false },
    users: { view: false, add: false, edit: false, delete: false },
    mediaBuying: { view: true, add: false, edit: false, delete: false },
    reports: { view: true, export: false },
    clinics: { view: false, add: false, edit: false, delete: false },
    branches: { view: true, add: false, edit: false, delete: false },
    settings: { view: false, edit: false },
  },
  'Receptionist': {
    dashboard: true,
    patients: { view: true, add: true, edit: true, delete: false },
    reservations: { view: true, add: true, edit: true, delete: false },
    users: { view: false, add: false, edit: false, delete: false },
    mediaBuying: { view: false, add: false, edit: false, delete: false },
    reports: { view: false, export: false },
    clinics: { view: false, add: false, edit: false, delete: false },
    branches: { view: true, add: false, edit: false, delete: false },
    settings: { view: false, edit: false },
  },
  'Accountant': {
    dashboard: true,
    patients: { view: true, add: false, edit: true, delete: false },
    reservations: { view: true, add: false, edit: false, delete: false },
    users: { view: false, add: false, edit: false, delete: false },
    mediaBuying: { view: true, add: false, edit: false, delete: false },
    reports: { view: true, export: true },
    clinics: { view: false, add: false, edit: false, delete: false },
    branches: { view: true, add: false, edit: false, delete: false },
    settings: { view: false, edit: false },
  },
  'Media Buyer': {
    dashboard: true,
    patients: { view: true, add: false, edit: false, delete: false },
    reservations: { view: false, add: false, edit: false, delete: false },
    users: { view: false, add: false, edit: false, delete: false },
    mediaBuying: { view: true, add: true, edit: true, delete: true },
    reports: { view: true, export: true },
    clinics: { view: false, add: false, edit: false, delete: false },
    branches: { view: true, add: false, edit: false, delete: false },
    settings: { view: false, edit: false },
  },
  'Content Creator': {
    dashboard: true,
    patients: { view: false, add: false, edit: false, delete: false },
    reservations: { view: false, add: false, edit: false, delete: false },
    users: { view: false, add: false, edit: false, delete: false },
    mediaBuying: { view: true, add: false, edit: false, delete: false },
    reports: { view: true, export: false },
    clinics: { view: false, add: false, edit: false, delete: false },
    branches: { view: false, add: false, edit: false, delete: false },
    settings: { view: false, edit: false },
  },
}

export default function UserEditPage() {
  const params = useParams()
  
  const [formData, setFormData] = useState({
    name: sampleUser.name,
    email: sampleUser.email,
    phone: sampleUser.phone,
    role: sampleUser.role,
    branches: sampleUser.branches,
    status: sampleUser.status,
    newPassword: '',
    confirmPassword: '',
  })

  const [permissions, setPermissions] = useState(sampleUser.permissions)

  const updateField = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateRole = (role: string) => {
    setFormData(prev => ({ ...prev, role }))
    // Apply role permission template
    if (rolePermissionTemplates[role]) {
      setPermissions(rolePermissionTemplates[role])
    }
  }

  const toggleBranch = (branch: string) => {
    setFormData(prev => {
      const branches = prev.branches.includes(branch)
        ? prev.branches.filter(b => b !== branch)
        : [...prev.branches, branch]
      return { ...prev, branches }
    })
  }

  const selectAllBranches = () => {
    setFormData(prev => ({ ...prev, branches: [...allBranches] }))
  }

  const clearAllBranches = () => {
    setFormData(prev => ({ ...prev, branches: [] }))
  }

  const updatePermission = (
    module: keyof typeof permissions,
    action: string,
    value: boolean
  ) => {
    setPermissions(prev => {
      const modulePerms = prev[module]
      if (typeof modulePerms === 'boolean') {
        return { ...prev, [module]: value }
      }
      return {
        ...prev,
        [module]: { ...modulePerms, [action]: value }
      }
    })
  }

  const roles = ['Clinic Owner', 'Moderator', 'Receptionist', 'Accountant', 'Media Buyer', 'Content Creator']

  const permissionModules = [
    { key: 'dashboard', label: 'Dashboard', type: 'single' },
    { key: 'patients', label: 'Patients', type: 'crud' },
    { key: 'reservations', label: 'Reservations', type: 'crud' },
    { key: 'users', label: 'Users', type: 'crud' },
    { key: 'mediaBuying', label: 'Media Buying', type: 'crud' },
    { key: 'reports', label: 'Reports', type: 'reports' },
    { key: 'clinics', label: 'Clinics', type: 'crud' },
    { key: 'branches', label: 'Branches', type: 'crud' },
    { key: 'settings', label: 'Settings', type: 'settings' },
  ] as const

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/users">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">Edit User</h1>
              <Badge variant={formData.status === 'active' ? 'default' : 'secondary'}>
                {formData.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">User ID: {params.id} | Update user information and permissions</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* User Details */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>User Details</CardTitle>
            <CardDescription>Edit the user&apos;s basic information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Ahmed Hassan"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., ahmed@densyc.com"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+20 100 123 4567"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => updateField('status', value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role & Branch */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Role & Branch Assignment</CardTitle>
            <CardDescription>Update the user&apos;s role and branch access. Users can be assigned to single or multiple branches.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={updateRole}>
                  <SelectTrigger id="role" className="max-w-md">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.role && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {formData.role === 'Clinic Owner' && 'Full system access and management'}
                    {formData.role === 'Moderator' && 'Manages patient leads and follow-ups'}
                    {formData.role === 'Receptionist' && 'Handles bookings and patient communication'}
                    {formData.role === 'Accountant' && 'Financial reporting and payments'}
                    {formData.role === 'Media Buyer' && 'Advertising campaigns and budgets'}
                    {formData.role === 'Content Creator' && 'Marketing content and social media'}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Branch Access</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={selectAllBranches}>
                      Select All
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearAllBranches}>
                      Clear All
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Select which branches this user can access. Users can have access to single or multiple branches.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                  {allBranches.map((branch) => (
                    <div key={branch} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id={`branch-${branch}`}
                        checked={formData.branches.includes(branch)}
                        onCheckedChange={() => toggleBranch(branch)}
                      />
                      <Label htmlFor={`branch-${branch}`} className="cursor-pointer flex-1 text-sm font-medium">
                        {branch}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.branches.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {formData.branches.map((branch) => (
                      <Badge key={branch} variant="secondary">
                        {branch}
                      </Badge>
                    ))}
                  </div>
                )}
                {formData.branches.length === 0 && (
                  <p className="text-xs text-amber-600 pt-2">Please select at least one branch for this user.</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Permissions
            </CardTitle>
            <CardDescription>
              Customize user permissions. Default permissions are applied based on the selected role, but you can customize them further.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {permissionModules.map((module) => {
                const modulePerms = permissions[module.key as keyof typeof permissions]
                
                return (
                  <div key={module.key} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-foreground">{module.label}</h4>
                      <Badge variant="outline" className="text-xs">
                        {typeof modulePerms === 'boolean' 
                          ? (modulePerms ? 'Enabled' : 'Disabled')
                          : Object.values(modulePerms).filter(Boolean).length + '/' + Object.keys(modulePerms).length + ' enabled'
                        }
                      </Badge>
                    </div>
                    
                    {module.type === 'single' && (
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`${module.key}-access`}
                          checked={modulePerms as boolean}
                          onCheckedChange={(checked) => updatePermission(module.key as keyof typeof permissions, '', checked as boolean)}
                        />
                        <Label htmlFor={`${module.key}-access`} className="cursor-pointer text-sm">
                          Access {module.label}
                        </Label>
                      </div>
                    )}

                    {module.type === 'crud' && typeof modulePerms === 'object' && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(['view', 'add', 'edit', 'delete'] as const).map((action) => (
                          <div key={action} className="flex items-center space-x-3">
                            <Checkbox
                              id={`${module.key}-${action}`}
                              checked={(modulePerms as { view: boolean; add: boolean; edit: boolean; delete: boolean })[action]}
                              onCheckedChange={(checked) => updatePermission(module.key as keyof typeof permissions, action, checked as boolean)}
                            />
                            <Label htmlFor={`${module.key}-${action}`} className="cursor-pointer text-sm capitalize">
                              {action}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}

                    {module.type === 'reports' && typeof modulePerms === 'object' && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(['view', 'export'] as const).map((action) => (
                          <div key={action} className="flex items-center space-x-3">
                            <Checkbox
                              id={`${module.key}-${action}`}
                              checked={(modulePerms as { view: boolean; export: boolean })[action]}
                              onCheckedChange={(checked) => updatePermission(module.key as keyof typeof permissions, action, checked as boolean)}
                            />
                            <Label htmlFor={`${module.key}-${action}`} className="cursor-pointer text-sm capitalize">
                              {action}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}

                    {module.type === 'settings' && typeof modulePerms === 'object' && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(['view', 'edit'] as const).map((action) => (
                          <div key={action} className="flex items-center space-x-3">
                            <Checkbox
                              id={`${module.key}-${action}`}
                              checked={(modulePerms as { view: boolean; edit: boolean })[action]}
                              onCheckedChange={(checked) => updatePermission(module.key as keyof typeof permissions, action, checked as boolean)}
                            />
                            <Label htmlFor={`${module.key}-${action}`} className="cursor-pointer text-sm capitalize">
                              {action}
                            </Label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Leave blank to keep the current password</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={(e) => updateField('newPassword', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Link href="/users">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete User
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
