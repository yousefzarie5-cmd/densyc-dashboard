'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useAuth } from '@/components/auth-context'

const activities = [
  {
    id: 1,
    patient: 'John Anderson',
    action: 'New Reservation',
    clinic: 'Clinic 1',
    status: 'confirmed',
    date: '2024-12-15 10:30',
  },
  {
    id: 2,
    patient: 'Sarah Johnson',
    action: 'Follow-up Call',
    clinic: 'Clinic 2',
    status: 'completed',
    date: '2024-12-15 09:15',
  },
  {
    id: 3,
    patient: 'Mike Davis',
    action: 'Initial Consultation',
    clinic: 'Clinic 1',
    status: 'pending',
    date: '2024-12-15 14:00',
  },
  {
    id: 4,
    patient: 'Emily Wilson',
    action: 'Treatment Plan',
    clinic: 'Clinic 3',
    status: 'completed',
    date: '2024-12-14 16:45',
  },
  {
    id: 5,
    patient: 'David Brown',
    action: 'Payment Received',
    clinic: 'Clinic 2',
    status: 'confirmed',
    date: '2024-12-14 11:20',
  },
]

export function RecentActivityTable() {
  const { user } = useAuth()
  const isBlank = user?.email === 'blank@demo.com'
  const displayActivities = isBlank ? [] : activities

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: 'default',
      pending: 'secondary',
      confirmed: 'outline',
    }
    return (
      <Badge variant={variants[status] || 'destructive'} className="capitalize">
        {status}
      </Badge>
    )
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-foreground font-semibold">Patient</TableHead>
            <TableHead className="text-foreground font-semibold">Action</TableHead>
            <TableHead className="text-foreground font-semibold">Clinic</TableHead>
            <TableHead className="text-foreground font-semibold">Status</TableHead>
            <TableHead className="text-foreground font-semibold">Date & Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayActivities.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                No recent activity.
              </TableCell>
            </TableRow>
          )}
          {displayActivities.map((activity) => (
            <TableRow key={activity.id} className="hover:bg-muted/50 transition-colors">
              <TableCell className="font-medium text-foreground">{activity.patient}</TableCell>
              <TableCell className="text-foreground">{activity.action}</TableCell>
              <TableCell className="text-muted-foreground">{activity.clinic}</TableCell>
              <TableCell>{getStatusBadge(activity.status)}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{activity.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
