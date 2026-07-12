'use client'

import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Mail, Filter, Download, Pencil, Shield } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'

const users = [
  {
    id: 1,
    name: 'Dr. Ahmed Hassan',
    email: 'ahmed.hassan@densyc.com',
    role: 'Clinic Owner',
    branches: ['Main Branch', 'Downtown Branch', 'Uptown Branch', 'West Side Branch'],
    status: 'active',
    lastLogin: '2024-12-15 10:30',
    permissions: 9,
  },
  {
    id: 2,
    name: 'Sara Ahmed',
    email: 'sara.ahmed@densyc.com',
    role: 'Receptionist',
    branches: ['Main Branch'],
    status: 'active',
    lastLogin: '2024-12-15 09:15',
    permissions: 4,
  },
  {
    id: 3,
    name: 'Mohamed Karim',
    email: 'mohamed.karim@densyc.com',
    role: 'Receptionist',
    branches: ['Downtown Branch'],
    status: 'active',
    lastLogin: '2024-12-14 16:45',
    permissions: 4,
  },
  {
    id: 4,
    name: 'Nour Hassan',
    email: 'nour.hassan@densyc.com',
    role: 'Moderator',
    branches: ['Main Branch', 'Downtown Branch'],
    status: 'active',
    lastLogin: '2024-12-15 11:00',
    permissions: 5,
  },
  {
    id: 5,
    name: 'Youssef Ali',
    email: 'youssef.ali@densyc.com',
    role: 'Media Buyer',
    branches: ['Main Branch', 'Downtown Branch', 'Uptown Branch', 'West Side Branch'],
    status: 'active',
    lastLogin: '2024-12-15 08:45',
    permissions: 5,
  },
  {
    id: 6,
    name: 'Fatima Mahmoud',
    email: 'fatima.mahmoud@densyc.com',
    role: 'Accountant',
    branches: ['Main Branch', 'Downtown Branch', 'Uptown Branch', 'West Side Branch'],
    status: 'active',
    lastLogin: '2024-12-14 17:30',
    permissions: 5,
  },
  {
    id: 7,
    name: 'Omar Ibrahim',
    email: 'omar.ibrahim@densyc.com',
    role: 'Content Creator',
    branches: ['Main Branch', 'Downtown Branch'],
    status: 'active',
    lastLogin: '2024-12-14 14:20',
    permissions: 3,
  },
  {
    id: 8,
    name: 'Layla Mostafa',
    email: 'layla.mostafa@densyc.com',
    role: 'Receptionist',
    branches: ['Uptown Branch'],
    status: 'inactive',
    lastLogin: '2024-12-10 12:00',
    permissions: 4,
  },
]

const roleColors: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  'Clinic Owner': 'default',
  'Moderator': 'secondary',
  'Receptionist': 'outline',
  'Accountant': 'outline',
  'Media Buyer': 'secondary',
  'Content Creator': 'outline',
}

const roleDescriptions: Record<string, string> = {
  'Clinic Owner': 'Full system access and management',
  'Moderator': 'Manages patient leads and follow-ups',
  'Receptionist': 'Handles bookings and patient communication',
  'Accountant': 'Financial reporting and payments',
  'Media Buyer': 'Advertising campaigns and budgets',
  'Content Creator': 'Marketing content and social media',
}

export default function UsersPage() {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
  }

  const roleCount = (role: string) => users.filter((u) => u.role === role).length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Users</h1>
            <p className="text-muted-foreground mt-1">Manage team members and their roles</p>
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
            <Link href="/users/new">
              <Button className="bg-primary hover:bg-primary/90">
                <Mail className="w-4 h-4 mr-2" />
                Invite User
              </Button>
            </Link>
          </div>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.keys(roleDescriptions).map((role) => (
            <Card key={role} className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{role}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{roleCount(role)}</div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{roleDescriptions[role]}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{users.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all branches</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{users.filter((u) => u.status === 'active').length}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently active</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{users.filter((u) => u.status === 'inactive').length}</div>
              <p className="text-xs text-muted-foreground mt-1">Need attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>All users and their roles across branches</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-foreground font-semibold">Name</TableHead>
                    <TableHead className="text-foreground font-semibold">Email</TableHead>
                    <TableHead className="text-foreground font-semibold">Role</TableHead>
                    <TableHead className="text-foreground font-semibold">Branches</TableHead>
                    <TableHead className="text-foreground font-semibold">Permissions</TableHead>
                    <TableHead className="text-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-foreground font-semibold">Last Login</TableHead>
                    <TableHead className="text-foreground font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <Link href={`/users/${user.id}`} className="font-medium text-foreground hover:underline">
                            {user.name}
                          </Link>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant={roleColors[user.role] || 'outline'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {user.branches.length === 4 ? (
                            <Badge variant="outline" className="text-xs">All Branches</Badge>
                          ) : user.branches.slice(0, 2).map((branch, i) => (
                            <Badge key={i} variant="outline" className="text-xs">{branch.replace(' Branch', '')}</Badge>
                          ))}
                          {user.branches.length > 2 && user.branches.length < 4 && (
                            <Badge variant="outline" className="text-xs">+{user.branches.length - 2}</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Shield className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{user.permissions} modules</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{user.lastLogin}</TableCell>
                      <TableCell>
                        <Link href={`/users/${user.id}`}>
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
