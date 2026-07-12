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

// Sample patient data (in real app, fetch by ID)
const samplePatient = {
  id: 1,
  date: '2024-12-15',
  name: 'Ahmed Hassan',
  phoneNumber: '+20 100 123 4567',
  source: 'Facebook',
  interest: 'Teeth Whitening',
  country: 'Egypt',
  city: 'Cairo',
  area: 'Nasr City',
  nearestBranch: 'Main Branch',
  adId: 'FB_001',
  moderatorNotes: 'Interested in package deal',
  communicationThrough: 'WhatsApp',
  receptionistName: 'Sara Ahmed',
  attempt1: 'Called - Interested',
  attempt2: 'Called - Booked',
  attempt3: '-',
  bookingStatus: 'Booked',
  showNoShow: 'Show',
  reservationDate: '2024-12-18',
  rejectionFeedback1: '-',
  rejectionFeedback2: '-',
  quotationAmount: '15000',
  amountPaid: '5000',
}

export default function PatientEditPage() {
  const params = useParams()
  
  const [formData, setFormData] = useState({
    date: samplePatient.date,
    name: samplePatient.name,
    phoneNumber: samplePatient.phoneNumber,
    source: samplePatient.source,
    interest: samplePatient.interest,
    country: samplePatient.country,
    city: samplePatient.city,
    area: samplePatient.area,
    nearestBranch: samplePatient.nearestBranch,
    adId: samplePatient.adId,
    moderatorNotes: samplePatient.moderatorNotes,
    communicationThrough: samplePatient.communicationThrough,
    receptionistName: samplePatient.receptionistName,
    attempt1: samplePatient.attempt1,
    attempt2: samplePatient.attempt2,
    attempt3: samplePatient.attempt3,
    bookingStatus: samplePatient.bookingStatus,
    showNoShow: samplePatient.showNoShow,
    reservationDate: samplePatient.reservationDate,
    rejectionFeedback1: samplePatient.rejectionFeedback1,
    rejectionFeedback2: samplePatient.rejectionFeedback2,
    quotationAmount: samplePatient.quotationAmount,
    amountPaid: samplePatient.amountPaid,
  })

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const sources = ['Facebook', 'Instagram', 'Google Ads', 'TikTok', 'Referral', 'Walk-in', 'Website']
  const interests = ['Teeth Whitening', 'Dental Implants', 'Braces', 'Root Canal', 'Veneers', 'Cleaning', 'Wisdom Tooth', 'Crowns', 'Consultation', 'Emergency']
  const cities = ['Cairo', 'Alexandria', 'Giza', 'Luxor', 'Aswan', 'Hurghada', 'Sharm El Sheikh']
  const areas = ['Nasr City', 'Maadi', 'Heliopolis', 'Zamalek', 'New Cairo', 'Smouha', '6th October', 'Dokki', 'Mohandessin', 'Garden City']
  const branches = ['Main Branch', 'Downtown Branch', 'Uptown Branch', 'West Side Branch']
  const receptionists = ['Sara Ahmed', 'Mohamed Karim', 'Nour Hassan', 'Layla Mostafa', 'Ahmed Ali']
  const communications = ['WhatsApp', 'Phone Call', 'SMS', 'Email']
  const attemptStatuses = ['Called - No Answer', 'Called - Interested', 'Called - Booked', 'Called - Declined', 'Message Sent', 'Voicemail Left', '-']
  const bookingStatuses = ['Booked', 'Pending', 'Rejected']

  const getStatusColor = () => {
    switch (formData.bookingStatus) {
      case 'Booked':
        return 'default'
      case 'Pending':
        return 'secondary'
      case 'Rejected':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/patients">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">Edit Patient</h1>
              <Badge variant={getStatusColor() as 'default' | 'secondary' | 'destructive' | 'outline'}>
                {formData.bookingStatus}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">Patient ID: {params.id} | Update patient information and tracking details</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Basic Information */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Edit the patient&apos;s contact and lead details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Ahmed Hassan"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+20 100 123 4567"
                  value={formData.phoneNumber}
                  onChange={(e) => updateField('phoneNumber', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select value={formData.source} onValueChange={(value) => updateField('source', value)}>
                  <SelectTrigger id="source">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map((source) => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interest">Interest</Label>
                <Select value={formData.interest} onValueChange={(value) => updateField('interest', value)}>
                  <SelectTrigger id="interest">
                    <SelectValue placeholder="Select interest" />
                  </SelectTrigger>
                  <SelectContent>
                    {interests.map((interest) => (
                      <SelectItem key={interest} value={interest}>{interest}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adId">Ad ID</Label>
                <Input
                  id="adId"
                  placeholder="e.g., FB_001"
                  value={formData.adId}
                  onChange={(e) => updateField('adId', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="communicationThrough">Communication Through</Label>
                <Select value={formData.communicationThrough} onValueChange={(value) => updateField('communicationThrough', value)}>
                  <SelectTrigger id="communicationThrough">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    {communications.map((comm) => (
                      <SelectItem key={comm} value={comm}>{comm}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="receptionistName">Receptionist/Agent Name</Label>
                <Select value={formData.receptionistName} onValueChange={(value) => updateField('receptionistName', value)}>
                  <SelectTrigger id="receptionistName">
                    <SelectValue placeholder="Select agent" />
                  </SelectTrigger>
                  <SelectContent>
                    {receptionists.map((rec) => (
                      <SelectItem key={rec} value={rec}>{rec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location Information */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Location Information</CardTitle>
            <CardDescription>Edit the patient&apos;s location details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => updateField('country', e.target.value)}
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
                <Label htmlFor="area">Area</Label>
                <Select value={formData.area} onValueChange={(value) => updateField('area', value)}>
                  <SelectTrigger id="area">
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((area) => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nearestBranch">Branch</Label>
                <Select value={formData.nearestBranch} onValueChange={(value) => updateField('nearestBranch', value)}>
                  <SelectTrigger id="nearestBranch">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Follow-up Attempts */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Follow-up Attempts</CardTitle>
            <CardDescription>Track communication attempts (2 Calls + Message per day)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="attempt1">1st Attempt (Day 1)</Label>
                <Select value={formData.attempt1} onValueChange={(value) => updateField('attempt1', value)}>
                  <SelectTrigger id="attempt1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {attemptStatuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attempt2">2nd Attempt (Day 2)</Label>
                <Select value={formData.attempt2} onValueChange={(value) => updateField('attempt2', value)}>
                  <SelectTrigger id="attempt2">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {attemptStatuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attempt3">3rd Attempt (Day 3)</Label>
                <Select value={formData.attempt3} onValueChange={(value) => updateField('attempt3', value)}>
                  <SelectTrigger id="attempt3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {attemptStatuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking Information */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Booking Information</CardTitle>
            <CardDescription>Track booking status and appointment details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="bookingStatus">Booking Status</Label>
                <Select value={formData.bookingStatus} onValueChange={(value) => updateField('bookingStatus', value)}>
                  <SelectTrigger id="bookingStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {bookingStatuses.map((status) => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reservationDate">Reservation Date</Label>
                <Input
                  id="reservationDate"
                  type="date"
                  value={formData.reservationDate !== '-' ? formData.reservationDate : ''}
                  onChange={(e) => updateField('reservationDate', e.target.value)}
                  disabled={formData.bookingStatus !== 'Booked'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="showNoShow">Show / No-show</Label>
                <Select 
                  value={formData.showNoShow} 
                  onValueChange={(value) => updateField('showNoShow', value)}
                  disabled={formData.bookingStatus !== 'Booked'}
                >
                  <SelectTrigger id="showNoShow">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Show">Show</SelectItem>
                    <SelectItem value="No-show">No-show</SelectItem>
                    <SelectItem value="-">-</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejectionFeedback1">Rejection Feedback 1</Label>
                <Input
                  id="rejectionFeedback1"
                  placeholder="Reason for rejection"
                  value={formData.rejectionFeedback1 !== '-' ? formData.rejectionFeedback1 : ''}
                  onChange={(e) => updateField('rejectionFeedback1', e.target.value)}
                  disabled={formData.bookingStatus !== 'Rejected'}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="rejectionFeedback2">Rejection Feedback 2</Label>
                <Input
                  id="rejectionFeedback2"
                  placeholder="Additional feedback"
                  value={formData.rejectionFeedback2 !== '-' ? formData.rejectionFeedback2 : ''}
                  onChange={(e) => updateField('rejectionFeedback2', e.target.value)}
                  disabled={formData.bookingStatus !== 'Rejected'}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Financial Information</CardTitle>
            <CardDescription>Track quotation and payment details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="quotationAmount">Quotation Amount (Daily)</Label>
                <Input
                  id="quotationAmount"
                  type="number"
                  placeholder="0.00"
                  value={formData.quotationAmount}
                  onChange={(e) => updateField('quotationAmount', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amountPaid">Amount Paid (Monthly)</Label>
                <Input
                  id="amountPaid"
                  type="number"
                  placeholder="0.00"
                  value={formData.amountPaid}
                  onChange={(e) => updateField('amountPaid', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Moderator Notes</CardTitle>
            <CardDescription>Add any additional notes about this patient</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              id="moderatorNotes"
              placeholder="Enter any notes about the patient..."
              value={formData.moderatorNotes}
              onChange={(e) => updateField('moderatorNotes', e.target.value)}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Link href="/patients">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button variant="destructive">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Patient
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
