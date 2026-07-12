'use client'

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

const clinics = [
  {
    id: 1,
    name: 'Downtown Clinic',
    location: '123 Main St, New York',
    phone: '(555) 123-4567',
    patients: 342,
    staff: 12,
    branches: 2,
    status: 'active',
  },
  {
    id: 2,
    name: 'Uptown Medical Center',
    location: '456 Park Ave, New York',
    phone: '(555) 234-5678',
    patients: 289,
    staff: 10,
    branches: 1,
    status: 'active',
  },
  {
    id: 3,
    name: 'West Side Health',
    location: '789 West St, New York',
    phone: '(555) 345-6789',
    patients: 156,
    staff: 8,
    branches: 1,
    status: 'active',
  },
  {
    id: 4,
    name: 'East End Clinic',
    location: '321 East Ave, New York',
    phone: '(555) 456-7890',
    patients: 198,
    staff: 7,
    branches: 1,
    status: 'inactive',
  },
  {
    id: 5,
    name: 'Central Park Medical',
    location: '654 Central Blvd, New York',
    phone: '(555) 567-8901',
    patients: 267,
    staff: 11,
    branches: 2,
    status: 'active',
  },
]

export default function ClinicsPage() {
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
              <p className="text-xs text-muted-foreground mt-1">{clinics.filter(c => c.status === 'active').length} active</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{clinics.reduce((acc, c) => acc + c.patients, 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all clinics</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{clinics.reduce((acc, c) => acc + c.staff, 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">Team members</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{clinics.reduce((acc, c) => acc + c.branches, 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">All locations</p>
            </CardContent>
          </Card>
        </div>

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
                      {clinic.location}
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
                  {clinic.phone}
                </div>
                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Patients</p>
                    <p className="text-lg font-bold text-foreground">{clinic.patients}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Staff</p>
                    <p className="text-lg font-bold text-foreground">{clinic.staff}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Branches</p>
                    <p className="text-lg font-bold text-foreground">{clinic.branches}</p>
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
                      <TableCell className="text-muted-foreground text-sm">{clinic.location}</TableCell>
                      <TableCell className="text-muted-foreground">{clinic.phone}</TableCell>
                      <TableCell className="font-medium text-foreground">{clinic.patients}</TableCell>
                      <TableCell className="font-medium text-foreground">{clinic.staff}</TableCell>
                      <TableCell className="font-medium text-foreground">{clinic.branches}</TableCell>
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
      </div>
    </DashboardLayout>
  )
}
