'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase/client'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, UserCog, Phone, Calculator } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'

export default function NewPatientPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Moderator fields
    date: '',
    name: '',
    phoneNumber: '',
    source: '',
    interest: '',
    country: 'Egypt',
    city: '',
    area: '',
    nearestBranch: '',
    adId: '',
    communicationThrough: '',
    moderatorNotes: '',
    // Receptionist fields
    receptionistName: '',
    attempt1: '',
    attempt2: '',
    attempt3: '',
    bookingStatus: 'Pending',
    showNoShow: '',
    reservationDate: '',
    rejectionFeedback1: '',
    rejectionFeedback2: '',
    // Accountant fields
    quotationAmount: '',
    amountPaid: '',
  })

  // Set date only on client to avoid hydration mismatch
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      date: new Date().toISOString().split('T')[0]
    }))
  }, [])

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (!formData.name) {
      alert("Patient Name is required.")
      return
    }
    setLoading(true)
    const supabase = getSupabaseBrowser()
    const { error } = await supabase.from('patients').insert([{
      date: formData.date || null,
      name: formData.name,
      phone_number: formData.phoneNumber || null,
      source: formData.source || null,
      interest: formData.interest || null,
      country: formData.country || null,
      city: formData.city || null,
      area: formData.area || null,
      nearest_branch: formData.nearestBranch || null,
      ad_id: formData.adId || null,
      communication_through: formData.communicationThrough || null,
      moderator_notes: formData.moderatorNotes || null,
      receptionist_name: formData.receptionistName || null,
      attempt1: formData.attempt1 || null,
      attempt2: formData.attempt2 || null,
      attempt3: formData.attempt3 || null,
      booking_status: formData.bookingStatus || 'Pending',
      show_no_show: formData.showNoShow || null,
      reservation_date: formData.reservationDate || null,
      rejection_feedback1: formData.rejectionFeedback1 || null,
      rejection_feedback2: formData.rejectionFeedback2 || null,
      quotation_amount: formData.quotationAmount ? parseFloat(formData.quotationAmount) : 0,
      amount_paid: formData.amountPaid ? parseFloat(formData.amountPaid) : 0,
    }])
    setLoading(false)
    if (error) {
      alert("Failed to save patient: " + error.message)
    } else {
      router.push('/patients')
    }
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
            <h1 className="text-3xl font-bold text-foreground">Add New Patient</h1>
            <p className="text-muted-foreground mt-1">Enter patient lead information and tracking details</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Patient'}
          </Button>
        </div>

        {/* Moderator Section */}
        <Card className="border-border border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCog className="w-5 h-5 text-blue-500" />
              Moderator
            </CardTitle>
            <CardDescription>Lead intake information filled by the moderator</CardDescription>
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
                <Label htmlFor="name">Name</Label>
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
                <Label htmlFor="nearestBranch">Nearest Branch</Label>
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

              <div className="space-y-2">
                <Label htmlFor="adId">Ad. ID</Label>
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

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="moderatorNotes">Moderator Notes</Label>
                <Textarea
                  id="moderatorNotes"
                  placeholder="Enter any notes about the lead..."
                  value={formData.moderatorNotes}
                  onChange={(e) => updateField('moderatorNotes', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Receptionist Section */}
        <Card className="border-border border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-500" />
              Receptionist
            </CardTitle>
            <CardDescription>Follow-up attempts and booking information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

              <div className="space-y-2">
                <Label htmlFor="attempt1">1st Attempt (2 Calls+Message / Day1)</Label>
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
                <Label htmlFor="attempt2">2nd Attempt (2 Calls+Message / Day2)</Label>
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
                <Label htmlFor="attempt3">3rd Attempt (2 Calls+Message / Day3)</Label>
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
                <Label htmlFor="reservationDate">Reservation Date</Label>
                <Input
                  id="reservationDate"
                  type="date"
                  value={formData.reservationDate}
                  onChange={(e) => updateField('reservationDate', e.target.value)}
                  disabled={formData.bookingStatus !== 'Booked'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejectionFeedback1">Rejection Feedback (not booked)</Label>
                <Input
                  id="rejectionFeedback1"
                  placeholder="Reason for rejection"
                  value={formData.rejectionFeedback1}
                  onChange={(e) => updateField('rejectionFeedback1', e.target.value)}
                  disabled={formData.bookingStatus !== 'Rejected'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejectionFeedback2">Rejection Feedback (not booked)</Label>
                <Input
                  id="rejectionFeedback2"
                  placeholder="Additional feedback"
                  value={formData.rejectionFeedback2}
                  onChange={(e) => updateField('rejectionFeedback2', e.target.value)}
                  disabled={formData.bookingStatus !== 'Rejected'}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Accountant Section */}
        <Card className="border-border border-l-4 border-l-amber-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-500" />
              Accountant
            </CardTitle>
            <CardDescription>Financial information and payment tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Link href="/patients">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button className="bg-primary hover:bg-primary/90" onClick={handleSave} disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Patient'}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
