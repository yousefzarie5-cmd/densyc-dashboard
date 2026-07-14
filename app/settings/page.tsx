'use client'

import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Save, Bell, Lock, Users, Zap } from 'lucide-react'
import { useAuth, type Role, type Permission } from '@/components/auth-context'

export default function SettingsPage() {
  const { permissions, updatePermissions } = useAuth()
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and system preferences</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
            <TabsTrigger value="general" className="py-2">General</TabsTrigger>
            <TabsTrigger value="notifications" className="py-2">Notifications</TabsTrigger>
            <TabsTrigger value="security" className="py-2">Security</TabsTrigger>
            <TabsTrigger value="integrations" className="py-2">Integrations</TabsTrigger>
            <TabsTrigger value="roles" className="py-2">Roles & Permissions</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Organization Settings</CardTitle>
                <CardDescription>Update your organization information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="org-name" className="text-foreground">
                    Organization Name
                  </Label>
                  <Input
                    id="org-name"
                    defaultValue="MediHub Healthcare"
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-email" className="text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="org-email"
                    type="email"
                    defaultValue="info@medihub.com"
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-phone" className="text-foreground">
                    Phone Number
                  </Label>
                  <Input
                    id="org-phone"
                    defaultValue="(555) 123-4567"
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-address" className="text-foreground">
                    Address
                  </Label>
                  <Input
                    id="org-address"
                    defaultValue="123 Business Park, New York, NY"
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>Regional Settings</CardTitle>
                <CardDescription>Manage language and timezone preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-foreground">
                    Language
                  </Label>
                  <Select defaultValue="english">
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-foreground">
                    Timezone
                  </Label>
                  <Select defaultValue="est">
                    <SelectTrigger className="bg-input border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Standard Time</SelectItem>
                      <SelectItem value="cst">Central Standard Time</SelectItem>
                      <SelectItem value="mst">Mountain Standard Time</SelectItem>
                      <SelectItem value="pst">Pacific Standard Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Control how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { label: 'New Reservations', desc: 'Get notified when new reservations are made' },
                  { label: 'Patient Updates', desc: 'Receive alerts about patient status changes' },
                  { label: 'Payment Received', desc: 'Get notified when payments are processed' },
                  { label: 'System Alerts', desc: 'Important system and security notifications' },
                  { label: 'Marketing Reports', desc: 'Weekly marketing and analytics reports' },
                  { label: 'Appointment Reminders', desc: 'Daily reminders for upcoming appointments' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-foreground">
                    Current Password
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    className="bg-input border-border text-foreground"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-foreground">
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    className="bg-input border-border text-foreground"
                    placeholder="••••••••"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-foreground">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className="bg-input border-border text-foreground"
                    placeholder="••••••••"
                  />
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  <Save className="w-4 h-4 mr-2" />
                  Update Password
                </Button>

                <div className="mt-8 pt-6 border-t border-border space-y-4">
                  <h3 className="font-semibold text-foreground">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Connected Integrations
                </CardTitle>
                <CardDescription>Manage third-party service connections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'Google Calendar', status: 'connected', color: 'bg-blue-500' },
                  { name: 'Stripe Payments', status: 'connected', color: 'bg-purple-500' },
                  { name: 'Twilio SMS', status: 'disconnected', color: 'bg-red-500' },
                  { name: 'Mailchimp', status: 'connected', color: 'bg-yellow-500' },
                  { name: 'Slack', status: 'disconnected', color: 'bg-gray-500' },
                ].map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${integration.color}`} />
                      <div>
                        <p className="font-medium text-foreground">{integration.name}</p>
                        <p className={`text-xs ${integration.status === 'connected' ? 'text-green-500' : 'text-muted-foreground'}`}>
                          {integration.status === 'connected' ? 'Connected' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roles Settings */}
          <TabsContent value="roles" className="space-y-4">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Roles & Permissions
                </CardTitle>
                <CardDescription>Configure which features each role can access in the dashboard.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {(['Clinic Owner', 'Moderator', 'Receptionist'] as Role[]).map((r) => (
                  <div key={r} className="space-y-4">
                    <h3 className="text-lg font-semibold capitalize border-b border-border pb-2">{r} Permissions</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        { id: 'view_dashboard', label: 'View Dashboard' },
                        { id: 'manage_branches', label: 'Manage Branches' },
                        { id: 'manage_clinics', label: 'Manage Clinics' },
                        { id: 'manage_users', label: 'Manage Users' },
                        { id: 'view_patients', label: 'View Patients' },
                        { id: 'manage_media_buying', label: 'Media Buying' },
                        { id: 'view_reports', label: 'View Reports' },
                        { id: 'manage_settings', label: 'Manage Settings' },
                      ].map((perm) => (
                        <div key={perm.id} className="flex items-center justify-between p-3 border border-border rounded-lg bg-background/50 hover:bg-muted/50 transition-colors">
                          <Label className="text-sm font-medium cursor-pointer" htmlFor={`${r}-${perm.id}`}>{perm.label}</Label>
                          <Switch 
                            id={`${r}-${perm.id}`}
                            checked={permissions[r]?.includes(perm.id as Permission) ?? false}
                            onCheckedChange={(checked) => {
                              const currentPerms = permissions[r] || []
                              const newPerms = checked 
                                ? [...currentPerms, perm.id as Permission]
                                : currentPerms.filter(p => p !== perm.id)
                              updatePermissions(r, newPerms)
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
