'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Trash2, Users, GitBranch } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'

// Sample clinic data (in real app, fetch by ID)
const sampleClinic = {
  id: 1,
  name: 'Downtown Clinic',
  address: '123 Main St',
  city: 'New York',
  country: 'USA',
  phone: '(555) 123-4567',
  email: 'downtown@clinic.com',
  website: 'https://www.downtownclinic.com',
  owner: 'Dr. John Smith',
  status: 'active',
  description: 'Our flagship clinic location in downtown.',
  patients: 342,
  staff: 12,
  branches: [
    { id: 1, name: 'Main Branch', location: '123 Main St', staff: 8 },
    { id: 2, name: 'East Wing', location: '125 Main St', staff: 4 },
  ],
  users: [
    { id: 1, name: 'Dr. John Smith', role: 'Clinic Owner', email: 'john@clinic.com' },
    { id: 2, name: 'Sara Johnson', role: 'Receptionist', email: 'sara@clinic.com' },
    { id: 3, name: 'Mike Brown', role: 'Media Buyer', email: 'mike@clinic.com' },
  ],
}

export default function ClinicEditPage() {
  const params = useParams()
  
  const [formData, setFormData] = useState({
    name: sampleClinic.name,
    address: sampleClinic.address,
    city: sampleClinic.city,
    country: sampleClinic.country,
    phone: sampleClinic.phone,
    email: sampleClinic.email,
    website: sampleClinic.website,
    owner: sampleClinic.owner,
    status: sampleClinic.status,
    description: sampleClinic.description,
  })

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const cities = ['Cairo', 'Alexandria', 'Giza', 'Luxor', 'Aswan', 'Hurghada', 'Sharm El Sheikh', 'New York', 'Los Angeles']

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/clinics">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">Edit Clinic</h1>
              <Badge variant={formData.status === 'active' ? 'default' : 'secondary'}>
                {formData.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">Clinic ID: {params.id} | Update clinic information and settings</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Clinic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{sampleClinic.patients.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered at this clinic</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{sampleClinic.staff}</div>
              <p className="text-xs text-muted-foreground mt-1">Working at this clinic</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Branches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{sampleClinic.branches.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Active locations</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{sampleClinic.users.length}</div>
              <p className="text-xs text-muted-foreground mt-1">System users</p>
            </CardContent>
          </Card>
        </div>

        {/* Clinic Details */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Clinic Details</CardTitle>
            <CardDescription>Edit the basic information for this clinic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Clinic Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Cairo Dental Care"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="owner">Clinic Owner</Label>
                <Input
                  id="owner"
                  placeholder="e.g., Dr. Ahmed Hassan"
                  value={formData.owner}
                  onChange={(e) => updateField('owner', e.target.value)}
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

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="e.g., 123 Main St"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select value={formData.city} onValueChange={(value) => updateField('city', value)}>
                  <SelectTrigger id="city">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => updateField('country', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Edit the clinic contact details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+20 2 123 4567"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="clinic@example.com"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://www.example.com"
                  value={formData.website}
                  onChange={(e) => updateField('website', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clinic Branches */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5" />
                  Clinic Branches
                </CardTitle>
                <CardDescription>Branches belonging to this clinic</CardDescription>
              </div>
              <Link href="/branches/new">
                <Button variant="outline" size="sm">Add Branch</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-foreground font-semibold">Branch Name</TableHead>
                    <TableHead className="text-foreground font-semibold">Location</TableHead>
                    <TableHead className="text-foreground font-semibold">Staff</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleClinic.branches.map((branch) => (
                    <TableRow key={branch.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium text-foreground">{branch.name}</TableCell>
                      <TableCell className="text-muted-foreground">{branch.location}</TableCell>
                      <TableCell className="text-muted-foreground">{branch.staff}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Clinic Users */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Clinic Users
                </CardTitle>
                <CardDescription>Users with access to this clinic</CardDescription>
              </div>
              <Link href="/users/new">
                <Button variant="outline" size="sm">Add User</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-foreground font-semibold">Name</TableHead>
                    <TableHead className="text-foreground font-semibold">Role</TableHead>
                    <TableHead className="text-foreground font-semibold">Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleClinic.users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Add any additional notes about this clinic</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="description"
              placeholder="Enter any additional notes about the clinic..."
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Link href="/clinics">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Clinic
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
