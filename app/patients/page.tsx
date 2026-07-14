'use client'

import { useState, useMemo, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/components/auth-context'
import { getSupabaseBrowser } from '@/lib/supabase/client'
import { Plus, Download, Filter, CalendarIcon, Pencil, X } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format, subDays } from 'date-fns'
import type { DateRange } from 'react-day-picker'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Removed seededRandom and generatePatients()

const getBookingStatusColor = (status: string) => {
  switch (status) {
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

const getShowNoShowColor = (status: string) => {
  switch (status) {
    case 'Show':
      return 'default'
    case 'No-show':
      return 'destructive'
    default:
      return 'outline'
  }
}

// Filter options
const filterOptions = {
  source: ['All', 'Facebook', 'Instagram', 'Google Ads', 'TikTok', 'Referral'],
  bookingStatus: ['All', 'Booked', 'Pending', 'Rejected'],
  branch: ['All', 'Main Branch', 'Downtown Branch', 'Uptown Branch', 'West Side Branch'],
  interest: ['All', 'Teeth Whitening', 'Dental Implants', 'Braces', 'Root Canal', 'Veneers', 'Cleaning', 'Wisdom Tooth', 'Crowns'],
  city: ['All', 'Cairo', 'Alexandria', 'Giza', 'Luxor', 'Aswan'],
}

export default function PatientsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [isClient, setIsClient] = useState(false)
  
  const [filterBy, setFilterBy] = useState<string>('')
  const [filterValue, setFilterValue] = useState<string>('')
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  
  const [patients, setPatients] = useState<any[]>([])
  
  const { user } = useAuth()

  useEffect(() => {
    setIsClient(true)
    setDateRange({
      from: subDays(new Date(), 30),
      to: new Date(),
    })

    const fetchPatients = async () => {
      const supabase = getSupabaseBrowser()
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching patients:', error)
      } else if (data) {
        const mappedData = data.map(p => ({
          id: p.id,
          date: p.date,
          name: p.name,
          phoneNumber: p.phone_number || '-',
          source: p.source || '-',
          interest: p.interest || '-',
          country: p.country || '-',
          city: p.city || '-',
          area: p.area || '-',
          nearestBranch: p.nearest_branch || '-',
          adId: p.ad_id || '-',
          moderatorNotes: p.moderator_notes || '-',
          communicationThrough: p.communication_through || '-',
          receptionistName: p.receptionist_name || '-',
          attempt1: p.attempt1 || '-',
          attempt2: p.attempt2 || '-',
          attempt3: p.attempt3 || '-',
          bookingStatus: p.booking_status,
          showNoShow: p.show_no_show || '-',
          reservationDate: p.reservation_date || '-',
          rejectionFeedback1: p.rejection_feedback1 || '-',
          rejectionFeedback2: p.rejection_feedback2 || '-',
          quotationAmount: p.quotation_amount || 0,
          amountPaid: p.amount_paid || 0,
        }))
        setPatients(mappedData)
      }
    }
    fetchPatients()
  }, [])

  // Get available filter values based on selected filter type
  const getFilterValues = () => {
    switch (filterBy) {
      case 'source':
        return filterOptions.source
      case 'bookingStatus':
        return filterOptions.bookingStatus
      case 'branch':
        return filterOptions.branch
      case 'interest':
        return filterOptions.interest
      case 'city':
        return filterOptions.city
      default:
        return []
    }
  }

  // Filter patients based on selected filters
  const filteredPatients = useMemo(() => {
    if (!filterBy || !filterValue || filterValue === 'All') {
      return patients
    }

    return patients.filter((patient) => {
      switch (filterBy) {
        case 'source':
          return patient.source === filterValue
        case 'bookingStatus':
          return patient.bookingStatus === filterValue
        case 'branch':
          return patient.nearestBranch === filterValue
        case 'interest':
          return patient.interest === filterValue
        case 'city':
          return patient.city === filterValue
        default:
          return true
      }
    })
  }, [filterBy, filterValue])

  const clearFilters = () => {
    setFilterBy('')
    setFilterValue('')
    setShowFilterPanel(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Patients</h1>
            <p className="text-muted-foreground mt-1">Manage your patient leads and bookings</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Popover open={showFilterPanel} onOpenChange={setShowFilterPanel}>
              <PopoverTrigger asChild>
                <Button variant={filterBy && filterValue && filterValue !== 'All' ? 'default' : 'outline'}>
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                  {filterBy && filterValue && filterValue !== 'All' && (
                    <Badge variant="secondary" className="ml-2">1</Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filter Patients</h4>
                    {(filterBy || filterValue) && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="w-4 h-4 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Filter By</label>
                    <Select value={filterBy} onValueChange={(value) => { setFilterBy(value); setFilterValue('') }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field to filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="source">Source</SelectItem>
                        <SelectItem value="bookingStatus">Booking Status</SelectItem>
                        <SelectItem value="branch">Branch</SelectItem>
                        <SelectItem value="interest">Interest</SelectItem>
                        <SelectItem value="city">City</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {filterBy && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Filter Value</label>
                      <Select value={filterValue} onValueChange={setFilterValue}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select value" />
                        </SelectTrigger>
                        <SelectContent>
                          {getFilterValues().map((value) => (
                            <SelectItem key={value} value={value}>{value}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <Button className="w-full" onClick={() => setShowFilterPanel(false)}>
                    Apply Filter
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {isClient && dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                      </>
                    ) : (
                      format(dateRange.from, 'LLL dd, y')
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Link href="/patients/new">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Patient
              </Button>
            </Link>
          </div>
        </div>

        {/* Active Filter Display */}
        {filterBy && filterValue && filterValue !== 'All' && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Filtered by:</span>
            <Badge variant="secondary" className="flex items-center gap-1">
              {filterBy === 'bookingStatus' ? 'Booking Status' : filterBy.charAt(0).toUpperCase() + filterBy.slice(1)}: {filterValue}
              <button onClick={clearFilters} className="ml-1 hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
            <span className="text-sm text-muted-foreground">({filteredPatients.length} results)</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">0</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Booked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">0</div>
              <p className="text-xs text-muted-foreground mt-1">0% conversion</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">0</div>
              <p className="text-xs text-muted-foreground mt-1">In follow-up</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Show Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">0%</div>
              <p className="text-xs text-muted-foreground mt-1">Of booked</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$0</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Patients Table with Horizontal Scroll */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Patient Leads</CardTitle>
            <CardDescription>Complete list of all leads with full tracking data ({filteredPatients.length} records)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[50px] sticky left-0 bg-muted/50">#</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[100px]">Date</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[150px]">Name</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[150px]">Phone Number</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[100px]">Source</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[120px]">Interest</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[80px]">Country</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[100px]">City</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[100px]">Area</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[130px]">Branch</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[80px]">Ad ID</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[180px]">Moderator Notes</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[130px]">Communication</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[140px]">Receptionist</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[140px]">1st Attempt</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[140px]">2nd Attempt</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[140px]">3rd Attempt</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[110px]">Booking Status</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[100px]">Show/No-show</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[130px]">Reservation Date</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[150px]">Rejection Feedback 1</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[150px]">Rejection Feedback 2</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[130px]">Quotation Amount</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[120px]">Amount Paid</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPatients.map((patient) => (
                    <TableRow key={patient.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="whitespace-nowrap text-sm sticky left-0 bg-background">
                        <Link href={`/patients/${patient.id}`} className="font-bold text-primary hover:underline">
                          {patient.id}
                        </Link>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">{patient.date}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Link href={`/patients/${patient.id}`} className="font-medium hover:underline text-foreground">
                          {patient.name}
                        </Link>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{patient.phoneNumber}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant="outline">{patient.source}</Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">{patient.interest}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{patient.country}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{patient.city}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{patient.area}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm">{patient.nearestBranch}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm font-mono text-muted-foreground">{patient.adId}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground max-w-[180px] truncate">{patient.moderatorNotes}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm">{patient.communicationThrough}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm">{patient.receptionistName}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{patient.attempt1}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{patient.attempt2}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{patient.attempt3}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant={getBookingStatusColor(patient.bookingStatus) as 'default' | 'secondary' | 'destructive' | 'outline'}>
                          {patient.bookingStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {patient.showNoShow !== '-' ? (
                          <Badge variant={getShowNoShowColor(patient.showNoShow) as 'default' | 'destructive' | 'outline'}>
                            {patient.showNoShow}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">{patient.reservationDate}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{patient.rejectionFeedback1}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">{patient.rejectionFeedback2}</TableCell>
                      <TableCell className="whitespace-nowrap text-sm font-medium">
                        {patient.quotationAmount > 0 ? `$${patient.quotationAmount.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm font-medium text-primary">
                        {patient.amountPaid > 0 ? `$${patient.amountPaid.toLocaleString()}` : '-'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Link href={`/patients/${patient.id}`}>
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
