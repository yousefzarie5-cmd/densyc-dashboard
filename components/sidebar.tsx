'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, Users, GitBranch, FileText, Settings, Menu, X, Megaphone, ChevronDown, Building2, Check, Plus, Pencil, Trash2, LayoutGrid } from 'lucide-react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useClinic, ALL_BRANCHES, type Clinic } from '@/components/clinic-context'
import { useAuth, type Permission } from '@/components/auth-context'
import { getSupabaseBrowser } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const navigationItems = [
  { label: 'Dashboard', href: '/', icon: BarChart3, permission: 'view_dashboard' },
  { label: 'Branches', href: '/branches', icon: GitBranch, permission: 'manage_branches' },
  { label: 'Users', href: '/users', icon: Users, permission: 'manage_users' },
  { label: 'Patients', href: '/patients', icon: Users, permission: 'view_patients' },
  { label: 'Media Buying', href: '/media-buying', icon: Megaphone, permission: 'manage_media_buying' },
  { label: 'Reports', href: '/reports', icon: FileText, permission: 'view_reports' },
  { label: 'Settings', href: '/settings', icon: Settings, permission: 'manage_settings' },
]

const initialClinics = [
  { id: 1, name: 'Cairo Dental Care', logo: 'CDC', branches: ['Main Branch', 'Downtown Branch'] },
  { id: 2, name: 'Alexandria Smile Center', logo: 'ASC', branches: ['Uptown Branch'] },
  { id: 3, name: 'Giza Family Dentistry', logo: 'GFD', branches: ['West Side Branch'] },
]

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(true)
  const [clinics, setClinics] = useState<any[]>([])
  const { selectedClinic, setSelectedClinic } = useClinic()
  const { hasPermission } = useAuth()
  
  useEffect(() => {
    async function fetchClinics() {
      const supabase = getSupabaseBrowser()
      const { data } = await supabase.from('clinics').select('*')
      if (data && data.length > 0) {
        // Map database clinics to the expected sidebar format
        const mappedClinics = data.map(c => ({
          id: c.id,
          name: c.name,
          logo: c.name.split(' ').map((w: string) => w[0]).join('').substring(0, 3).toUpperCase(),
          branches: []
        }))
        setClinics(mappedClinics)
      } else {
        setClinics([])
      }
    }
    fetchClinics()
  }, [])

  // Dialog states
  const [addClinicOpen, setAddClinicOpen] = useState(false)
  const [editClinicOpen, setEditClinicOpen] = useState(false)
  const [clinicToEdit, setClinicToEdit] = useState<Clinic | null>(null)
  
  // Form states
  const [newClinicName, setNewClinicName] = useState('')
  const [newClinicLogo, setNewClinicLogo] = useState('')
  const [editClinicName, setEditClinicName] = useState('')
  const [editClinicLogo, setEditClinicLogo] = useState('')

  const handleAddClinic = async () => {
    if (newClinicName && newClinicLogo) {
      const supabase = getSupabaseBrowser()
      const { data, error } = await supabase.from('clinics').insert([{
        name: newClinicName,
        city: 'TBD' // Adding a placeholder since city might not be required but is standard in schema
      }]).select()

      if (error) {
        toast.error('Failed to create clinic: ' + error.message)
        return
      }

      if (data && data.length > 0) {
        const c = data[0]
        const newClinic = {
          id: c.id,
          name: c.name,
          logo: c.name.split(' ').map((w: string) => w[0]).join('').substring(0, 3).toUpperCase(),
          branches: [],
        }
        setClinics([...clinics, newClinic])
        setSelectedClinic(newClinic)
        setNewClinicName('')
        setNewClinicLogo('')
        setAddClinicOpen(false)
        toast.success('Clinic created successfully')
      }
    }
  }

  const handleEditClinic = async () => {
    if (clinicToEdit && editClinicName && editClinicLogo) {
      const supabase = getSupabaseBrowser()
      const { error } = await supabase.from('clinics').update({
        name: editClinicName
      }).eq('id', clinicToEdit.id)

      if (error) {
        toast.error('Failed to update clinic: ' + error.message)
        return
      }

      const updatedClinics = clinics.map(c => 
        c.id === clinicToEdit.id 
          ? { ...c, name: editClinicName, logo: editClinicLogo.toUpperCase().slice(0, 3) }
          : c
      )
      setClinics(updatedClinics)
      if (selectedClinic.id === clinicToEdit.id) {
        setSelectedClinic({ ...selectedClinic, name: editClinicName, logo: editClinicLogo.toUpperCase().slice(0, 3) })
      }
      setEditClinicOpen(false)
      setClinicToEdit(null)
      toast.success('Clinic updated successfully')
    }
  }

  const handleDeleteClinic = async (clinicId: string | number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm('Are you sure you want to delete this clinic? All associated branches, patients, and data will be permanently deleted.')) {
      return
    }

    const supabase = getSupabaseBrowser()
    const { error } = await supabase.from('clinics').delete().eq('id', clinicId)

    if (error) {
      toast.error('Failed to delete clinic: ' + error.message)
      return
    }

    const updatedClinics = clinics.filter(c => c.id !== clinicId)
    setClinics(updatedClinics)
    if (selectedClinic.id === clinicId) {
      setSelectedClinic(ALL_BRANCHES)
    }
    toast.success('Clinic deleted successfully')
  }

  const openEditDialog = (clinic: Clinic, e: React.MouseEvent) => {
    e.stopPropagation()
    setClinicToEdit(clinic)
    setEditClinicName(clinic.name)
    setEditClinicLogo(clinic.logo)
    setEditClinicOpen(true)
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-4 z-40 p-2 rounded-lg bg-primary/10 text-primary md:hidden"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 z-30',
          'md:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-6 py-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <img 
                src="/images/densyc-logo.png" 
                alt="Densyc Logo" 
                className="h-10 w-10 rounded-lg object-cover"
              />
              <span className="text-xl font-bold text-sidebar-foreground">Densyc</span>
            </div>
            
            {/* Clinic Switcher - Like Meta Business Suite */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full mt-4 justify-between h-auto py-2 px-3 bg-sidebar-accent/50 hover:bg-sidebar-accent"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-primary/20 flex items-center justify-center">
                      {selectedClinic.id === 0
                        ? <LayoutGrid className="w-4 h-4 text-primary" />
                        : <Building2 className="w-4 h-4 text-primary" />
                      }
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-sidebar-foreground/60">
                        {selectedClinic.id === 0 ? 'Viewing' : 'Current Clinic'}
                      </p>
                      <p className="text-sm font-medium text-sidebar-foreground truncate max-w-[140px]">
                        {selectedClinic.name}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-sidebar-foreground/60 shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[232px]">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                  Switch Clinic
                </div>
                <DropdownMenuItem
                  onClick={() => setSelectedClinic(ALL_BRANCHES)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                      <LayoutGrid className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">All Branches</span>
                  </div>
                  {selectedClinic.id === 0 && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {clinics.map((clinic) => (
                  <DropdownMenuItem
                    key={clinic.id}
                    onClick={() => setSelectedClinic(clinic)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{clinic.logo}</span>
                      </div>
                      <span className="text-sm">{clinic.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => openEditDialog(clinic, e)}
                        className="p-1 rounded hover:bg-muted"
                      >
                        <Pencil className="w-3 h-3 text-muted-foreground" />
                      </button>
                      <button 
                        onClick={(e) => handleDeleteClinic(clinic.id, e)}
                        className="p-1 rounded hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3 h-3 text-destructive" />
                      </button>
                      {selectedClinic.id === clinic.id && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setAddClinicOpen(true)}
                  className="flex items-center gap-2 cursor-pointer text-primary"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add Clinic</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              if (item.permission && !hasPermission(item.permission as Permission)) return null;
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  )}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="px-4 py-6 border-t border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/60">© 2024 Densyc</p>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Add Clinic Dialog */}
      <Dialog open={addClinicOpen} onOpenChange={setAddClinicOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Clinic</DialogTitle>
            <DialogDescription>
              Enter the details for your new clinic
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="clinicName">Clinic Name</Label>
              <Input
                id="clinicName"
                placeholder="e.g., Cairo Dental Care"
                value={newClinicName}
                onChange={(e) => setNewClinicName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clinicLogo">Logo Abbreviation (3 letters)</Label>
              <Input
                id="clinicLogo"
                placeholder="e.g., CDC"
                maxLength={3}
                value={newClinicLogo}
                onChange={(e) => setNewClinicLogo(e.target.value.toUpperCase())}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddClinicOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddClinic} disabled={!newClinicName || !newClinicLogo}>
              Add Clinic
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Clinic Dialog */}
      <Dialog open={editClinicOpen} onOpenChange={setEditClinicOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Clinic</DialogTitle>
            <DialogDescription>
              Update the clinic details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="editClinicName">Clinic Name</Label>
              <Input
                id="editClinicName"
                placeholder="e.g., Cairo Dental Care"
                value={editClinicName}
                onChange={(e) => setEditClinicName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editClinicLogo">Logo Abbreviation (3 letters)</Label>
              <Input
                id="editClinicLogo"
                placeholder="e.g., CDC"
                maxLength={3}
                value={editClinicLogo}
                onChange={(e) => setEditClinicLogo(e.target.value.toUpperCase())}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditClinicOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditClinic} disabled={!editClinicName || !editClinicLogo}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
