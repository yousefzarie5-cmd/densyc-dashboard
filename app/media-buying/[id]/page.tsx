'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Save, Trash2, TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react'
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
  adSpends: Record<string, number>
  results: number
  cpr: number
  spend: number
  impressions: number
  clicks: number
  ctr: number
}

// Sample campaign data (in real app, fetch by ID)
const sampleCampaign = {
  id: 1,
  name: 'Facebook Leads - Teeth Whitening',
  platform: 'Facebook',
  resultType: 'Messages',
  status: 'active',
  adIds: 'FB_001, FB_002, FB_003, FB_004, FB_005',
  dailyData: [
    { id: 1, day: 'Day 1', date: '2024-12-01', adSpends: { FB_001: 150, FB_002: 80, FB_003: 90, FB_004: 50, FB_005: 30 }, results: 32, cpr: 12.50, spend: 400, impressions: 6000, clicks: 160, ctr: 2.67 },
    { id: 2, day: 'Day 2', date: '2024-12-02', adSpends: { FB_001: 160, FB_002: 70, FB_003: 85, FB_004: 55, FB_005: 30 }, results: 28, cpr: 14.29, spend: 400, impressions: 5500, clicks: 145, ctr: 2.64 },
    { id: 3, day: 'Day 3', date: '2024-12-03', adSpends: { FB_001: 120, FB_002: 110, FB_003: 100, FB_004: 90, FB_005: 80 }, results: 45, cpr: 11.11, spend: 500, impressions: 7500, clicks: 210, ctr: 2.80 },
    { id: 4, day: 'Day 4', date: '2024-12-04', adSpends: { FB_001: 110, FB_002: 100, FB_003: 110, FB_004: 90, FB_005: 90 }, results: 38, cpr: 13.16, spend: 500, impressions: 7000, clicks: 185, ctr: 2.64 },
    { id: 5, day: 'Day 5', date: '2024-12-05', adSpends: { FB_001: 130, FB_002: 120, FB_003: 100, FB_004: 100, FB_005: 100 }, results: 52, cpr: 10.58, spend: 550, impressions: 8500, clicks: 250, ctr: 2.94 },
    { id: 6, day: 'Day 6', date: '2024-12-06', adSpends: { FB_001: 100, FB_002: 90, FB_003: 80, FB_004: 90, FB_005: 90 }, results: 30, cpr: 15.00, spend: 450, impressions: 6500, clicks: 175, ctr: 2.69 },
    { id: 7, day: 'Day 7', date: '2024-12-07', adSpends: { FB_001: 60, FB_002: 50, FB_003: 50, FB_004: 45, FB_005: 45 }, results: 20, cpr: 12.50, spend: 250, impressions: 4000, clicks: 95, ctr: 2.38 },
  ]
}

export default function CampaignDetailPage() {
  const params = useParams()
  
  const [campaignName, setCampaignName] = useState(sampleCampaign.name)
  const [platform, setPlatform] = useState(sampleCampaign.platform)
  const [resultType, setResultType] = useState(sampleCampaign.resultType)
  const [status, setStatus] = useState(sampleCampaign.status)
  const [adIds, setAdIds] = useState(sampleCampaign.adIds)
  const adIdList = adIds.split(',').map(s => s.trim()).filter(Boolean)

  const [dailyData, setDailyData] = useState<DailyData[]>(sampleCampaign.dailyData)

  const platformResultTypes: Record<string, string[]> = {
    Facebook: ['Leads', 'Messages', 'Profile Visits'],
    Google: ['Leads', 'Website Clicks', 'Phone Calls'],
    Instagram: ['Leads', 'Messages', 'Profile Visits'],
    TikTok: ['Leads', 'Messages', 'Profile Visits'],
  }

  const addDay = () => {
    const newDay = dailyData.length + 1
    const lastDate = dailyData.length > 0 ? new Date(dailyData[dailyData.length - 1].date) : new Date()
    lastDate.setDate(lastDate.getDate() + 1)
    const newDate = lastDate.toISOString().split('T')[0]
    
    setDailyData([
      ...dailyData,
      { id: Date.now(), day: `Day ${newDay}`, date: newDate, adSpends: Object.fromEntries(adIdList.map(id => [id, 0])), results: 0, cpr: 0, spend: 0, impressions: 0, clicks: 0, ctr: 0 }
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

  const updateAdSpend = (rowId: number, adId: string, value: number) => {
    setDailyData(dailyData.map(d =>
      d.id === rowId ? { ...d, adSpends: { ...d.adSpends, [adId]: value } } : d
    ))
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

  // Calculate trends (compare last day to average)
  const lastDay = dailyData[dailyData.length - 1]
  const cprTrend = lastDay && avgCPR > 0 ? ((lastDay.cpr - avgCPR) / avgCPR) * 100 : 0
  const ctrTrend = lastDay && avgCTR > 0 ? ((lastDay.ctr - avgCTR) / avgCTR) * 100 : 0

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
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">{campaignName || 'Campaign Details'}</h1>
              <Badge variant={status === 'active' ? 'default' : 'secondary'}>{status}</Badge>
            </div>
            <p className="text-muted-foreground mt-1">Campaign ID: {params.id} | Edit campaign details and update daily performance</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>

        {/* Campaign Insights Summary */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Total Results</span>
                <Target className="w-4 h-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totals.results.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{resultType}</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Total Spend</span>
                <DollarSign className="w-4 h-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${totals.spend.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">{dailyData.length} days</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Avg. CPR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${avgCPR.toFixed(2)}</div>
              <div className={`text-xs mt-1 flex items-center gap-1 ${cprTrend < 0 ? 'text-green-600' : 'text-red-600'}`}>
                {cprTrend < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                {Math.abs(cprTrend).toFixed(1)}% vs last day
              </div>
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
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totals.clicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Engagements</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Avg. CTR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{avgCTR.toFixed(2)}%</div>
              <div className={`text-xs mt-1 flex items-center gap-1 ${ctrTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {ctrTrend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {Math.abs(ctrTrend).toFixed(1)}% vs last day
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Details */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Edit the basic information for your campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="adIds">Ad IDs (comma separated)</Label>
                <Input
                  id="adIds"
                  placeholder="e.g., FB_001, FB_002, FB_003"
                  value={adIds}
                  onChange={(e) => setAdIds(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
                    {adIdList.map(adId => (
                      <TableHead key={adId} className="text-foreground font-semibold whitespace-nowrap min-w-[110px]">{adId} ($)</TableHead>
                    ))}
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
                      {adIdList.map(adId => (
                        <TableCell key={adId}>
                          <Input
                            type="number"
                            step="0.01"
                            value={day.adSpends?.[adId] || ''}
                            onChange={(e) => updateAdSpend(day.id, adId, Number(e.target.value))}
                            placeholder="0.00"
                            className="w-full"
                          />
                        </TableCell>
                      ))}
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
                    {adIdList.map(adId => (
                      <TableCell key={adId} className="text-foreground font-semibold">
                        ${dailyData.reduce((s, d) => s + (d.adSpends?.[adId] || 0), 0).toLocaleString()}
                      </TableCell>
                    ))}
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
          <Button variant="destructive">Delete Campaign</Button>
          <Button className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
