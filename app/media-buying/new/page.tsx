'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Save, Trash2, ExternalLink, Link as LinkIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'

interface DailyData {
  id: number
  day: string
  date: string
  adIdSpend: string
  results: number
  cpr: number
  spend: number
  impressions: number
  clicks: number
  ctr: number
}

interface AdIdEntry {
  id: number
  adId: string
  link: string
  dailySpend: string
}

export default function NewCampaignPage() {
  const [campaignName, setCampaignName] = useState('')
  const [platform, setPlatform] = useState('')
  const [resultType, setResultType] = useState('')
  const [status, setStatus] = useState('active')
  const [isClient, setIsClient] = useState(false)
  
  // Ad IDs with links
  const [adIds, setAdIds] = useState<AdIdEntry[]>([
    { id: 1, adId: '', link: '', dailySpend: '' }
  ])

  const [dailyData, setDailyData] = useState<DailyData[]>([
    { id: 1, day: 'Day 1', date: '2024-12-01', adIdSpend: '', results: 0, cpr: 0, spend: 0, impressions: 0, clicks: 0, ctr: 0 },
  ])

  // Set client flag to enable dynamic operations
  useEffect(() => {
    setIsClient(true)
  }, [])

  const platformResultTypes: Record<string, string[]> = {
    Facebook: ['Leads', 'Messages', 'Profile Visits'],
    Google: ['Leads', 'Website Clicks', 'Phone Calls'],
    Instagram: ['Leads', 'Messages', 'Profile Visits'],
    TikTok: ['Leads', 'Messages', 'Profile Visits'],
  }

  // Ad ID management - use timestamp only on client
  const addAdId = () => {
    const newId = isClient ? Date.now() : adIds.length + 100
    setAdIds([...adIds, { id: newId, adId: '', link: '', dailySpend: '' }])
  }

  const removeAdId = (id: number) => {
    if (adIds.length > 1) {
      setAdIds(adIds.filter(a => a.id !== id))
    }
  }

  const updateAdId = (id: number, field: 'adId' | 'link' | 'dailySpend', value: string) => {
    setAdIds(adIds.map(a => {
      if (a.id === id) {
        return { ...a, [field]: value }
      }
      return a
    }))
  }

  const addDay = () => {
    const newDay = dailyData.length + 1
    const lastDate = dailyData.length > 0 ? new Date(dailyData[dailyData.length - 1].date) : new Date('2024-12-01')
    lastDate.setDate(lastDate.getDate() + 1)
    const newDate = lastDate.toISOString().split('T')[0]
    const newId = isClient ? Date.now() : dailyData.length + 100
    
    setDailyData([
      ...dailyData,
      { id: newId, day: `Day ${newDay}`, date: newDate, adIdSpend: '', results: 0, cpr: 0, spend: 0, impressions: 0, clicks: 0, ctr: 0 }
    ])
  }

  const removeDay = (id: number) => {
    if (dailyData.length > 1) {
      setDailyData(dailyData.filter(d => d.id !== id))
    }
  }

  const updateDailyData = (id: number, field: keyof DailyData, value: string | number) => {
    setDailyData(dailyData.map(d => {
      if (d.id === id) {
        const updated = { ...d, [field]: value }
        // Auto-calculate CPR and CTR
        if (field === 'spend' || field === 'results') {
          const spend = field === 'spend' ? Number(value) : d.spend
          const results = field === 'results' ? Number(value) : d.results
          updated.cpr = results > 0 ? spend / results : 0
        }
        if (field === 'clicks' || field === 'impressions') {
          const clicks = field === 'clicks' ? Number(value) : d.clicks
          const impressions = field === 'impressions' ? Number(value) : d.impressions
          updated.ctr = impressions > 0 ? (clicks / impressions) * 100 : 0
        }
        return updated
      }
      return d
    }))
  }

  // Calculate totals
  const totals = dailyData.reduce((acc, d) => ({
    results: acc.results + d.results,
    spend: acc.spend + d.spend,
    impressions: acc.impressions + d.impressions,
    clicks: acc.clicks + d.clicks,
  }), { results: 0, spend: 0, impressions: 0, clicks: 0 })

  const avgCPR = totals.results > 0 ? totals.spend / totals.results : 0
  const avgCTR = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/media-buying">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">Add New Campaign</h1>
            <p className="text-muted-foreground mt-1">Create a new advertising campaign with daily performance tracking</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Campaign
          </Button>
        </div>

        {/* Campaign Details */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Enter the basic information for your campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label htmlFor="campaignName">Campaign Name</Label>
                <Input
                  id="campaignName"
                  placeholder="e.g., Facebook Leads - Teeth Whitening"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select value={platform} onValueChange={(value) => { setPlatform(value); setResultType('') }}>
                  <SelectTrigger id="platform">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Google">Google</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="TikTok">TikTok</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="resultType">Result Type</Label>
                <Select value={resultType} onValueChange={setResultType} disabled={!platform}>
                  <SelectTrigger id="resultType">
                    <SelectValue placeholder={platform ? "Select result type" : "Select platform first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {platform && platformResultTypes[platform]?.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ad IDs with Links */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-primary" />
                  Ad IDs & Links
                </CardTitle>
                <CardDescription>Add Ad IDs and their external links for quick access to the ad platform</CardDescription>
              </div>
              <Button onClick={addAdId} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Ad ID
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {adIds.map((adId, index) => (
                <div key={adId.id} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-muted/30">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`adId-${adId.id}`}>Ad ID #{index + 1}</Label>
                      <Input
                        id={`adId-${adId.id}`}
                        placeholder="e.g., FB_001"
                        value={adId.adId}
                        onChange={(e) => updateAdId(adId.id, 'adId', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`dailySpend-${adId.id}`}>Daily Spend</Label>
                      <Input
                        id={`dailySpend-${adId.id}`}
                        placeholder="e.g., 500"
                        type="number"
                        min="0"
                        value={adId.dailySpend}
                        onChange={(e) => updateAdId(adId.id, 'dailySpend', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`link-${adId.id}`}>External Link</Label>
                      <div className="flex gap-2">
                        <Input
                          id={`link-${adId.id}`}
                          placeholder="https://facebook.com/adsmanager/..."
                          value={adId.link}
                          onChange={(e) => updateAdId(adId.id, 'link', e.target.value)}
                          className="flex-1"
                        />
                        {adId.link && (
                          <a 
                            href={adId.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex"
                          >
                            <Button variant="outline" size="icon" type="button">
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeAdId(adId.id)}
                    disabled={adIds.length === 1}
                    className="text-destructive hover:text-destructive mt-6"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              {/* Preview of added Ad IDs */}
              {adIds.some(a => a.adId) && (
                <div className="pt-4 border-t border-border">
                  <Label className="text-sm text-muted-foreground">Added Ad IDs:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {adIds.filter(a => a.adId).map((adId) => (
                      <Badge key={adId.id} variant="outline" className="flex items-center gap-1">
                        {adId.adId}
                        {adId.link && (
                          <a href={adId.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3 h-3 text-primary" />
                          </a>
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Campaign Insights Summary */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totals.results.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{resultType || 'Results'}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Spend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${totals.spend.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Across all days</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Avg. CPR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${avgCPR.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Cost per result</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Impressions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totals.impressions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Views</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Avg. CTR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{avgCTR.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground mt-1">Click-through rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Daily Performance Breakdown */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Daily Performance Breakdown</CardTitle>
                <CardDescription>Track performance day by day - update data as the campaign runs</CardDescription>
              </div>
              <Button onClick={addDay} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Day
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[80px]">Day</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[130px]">Date</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[120px]">ID Spend</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[100px]">Results</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[120px]">Spend ($)</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[100px]">CPR ($)</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[120px]">Impressions</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[100px]">Clicks</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[100px]">CTR (%)</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyData.map((day, index) => (
                    <TableRow key={day.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <Badge variant="outline">Day {index + 1}</Badge>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="date"
                          value={day.date}
                          onChange={(e) => updateDailyData(day.id, 'date', e.target.value)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={day.adIdSpend} 
                          onValueChange={(value) => updateDailyData(day.id, 'adIdSpend', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Ad ID" />
                          </SelectTrigger>
                          <SelectContent>
                            {adIds.filter(a => a.adId).map((adId) => (
                              <SelectItem key={adId.id} value={adId.adId}>{adId.adId}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={day.results || ''}
                          onChange={(e) => updateDailyData(day.id, 'results', Number(e.target.value))}
                          placeholder="0"
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={day.spend || ''}
                          onChange={(e) => updateDailyData(day.id, 'spend', Number(e.target.value))}
                          placeholder="0.00"
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground font-medium">${day.cpr.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={day.impressions || ''}
                          onChange={(e) => updateDailyData(day.id, 'impressions', Number(e.target.value))}
                          placeholder="0"
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={day.clicks || ''}
                          onChange={(e) => updateDailyData(day.id, 'clicks', Number(e.target.value))}
                          placeholder="0"
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground font-medium">{day.ctr.toFixed(2)}%</span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDay(day.id)}
                          disabled={dailyData.length === 1}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Totals Row */}
                  <TableRow className="bg-muted/30 font-semibold border-t-2">
                    <TableCell>Total</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell className="text-foreground">{totals.results.toLocaleString()}</TableCell>
                    <TableCell className="text-foreground">${totals.spend.toLocaleString()}</TableCell>
                    <TableCell className="text-primary">${avgCPR.toFixed(2)}</TableCell>
                    <TableCell className="text-foreground">{totals.impressions.toLocaleString()}</TableCell>
                    <TableCell className="text-foreground">{totals.clicks.toLocaleString()}</TableCell>
                    <TableCell className="text-primary">{avgCTR.toFixed(2)}%</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Link href="/media-buying">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Campaign
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
