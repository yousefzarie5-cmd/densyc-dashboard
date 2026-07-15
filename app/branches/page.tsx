'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, MapPin, Phone, Filter, Download, CalendarIcon, Pencil, Trash2 } from 'lucide-react'
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
import { getSupabaseBrowser } from '@/lib/supabase/client'

type Branch = {
  id: string
  name: string
  address: string
  city: string
  country: string
  phone: string
  email: string
  status: string
  working_hours: string
  manager: string
  patients_count: number
  staff_count: number
}

export default function BranchesPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [isClient, setIsClient] = useState(false)
  const [branches, setBranches] = useState<Branch[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)
    setDateRange({
      from: subDays(new Date(), 30),
      to: new Date(),
    })
  }, [])

  useEffect(() => {
    async function fetchBranches() {
      const supabase = getSupabaseBrowser()
      try {
        const { data, error } = await supabase
          .from('branches')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error

        const mappedBranches: Branch[] = (data || []).map(b => ({
          ...b,
          patients_count: 0,
          staff_count: 0
        }))

        // Optional: fetch real staff counts if desired
        // const { data: staffData } = await supabase.from('profiles').select('branch_id')

        setBranches(mappedBranches)
      } catch (error) {
        console.error('Error fetching branches:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBranches()
  }, [])

  const handleDeleteBranch = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete the branch "${name}"?`)) {
      return
    }

    const supabase = getSupabaseBrowser()
    try {
      const { error } = await supabase.from('branches').delete().eq('id', id)
      if (error) throw error
      setBranches(branches.filter(b => b.id !== id))
    } catch (error) {
      console.error('Error deleting branch:', error)
      alert('Failed to delete branch. Please try again.')
    }
  }

  const totalPatients = branches.reduce((acc, b) => acc + b.patients_count, 0)
  const totalStaff = branches.reduce((acc, b) => acc + b.staff_count, 0)
  const activeBranches = branches.filter((b) => b.status === 'active').length

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">Loading branches...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Branches</h1>
            <p className="text-muted-foreground mt-1">Manage your clinic branch locations</p>
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
            <Link href="/branches/new">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Branch
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{branches.length}</div>
              <p className="text-xs text-muted-foreground mt-1">{activeBranches} active</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalPatients.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all branches</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalStaff}</div>
              <p className="text-xs text-muted-foreground mt-1">Team members</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Patients/Branch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{branches.length ? Math.round(totalPatients / branches.length) : 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Per location</p>
            </CardContent>
          </Card>
        </div>

        {branches.length === 0 ? (
          <div className="text-center py-12 border rounded-lg border-dashed">
            <h3 className="text-lg font-medium text-foreground mb-2">No branches found</h3>
            <p className="text-muted-foreground mb-4">You haven't added any branches yet.</p>
            <Link href="/branches/new">
              <Button>Add Your First Branch</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Branches Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {branches.map((branch) => (
                <Card key={branch.id} className="border-border hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/branches/${branch.id}`}>
                          <CardTitle className="text-lg hover:underline cursor-pointer">{branch.name}</CardTitle>
                        </Link>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {branch.address ? `${branch.address}, ${branch.city}` : branch.city}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={branch.status === 'active' ? 'default' : 'secondary'}>
                          {branch.status}
                        </Badge>
                        <Link href={`/branches/${branch.id}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.preventDefault()
                            handleDeleteBranch(branch.id, branch.name)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {branch.phone || 'N/A'}
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Patients</p>
                        <p className="text-lg font-bold text-foreground">{branch.patients_count.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Staff</p>
                        <p className="text-lg font-bold text-foreground">{branch.staff_count}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Table View */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>All Branches</CardTitle>
                <CardDescription>Complete list of all branch locations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-foreground font-semibold">Branch Name</TableHead>
                        <TableHead className="text-foreground font-semibold">Location</TableHead>
                        <TableHead className="text-foreground font-semibold">Phone</TableHead>
                        <TableHead className="text-foreground font-semibold">Patients</TableHead>
                        <TableHead className="text-foreground font-semibold">Staff</TableHead>
                        <TableHead className="text-foreground font-semibold">Status</TableHead>
                        <TableHead className="text-foreground font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {branches.map((branch) => (
                        <TableRow key={branch.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell>
                            <Link href={`/branches/${branch.id}`} className="font-medium text-foreground hover:underline">
                              {branch.name}
                            </Link>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {branch.address ? `${branch.address}, ${branch.city}` : branch.city}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{branch.phone}</TableCell>
                          <TableCell className="font-medium text-foreground">{branch.patients_count.toLocaleString()}</TableCell>
                          <TableCell className="font-medium text-foreground">{branch.staff_count}</TableCell>
                          <TableCell>
                            <Badge variant={branch.status === 'active' ? 'default' : 'secondary'}>
                              {branch.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Link href={`/branches/${branch.id}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Pencil className="w-4 h-4" />
                                </Button>
                              </Link>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                onClick={() => handleDeleteBranch(branch.id, branch.name)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
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
