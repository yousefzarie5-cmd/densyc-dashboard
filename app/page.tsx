'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { useClinic } from '@/components/clinic-context'
import { useAuth } from '@/components/auth-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, TrendingUp, UserPlus, DollarSign, Megaphone, CalendarIcon, Filter, Download } from 'lucide-react'
import { DashboardChart } from '@/components/charts/dashboard-chart'
import { RecentActivityTable } from '@/components/tables/recent-activity'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format, subDays } from 'date-fns'
import type { DateRange } from 'react-day-picker'

export default function Page() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [isClient, setIsClient] = useState(false)
  const { isAllBranches } = useClinic()

  useEffect(() => {
    setIsClient(true)
    setDateRange({
      from: subDays(new Date(), 30),
      to: new Date(),
    })
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header with Date Range Picker */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome to Densyc - Your clinic management platform</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
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
          </div>
        </div>

        {/* KPI Cards - Updated metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Patients</span>
                <Users className="w-4 h-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">0</div>
              <p className="text-xs text-muted-foreground mt-1">Total registered patients</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Conversion Rate</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">0%</div>
              <p className="text-xs text-muted-foreground mt-1">No data</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>New Patients</span>
                <UserPlus className="w-4 h-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">0</div>
              <p className="text-xs text-muted-foreground mt-1">In selected period</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Media Buying Spend</span>
                <Megaphone className="w-4 h-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$0</div>
              <p className="text-xs text-muted-foreground mt-1">Ad spend in period</p>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Total Revenue</span>
                <DollarSign className="w-4 h-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$0</div>
              <p className="text-xs text-muted-foreground mt-1">No data</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className={`grid grid-cols-1 gap-4 ${isAllBranches ? 'lg:grid-cols-3' : ''}`}>
          <Card className={`border-border ${isAllBranches ? 'lg:col-span-2' : ''}`}>
            <CardHeader>
              <CardTitle>Patient Acquisition Trend</CardTitle>
              <CardDescription>New patients and conversions over time</CardDescription>
            </CardHeader>
            <CardContent>
              <DashboardChart />
            </CardContent>
          </Card>

          {isAllBranches && <Card className="border-border">
            <CardHeader>
              <CardTitle>Branch Performance</CardTitle>
              <CardDescription>Revenue distribution by branch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { name: 'Main Branch', width: 0 },
                  { name: 'Downtown Branch', width: 0 },
                  { name: 'Uptown Branch', width: 0 },
                  { name: 'West Side Branch', width: 0 },
                ].map((branch) => (
                  <div key={branch.name} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{branch.name}</span>
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${branch.width}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>}
        </div>

        {/* Recent Activity */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest patient interactions and bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentActivityTable />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
