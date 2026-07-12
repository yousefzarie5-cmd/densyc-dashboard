'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, TrendingUp, DollarSign, Target, MessageSquare, ExternalLink, Filter, Download, CalendarIcon, Pencil, X } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'

// Sample campaign data
const campaigns = [
  {
    id: 1,
    name: 'Facebook Leads - Teeth Whitening',
    platform: 'Facebook',
    resultType: 'Messages',
    results: 245,
    cpr: 12.50,
    spend: 3062.50,
    impressions: 45000,
    clicks: 1200,
    ctr: 2.67,
    status: 'active',
    adIds: ['FB_001', 'FB_002', 'FB_003'],
  },
  {
    id: 2,
    name: 'Google Ads - Dental Implants',
    platform: 'Google',
    resultType: 'Leads',
    results: 89,
    cpr: 45.00,
    spend: 4005.00,
    impressions: 28000,
    clicks: 560,
    ctr: 2.00,
    status: 'active',
    adIds: ['GA_001', 'GA_002'],
  },
  {
    id: 3,
    name: 'Instagram DM - Braces Promo',
    platform: 'Instagram',
    resultType: 'Messages',
    results: 178,
    cpr: 8.75,
    spend: 1557.50,
    impressions: 62000,
    clicks: 2100,
    ctr: 3.39,
    status: 'active',
    adIds: ['IG_001', 'IG_002', 'IG_003', 'IG_004'],
  },
  {
    id: 4,
    name: 'Facebook - General Awareness',
    platform: 'Facebook',
    resultType: 'Profile Visits',
    results: 1250,
    cpr: 1.20,
    spend: 1500.00,
    impressions: 125000,
    clicks: 3750,
    ctr: 3.00,
    status: 'paused',
    adIds: ['FB_004', 'FB_005'],
  },
  {
    id: 5,
    name: 'TikTok - Veneers Showcase',
    platform: 'TikTok',
    resultType: 'Messages',
    results: 95,
    cpr: 15.00,
    spend: 1425.00,
    impressions: 89000,
    clicks: 4200,
    ctr: 4.72,
    status: 'active',
    adIds: ['TT_001', 'TT_002'],
  },
  {
    id: 6,
    name: 'Google Ads - Emergency Dental',
    platform: 'Google',
    resultType: 'Leads',
    results: 42,
    cpr: 22.50,
    spend: 945.00,
    impressions: 15000,
    clicks: 280,
    ctr: 1.87,
    status: 'active',
    adIds: ['GA_003'],
  },
]

// Platform-specific result types breakdown
const platformResultsData = {
  Facebook: {
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    results: [
      { type: 'Leads', count: 156, cpr: 14.50 },
      { type: 'Messages', count: 245, cpr: 12.50 },
      { type: 'Profile Visits', count: 1250, cpr: 1.20 },
    ],
    totalSpend: 4562.50,
  },
  Google: {
    color: 'bg-red-500/10 text-red-600 border-red-500/20',
    results: [
      { type: 'Leads', count: 131, cpr: 37.79 },
      { type: 'Website Clicks', count: 840, cpr: 5.90 },
      { type: 'Phone Calls', count: 45, cpr: 22.00 },
    ],
    totalSpend: 4950.00,
  },
  Instagram: {
    color: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
    results: [
      { type: 'Leads', count: 89, cpr: 9.50 },
      { type: 'Messages', count: 178, cpr: 8.75 },
      { type: 'Profile Visits', count: 2340, cpr: 0.65 },
    ],
    totalSpend: 1557.50,
  },
  TikTok: {
    color: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    results: [
      { type: 'Leads', count: 42, cpr: 18.00 },
      { type: 'Messages', count: 95, cpr: 15.00 },
      { type: 'Profile Visits', count: 4200, cpr: 0.34 },
    ],
    totalSpend: 1425.00,
  },
}

const getPlatformColor = (platform: string) => {
  switch (platform) {
    case 'Facebook':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    case 'Google':
      return 'bg-red-500/10 text-red-600 border-red-500/20'
    case 'Instagram':
      return 'bg-pink-500/10 text-pink-600 border-pink-500/20'
    case 'TikTok':
      return 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20'
    default:
      return ''
  }
}

// Filter options
const platforms = ['Facebook', 'Google', 'Instagram', 'TikTok']
const statuses = ['active', 'paused', 'completed']
const resultTypes = ['Leads', 'Messages', 'Profile Visits', 'Website Clicks', 'Phone Calls']

export default function MediaBuyingPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [isClient, setIsClient] = useState(false)

  // Set date range only on client to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true)
    setDateRange({
      from: subDays(new Date(), 30),
      to: new Date(),
    })
  }, [])

  // Filter states
  const [filters, setFilters] = useState({
    platforms: [] as string[],
    statuses: [] as string[],
    resultTypes: [] as string[],
    minSpend: '',
    maxSpend: '',
    minCPR: '',
    maxCPR: '',
  })

  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Apply filters
  const filteredCampaigns = campaigns.filter((campaign) => {
    // Platform filter
    if (filters.platforms.length > 0 && !filters.platforms.includes(campaign.platform)) {
      return false
    }
    // Status filter
    if (filters.statuses.length > 0 && !filters.statuses.includes(campaign.status)) {
      return false
    }
    // Result type filter
    if (filters.resultTypes.length > 0 && !filters.resultTypes.includes(campaign.resultType)) {
      return false
    }
    // Spend range filter
    if (filters.minSpend && campaign.spend < parseFloat(filters.minSpend)) {
      return false
    }
    if (filters.maxSpend && campaign.spend > parseFloat(filters.maxSpend)) {
      return false
    }
    // CPR range filter
    if (filters.minCPR && campaign.cpr < parseFloat(filters.minCPR)) {
      return false
    }
    if (filters.maxCPR && campaign.cpr > parseFloat(filters.maxCPR)) {
      return false
    }
    return true
  })

  const toggleFilter = (type: 'platforms' | 'statuses' | 'resultTypes', value: string) => {
    setFilters(prev => {
      const current = prev[type]
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
      return { ...prev, [type]: updated }
    })
  }

  const clearFilters = () => {
    setFilters({
      platforms: [],
      statuses: [],
      resultTypes: [],
      minSpend: '',
      maxSpend: '',
      minCPR: '',
      maxCPR: '',
    })
  }

  const activeFilterCount = 
    filters.platforms.length + 
    filters.statuses.length + 
    filters.resultTypes.length + 
    (filters.minSpend ? 1 : 0) + 
    (filters.maxSpend ? 1 : 0) + 
    (filters.minCPR ? 1 : 0) + 
    (filters.maxCPR ? 1 : 0)

  const totalSpend = filteredCampaigns.reduce((acc, c) => acc + c.spend, 0)
  const totalResults = filteredCampaigns.reduce((acc, c) => acc + c.results, 0)
  const avgCPR = totalResults > 0 ? totalSpend / totalResults : 0
  const activeCampaigns = filteredCampaigns.filter((c) => c.status === 'active').length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Media Buying</h1>
            <p className="text-muted-foreground mt-1">Manage your advertising campaigns and track performance</p>
          </div>
          <div className="flex gap-2">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                  {activeFilterCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Filter Campaigns</SheetTitle>
                  <SheetDescription>
                    Apply filters to narrow down your campaign list
                  </SheetDescription>
                </SheetHeader>
                <div className="py-6 space-y-6">
                  {/* Platform Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Platform</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {platforms.map((platform) => (
                        <div key={platform} className="flex items-center space-x-2">
                          <Checkbox
                            id={`platform-${platform}`}
                            checked={filters.platforms.includes(platform)}
                            onCheckedChange={() => toggleFilter('platforms', platform)}
                          />
                          <Label htmlFor={`platform-${platform}`} className="text-sm cursor-pointer">
                            {platform}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {statuses.map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status}`}
                            checked={filters.statuses.includes(status)}
                            onCheckedChange={() => toggleFilter('statuses', status)}
                          />
                          <Label htmlFor={`status-${status}`} className="text-sm cursor-pointer capitalize">
                            {status}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Result Type Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Result Type</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {resultTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`type-${type}`}
                            checked={filters.resultTypes.includes(type)}
                            onCheckedChange={() => toggleFilter('resultTypes', type)}
                          />
                          <Label htmlFor={`type-${type}`} className="text-sm cursor-pointer">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Spend Range */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Spend Range ($)</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Min</Label>
                        <input
                          type="number"
                          placeholder="0"
                          value={filters.minSpend}
                          onChange={(e) => setFilters(prev => ({ ...prev, minSpend: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border rounded-md border-border bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Max</Label>
                        <input
                          type="number"
                          placeholder="10000"
                          value={filters.maxSpend}
                          onChange={(e) => setFilters(prev => ({ ...prev, maxSpend: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border rounded-md border-border bg-background"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CPR Range */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Cost Per Result Range ($)</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Min</Label>
                        <input
                          type="number"
                          placeholder="0"
                          value={filters.minCPR}
                          onChange={(e) => setFilters(prev => ({ ...prev, minCPR: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border rounded-md border-border bg-background"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Max</Label>
                        <input
                          type="number"
                          placeholder="100"
                          value={filters.maxCPR}
                          onChange={(e) => setFilters(prev => ({ ...prev, maxCPR: e.target.value }))}
                          className="w-full px-3 py-2 text-sm border rounded-md border-border bg-background"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <SheetFooter className="flex gap-2">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All
                  </Button>
                  <Button onClick={() => setIsFilterOpen(false)}>
                    Apply Filters
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
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
            <Link href="/media-buying/new">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Campaign
              </Button>
            </Link>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {filters.platforms.map((platform) => (
              <Badge key={platform} variant="secondary" className="flex items-center gap-1">
                {platform}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => toggleFilter('platforms', platform)} 
                />
              </Badge>
            ))}
            {filters.statuses.map((status) => (
              <Badge key={status} variant="secondary" className="flex items-center gap-1 capitalize">
                {status}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => toggleFilter('statuses', status)} 
                />
              </Badge>
            ))}
            {filters.resultTypes.map((type) => (
              <Badge key={type} variant="secondary" className="flex items-center gap-1">
                {type}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => toggleFilter('resultTypes', type)} 
                />
              </Badge>
            ))}
            {filters.minSpend && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Min Spend: ${filters.minSpend}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, minSpend: '' }))} 
                />
              </Badge>
            )}
            {filters.maxSpend && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Max Spend: ${filters.maxSpend}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, maxSpend: '' }))} 
                />
              </Badge>
            )}
            {filters.minCPR && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Min CPR: ${filters.minCPR}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, minCPR: '' }))} 
                />
              </Badge>
            )}
            {filters.maxCPR && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Max CPR: ${filters.maxCPR}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => setFilters(prev => ({ ...prev, maxCPR: '' }))} 
                />
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
              Clear all
            </Button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Total Spend</span>
                <DollarSign className="w-4 h-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${totalSpend.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeFilterCount > 0 ? 'Filtered campaigns' : 'Across all campaigns'}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Total Results</span>
                <Target className="w-4 h-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalResults.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Messages, leads, visits</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Avg. CPR</span>
                <TrendingUp className="w-4 h-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${avgCPR.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">Cost per result</p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Active Campaigns</span>
                <MessageSquare className="w-4 h-4 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{activeCampaigns}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeFilterCount > 0 ? `of ${filteredCampaigns.length} filtered` : 'Currently running'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>
              {activeFilterCount > 0 
                ? `Filtered Campaigns (${filteredCampaigns.length})` 
                : 'All Campaigns'}
            </CardTitle>
            <CardDescription>Overview of all advertising campaigns and their metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-foreground font-semibold whitespace-nowrap min-w-[250px]">Campaign Name</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap">Platform</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap">Result Type</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap text-right">Results</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap text-right">CPR</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap text-right">Spend</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap text-right">Impressions</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap text-right">Clicks</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap text-right">CTR</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap">Ad IDs</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap">Status</TableHead>
                    <TableHead className="text-foreground font-semibold whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCampaigns.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                        No campaigns match your filters. Try adjusting your filter criteria.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCampaigns.map((campaign) => (
                      <TableRow key={campaign.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-medium">
                          <Link href={`/media-buying/${campaign.id}`} className="hover:underline flex items-center gap-1">
                            {campaign.name}
                            <ExternalLink className="w-3 h-3 text-muted-foreground" />
                          </Link>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getPlatformColor(campaign.platform)}`}>
                            {campaign.platform}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{campaign.resultType}</TableCell>
                        <TableCell className="text-right font-medium">{campaign.results.toLocaleString()}</TableCell>
                        <TableCell className="text-right font-medium">${campaign.cpr.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">${campaign.spend.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{campaign.impressions.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{campaign.clicks.toLocaleString()}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{campaign.ctr.toFixed(2)}%</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap max-w-[150px]">
                            {campaign.adIds.slice(0, 2).map((id) => (
                              <Badge key={id} variant="outline" className="text-xs font-mono">
                                {id}
                              </Badge>
                            ))}
                            {campaign.adIds.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{campaign.adIds.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                            {campaign.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Link href={`/media-buying/${campaign.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Pencil className="w-4 h-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Results by Platform - Specific result types */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Object.entries(platformResultsData).map(([platform, data]) => (
            <Card key={platform} className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium border ${data.color}`}>
                    {platform}
                  </span>
                  Results Breakdown
                </CardTitle>
                <CardDescription>
                  Total Spend: ${data.totalSpend.toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.results.map((result) => (
                    <div key={result.type} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium text-foreground">{result.type}</p>
                        <p className="text-xs text-muted-foreground">CPR: ${result.cpr.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-foreground">{result.count.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">results</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Spend by Platform */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Spend Distribution</CardTitle>
            <CardDescription>Ad spend breakdown across all platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(platformResultsData).map(([platform, data]) => {
              const totalPlatformSpend = Object.values(platformResultsData).reduce((acc, p) => acc + p.totalSpend, 0)
              const percentage = (data.totalSpend / totalPlatformSpend) * 100
              return (
                <div key={platform} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${data.color}`}>
                      {platform}
                    </span>
                    <span className="text-sm font-medium">${data.totalSpend.toLocaleString()} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
