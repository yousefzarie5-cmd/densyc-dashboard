'use client'

import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Clock, CheckCircle } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const reservations = [
  {
    id: 1,
    patient: 'Robert Johnson',
    doctor: 'Dr. John Smith',
    clinic: 'Downtown Clinic',
    date: '2024-12-16',
    time: '10:00 AM',
    status: 'confirmed',
    type: 'Consultation',
  },
  {
    id: 2,
    patient: 'Jennifer Lee',
    doctor: 'Dr. Sarah Wilson',
    clinic: 'Uptown Medical Center',
    date: '2024-12-16',
    time: '02:30 PM',
    status: 'pending',
    type: 'Follow-up',
  },
  {
    id: 3,
    patient: 'Patricia Garcia',
    doctor: 'Dr. Michael Davis',
    clinic: 'West Side Health',
    date: '2024-12-17',
    time: '11:00 AM',
    status: 'confirmed',
    type: 'Treatment',
  },
  {
    id: 4,
    patient: 'Christopher Taylor',
    doctor: 'Dr. Emily Brown',
    clinic: 'Central Park Medical',
    date: '2024-12-17',
    time: '03:15 PM',
    status: 'confirmed',
    type: 'Check-up',
  },
  {
    id: 5,
    patient: 'Linda White',
    doctor: 'Dr. John Smith',
    clinic: 'East End Clinic',
    date: '2024-12-18',
    time: '09:30 AM',
    status: 'completed',
    type: 'Consultation',
  },
  {
    id: 6,
    patient: 'Daniel Harris',
    doctor: 'Dr. Sarah Wilson',
    clinic: 'Downtown Clinic',
    date: '2024-12-18',
    time: '01:00 PM',
    status: 'cancelled',
    type: 'Follow-up',
  },
  {
    id: 7,
    patient: 'Thomas Martinez',
    doctor: 'Dr. Michael Davis',
    clinic: 'Uptown Medical Center',
    date: '2024-12-19',
    time: '04:00 PM',
    status: 'pending',
    type: 'Treatment',
  },
  {
    id: 8,
    patient: 'Barbara Clark',
    doctor: 'Dr. Emily Brown',
    clinic: 'West Side Health',
    date: '2024-12-20',
    time: '10:30 AM',
    status: 'confirmed',
    type: 'Check-up',
  },
]

const statusColors: Record<string, string> = {
  confirmed: 'default',
  pending: 'secondary',
  completed: 'outline',
  cancelled: 'destructive',
}

export default function ReservationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reservations</h1>
            <p className="text-muted-foreground mt-1">Manage appointments and schedules</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            New Reservation
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Total Reservations</span>
                <Clock className="w-4 h-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">342</div>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Confirmed</span>
                <CheckCircle className="w-4 h-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">268</div>
              <p className="text-xs text-muted-foreground mt-1">78% confirmation rate</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">45</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">298</div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Reservations Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Appointment Schedule</CardTitle>
            <CardDescription>All upcoming and past appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-foreground font-semibold">Patient</TableHead>
                    <TableHead className="text-foreground font-semibold">Doctor</TableHead>
                    <TableHead className="text-foreground font-semibold">Clinic</TableHead>
                    <TableHead className="text-foreground font-semibold">Date & Time</TableHead>
                    <TableHead className="text-foreground font-semibold">Type</TableHead>
                    <TableHead className="text-foreground font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservations.map((reservation) => (
                    <TableRow key={reservation.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium text-foreground">{reservation.patient}</TableCell>
                      <TableCell className="text-muted-foreground">{reservation.doctor}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{reservation.clinic}</TableCell>
                      <TableCell className="text-foreground text-sm">
                        {reservation.date} {reservation.time}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{reservation.type}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[reservation.status] || 'outline'}>
                          {reservation.status}
                        </Badge>
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
