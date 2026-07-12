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
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'

// Sample branch data (in real app, fetch by ID)
const sampleBranch = {
  id: 1,
  name: 'Main Branch',
  address: '123 Main St',
  city: 'Cairo',
  country: 'Egypt',
  phone: '+20 2 123 4567',
  email: 'main@densyc.com',
  workingHours: '9:00 AM - 9:00 PM',
  manager: 'Dr. Ahmed Hassan',
  status: 'active',
  description: 'Our flagship location in downtown Cairo.',
  patients: 1245,
  staff: 12,
}

export default function BranchEditPage() {
  const params = useParams()
  
  const [formData, setFormData] = useState({
    name: sampleBranch.name,
    address: sampleBranch.address,
    city: sampleBranch.city,
    country: sampleBranch.country,
    phone: sampleBranch.phone,
    email: sampleBranch.email,
    workingHours: sampleBranch.workingHours,
    manager: sampleBranch.manager,
    status: sampleBranch.status,
    description: sampleBranch.description,
  })

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const cities = ['Cairo', 'Alexandria', 'Giza', 'Luxor', 'Aswan', 'Hurghada', 'Sharm El Sheikh']

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/branches">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">Edit Branch</h1>
              <Badge variant={formData.status === 'active' ? 'default' : 'secondary'}>
                {formData.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">Branch ID: {params.id} | Update branch information and settings</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Branch Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{sampleBranch.patients.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Registered at this branch</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{sampleBranch.staff}</div>
              <p className="text-xs text-muted-foreground mt-1">Working at this branch</p>
            </CardContent>
          </Card>
        </div>

        {/* Branch Details */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Branch Details</CardTitle>
            <CardDescription>Edit the basic information for this branch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Branch Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Main Branch"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
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
            <CardDescription>Edit the branch contact details</CardDescription>
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
                  placeholder="branch@densyc.com"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="workingHours">Working Hours</Label>
                <Input
                  id="workingHours"
                  placeholder="e.g., 9:00 AM - 9:00 PM"
                  value={formData.workingHours}
                  onChange={(e) => updateField('workingHours', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manager">Branch Manager</Label>
                <Input
                  id="manager"
                  placeholder="Manager name"
                  value={formData.manager}
                  onChange={(e) => updateField('manager', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>Add any additional notes about this branch</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="description"
              placeholder="Enter any additional notes about the branch..."
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Link href="/branches">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Branch
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
