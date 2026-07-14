'use client'

import { useState, useEffect } from 'react'
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
import { getSupabaseBrowser } from '@/lib/supabase/client'
import Link from 'next/link'

type Reservation = {
  id: string
  patient: string
  doctor: string
  clinic: string
  date: string
  time: string
  status: string
  type: string
}

const statusColors: Record<string, string> = {
  confirmed: 'default',
  pending: 'secondary',
  completed: 'outline',
  cancelled: 'destructive',
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchReservations() {
      const supabase = getSupabaseBrowser()
      try {
        const { data, error } = await supabase
          .from('reservations')
          .select('*')
          .order('date', { ascending: false })
          .order('time', { ascending: false })

        if (error) throw error
        setReservations(data || [])
      } catch (error) {
        console.error('Error fetching reservations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReservations()
  }, [])

  const confirmedCount = reservations.filter(r => r.status === 'confirmed').length
  const pendingCount = reservations.filter(r => r.status === 'pending').length
  const completedCount = reservations.filter(r => r.status === 'completed').length

  const confirmationRate = reservations.length > 0 
    ? Math.round((confirmedCount / reservations.length) * 100) 
    : 0

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">Loading reservations...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reservations</h1>
            <p className="text-muted-foreground mt-1">Manage appointments and schedules</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link href="/reservations/new">
              <Plus className="w-4 h-4 mr-2" />
              New Reservation
            </Link>
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
              <div className="text-2xl font-bold text-foreground">{reservations.length}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
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
              <div className="text-2xl font-bold text-foreground">{confirmedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">{confirmationRate}% confirmation rate</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{pendingCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{completedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Finished appointments</p>
            </CardContent>
          </Card>
        </div>

        {reservations.length === 0 ? (
          <div className="text-center py-12 border rounded-lg border-dashed">
            <h3 className="text-lg font-medium text-foreground mb-2">No reservations found</h3>
            <p className="text-muted-foreground mb-4">You have no scheduled appointments yet.</p>
          </div>
        ) : (
          <>
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
                        <TableCell className="text-muted-foreground">{reservation.doctor || 'N/A'}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">{reservation.clinic || 'N/A'}</TableCell>
                        <TableCell className="text-foreground text-sm">
                          {reservation.date} {reservation.time}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{reservation.type || 'N/A'}</TableCell>
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
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
