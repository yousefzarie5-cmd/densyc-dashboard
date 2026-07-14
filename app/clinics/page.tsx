'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, MapPin, Phone, Pencil } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import { getSupabaseBrowser } from '@/lib/supabase/client'

// Define the clinic type based on Supabase schema
type Clinic = {
  id: string
  name: string
  address: string
  city: string
  country: string
  phone: string
  email: string
  status: string
  branches_count: number
  staff_count: number
  patients_count: number
}

export default function ClinicsPage() {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchClinics() {
      const supabase = getSupabaseBrowser()
      
      try {
        // Fetch clinics
        const { data: clinicsData, error: clinicsError } = await supabase
          .from('clinics')
          .select('*')
          .order('created_at', { ascending: false })

        if (clinicsError) throw clinicsError

        // For a full implementation, we could fetch related counts.
        // Here we just map the basic data and default the counts to 0 until deeper relations are established.
        const mappedClinics: Clinic[] = (clinicsData || []).map(clinic => ({
          ...clinic,
          branches_count: 0,
          staff_count: 0,
          patients_count: 0
        }))

        // Fetch branch counts as a simple aggregate
        const { data: branchesData } = await supabase.from('branches').select('clinic_id')
        if (branchesData) {
          mappedClinics.forEach(c => {
            c.branches_count = branchesData.filter(b => b.clinic_id === c.id).length
          })
        }

        // Fetch staff counts
        const { data: staffData } = await supabase.from('profiles').select('clinic_id')
        if (staffData) {
          mappedClinics.forEach(c => {
            c.staff_count = staffData.filter(s => s.clinic_id === c.id).length
          })
        }

        setClinics(mappedClinics)
      } catch (error) {
        console.error('Error fetching clinics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClinics()
  }, [])

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">Loading clinics...</div>
      </DashboardLayout>
    )
  }

  const activeClinics = clinics.filter(c => c.status === 'active').length
  const totalBranches = clinics.reduce((acc, c) => acc + c.branches_count, 0)
  const totalStaff = clinics.reduce((acc, c) => acc + c.staff_count, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Clinics</h1>
            <p className="text-muted-foreground mt-1">Manage all your clinic locations</p>
          </div>
          <Link href="/clinics/new">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Clinic
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Clinics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{clinics.length}</div>
              <p className="text-xs text-muted-foreground mt-1">{activeClinics} active</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">0</div>
              <p className="text-xs text-muted-foreground mt-1">Across all clinics</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalStaff}</div>
              <p className="text-xs text-muted-foreground mt-1">Team members</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalBranches}</div>
              <p className="text-xs text-muted-foreground mt-1">All locations</p>
            </CardContent>
          </Card>
        </div>

        {clinics.length === 0 ? (
          <div className="text-center py-12 border rounded-lg border-dashed">
            <h3 className="text-lg font-medium text-foreground mb-2">No clinics found</h3>
            <p className="text-muted-foreground mb-4">You haven't added any clinics yet.</p>
            <Link href="/clinics/new">
              <Button>Add Your First Clinic</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Clinics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clinics.map((clinic) => (
                <Card key={clinic.id} className="border-border hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/clinics/${clinic.id}`}>
                          <CardTitle className="text-lg hover:underline cursor-pointer">{clinic.name}</CardTitle>
                        </Link>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {clinic.address ? `${clinic.address}, ${clinic.city}` : clinic.city}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={clinic.status === 'active' ? 'default' : 'secondary'}>
                          {clinic.status}
                        </Badge>
                        <Link href={`/clinics/${clinic.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {clinic.phone || 'N/A'}
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Patients</p>
                        <p className="text-lg font-bold text-foreground">{clinic.patients_count}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Staff</p>
                        <p className="text-lg font-bold text-foreground">{clinic.staff_count}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Branches</p>
                        <p className="text-lg font-bold text-foreground">{clinic.branches_count}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Table View */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>All Clinics</CardTitle>
                <CardDescription>Complete list of all your clinic locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-foreground font-semibold">Clinic Name</TableHead>
                        <TableHead className="text-foreground font-semibold">Location</TableHead>
                        <TableHead className="text-foreground font-semibold">Phone</TableHead>
                        <TableHead className="text-foreground font-semibold">Patients</TableHead>
                        <TableHead className="text-foreground font-semibold">Staff</TableHead>
                        <TableHead className="text-foreground font-semibold">Branches</TableHead>
                        <TableHead className="text-foreground font-semibold">Status</TableHead>
                        <TableHead className="text-foreground font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clinics.map((clinic) => (
                        <TableRow key={clinic.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell>
                            <Link href={`/clinics/${clinic.id}`} className="font-medium text-foreground hover:underline">
                              {clinic.name}
                            </Link>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {clinic.address ? `${clinic.address}, ${clinic.city}` : clinic.city}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{clinic.phone || 'N/A'}</TableCell>
                          <TableCell className="font-medium text-foreground">{clinic.patients_count}</TableCell>
                          <TableCell className="font-medium text-foreground">{clinic.staff_count}</TableCell>
                          <TableCell className="font-medium text-foreground">{clinic.branches_count}</TableCell>
                          <TableCell>
                            <Badge variant={clinic.status === 'active' ? 'default' : 'secondary'}>
                              {clinic.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Link href={`/clinics/${clinic.id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

