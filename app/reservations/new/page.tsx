'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Save } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import { getSupabaseBrowser } from '@/lib/supabase/client'

export default function NewReservationPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    clinic: '',
    date: '',
    time: '',
    type: 'Consultation',
    status: 'pending',
  })

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.patient || !formData.date || !formData.time) {
      toast.error('Please fill in required fields (Patient, Date, Time)')
      return
    }

    setIsSubmitting(true)
    const supabase = getSupabaseBrowser()

    try {
      const { error } = await supabase.from('reservations').insert([{
        patient: formData.patient,
        doctor: formData.doctor,
        clinic: formData.clinic,
        date: formData.date,
        time: formData.time,
        type: formData.type,
        status: formData.status,
      }])

      if (error) throw error

      toast.success('Reservation created successfully')
      router.push('/reservations')
    } catch (error: any) {
      console.error('Error inserting reservation:', error)
      toast.error(error.message || 'Failed to create reservation')
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/reservations">
            <Button variant="ghost" size="icon" type="button">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">New Reservation</h1>
            <p className="text-muted-foreground mt-1">Schedule a new appointment</p>
          </div>
          <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Reservation'}
          </Button>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Appointment Details</CardTitle>
            <CardDescription>Enter the basic information for the new reservation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient Name</Label>
                <Input
                  id="patient"
                  placeholder="e.g., John Doe"
                  value={formData.patient}
                  onChange={(e) => updateField('patient', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor</Label>
                <Input
                  id="doctor"
                  placeholder="e.g., Dr. Smith"
                  value={formData.doctor}
                  onChange={(e) => updateField('doctor', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinic">Clinic/Branch</Label>
                <Input
                  id="clinic"
                  placeholder="e.g., Main Branch"
                  value={formData.clinic}
                  onChange={(e) => updateField('clinic', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => updateField('type', value)}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="Treatment">Treatment</SelectItem>
                    <SelectItem value="Check-up">Check-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => updateField('time', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => updateField('status', value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </DashboardLayout>
  )
}
