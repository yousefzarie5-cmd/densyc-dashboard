'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'

export default function NewClinicPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    country: 'Egypt',
    phone: '',
    email: '',
    website: '',
    owner: '',
    status: 'active',
    description: '',
  })

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const cities = ['Cairo', 'Alexandria', 'Giza', 'Luxor', 'Aswan', 'Hurghada', 'Sharm El Sheikh', 'New York', 'Los Angeles']

  const handleSave = async () => {
    if (!formData.name || !formData.address) {
      toast.error('Please fill in all required fields (Name and Address)')
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success('Clinic created successfully')
    router.push('/clinics')
  }

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
            <h1 className="text-3xl font-bold text-foreground">Add New Clinic</h1>
            <p className="text-muted-foreground mt-1">Create a new clinic in the system</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleSave} disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Creating...' : 'Create Clinic'}
          </Button>
        </div>

        {/* Clinic Details */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Clinic Details</CardTitle>
            <CardDescription>Enter the basic information for the new clinic</CardDescription>
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
            <CardDescription>Enter the clinic contact details</CardDescription>
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
          <Button className="bg-primary hover:bg-primary/90" onClick={handleSave} disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Creating...' : 'Create Clinic'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
