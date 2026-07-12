'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Download, Filter, DollarSign, TrendingUp, Users, Target, CalendarIcon, FileSpreadsheet, FileText, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const revenueData = [
  { month: 'Jan', revenue: 45000, adSpend: 8000, leads: 320 },
  { month: 'Feb', revenue: 52000, adSpend: 9200, leads: 380 },
  { month: 'Mar', revenue: 48000, adSpend: 8500, leads: 345 },
  { month: 'Apr', revenue: 61000, adSpend: 11000, leads: 420 },
  { month: 'May', revenue: 58000, adSpend: 10500, leads: 395 },
  { month: 'Jun', revenue: 67000, adSpend: 12000, leads: 480 },
  { month: 'Jul', revenue: 72000, adSpend: 13500, leads: 520 },
  { month: 'Aug', revenue: 69000, adSpend: 12800, leads: 490 },
  { month: 'Sep', revenue: 78000, adSpend: 14200, leads: 560 },
  { month: 'Oct', revenue: 85000, adSpend: 15500, leads: 610 },
  { month: 'Nov', revenue: 82000, adSpend: 14800, leads: 585 },
  { month: 'Dec', revenue: 89240, adSpend: 16200, leads: 640 },
]

const sourceData = [
  { name: 'Facebook', value: 2845, fill: 'var(--primary)' },
  { name: 'Google Ads', value: 1920, fill: 'var(--chart-2)' },
  { name: 'Instagram', value: 1540, fill: 'var(--chart-3)' },
  { name: 'Referrals', value: 840, fill: 'var(--chart-4)' },
  { name: 'TikTok', value: 620, fill: 'var(--chart-5)' },
]

// Leads per Ad ID data
const adIdLeadsData = [
  { adId: 'FB_001', platform: 'Facebook', leads: 245, spend: 3062.50, cpl: 12.50, status: 'active' },
  { adId: 'FB_002', platform: 'Facebook', leads: 189, spend: 2268.00, cpl: 12.00, status: 'active' },
  { adId: 'FB_003', platform: 'Facebook', leads: 156, spend: 2028.00, cpl: 13.00, status: 'paused' },
  { adId: 'GA_001', platform: 'Google', leads: 89, spend: 4005.00, cpl: 45.00, status: 'active' },
  { adId: 'GA_002', platform: 'Google', leads: 67, spend: 3015.00, cpl: 45.00, status: 'active' },
  { adId: 'GA_003', platform: 'Google', leads: 42, spend: 945.00, cpl: 22.50, status: 'active' },
  { adId: 'IG_001', platform: 'Instagram', leads: 178, spend: 1557.50, cpl: 8.75, status: 'active' },
  { adId: 'IG_002', platform: 'Instagram', leads: 134, spend: 1172.50, cpl: 8.75, status: 'active' },
  { adId: 'IG_003', platform: 'Instagram', leads: 98, spend: 857.50, cpl: 8.75, status: 'paused' },
  { adId: 'TT_001', platform: 'TikTok', leads: 95, spend: 1425.00, cpl: 15.00, status: 'active' },
  { adId: 'TT_002', platform: 'TikTok', leads: 72, spend: 1080.00, cpl: 15.00, status: 'active' },
]

const branchData = [
  { branch: 'Main Branch', patients: 1245, revenue: 42400, leads: 520 },
  { branch: 'Downtown Branch', patients: 856, revenue: 28200, leads: 380 },
  { branch: 'Uptown Branch', patients: 623, revenue: 21800, leads: 290 },
  { branch: 'West Side Branch', patients: 412, revenue: 14600, leads: 195 },
]

// Metric definitions and calculations
const metricDefinitions = {
  cac: {
    name: 'Customer Acquisition Cost (CAC)',
    definition: 'The total cost of acquiring a new patient, including all marketing and advertising expenses.',
    formula: 'CAC = Total Ad Spend / Number of New Patients Acquired',
    interpretation: 'Lower CAC indicates more efficient marketing. Compare with patient lifetime value (LTV) - ideally LTV should be 3x or more than CAC.',
  },
  totalSpend: {
    name: 'Total Media Buying Spend',
    definition: 'The cumulative amount spent on all advertising campaigns across all platforms.',
    formula: 'Total Spend = Sum of all campaign spending',
    interpretation: 'Track month-over-month to monitor budget allocation. Should be proportional to lead generation goals.',
  },
  totalLeads: {
    name: 'Total Leads',
    definition: 'The total number of potential patients who have shown interest through ad campaigns.',
    formula: 'Total Leads = Sum of all leads from all campaigns',
    interpretation: 'Higher lead volume indicates effective reach. Quality matters too - track conversion to booked appointments.',
  },
  totalRevenue: {
    name: 'Total Revenue',
    definition: 'The total income generated from all patient services and treatments.',
    formula: 'Total Revenue = Sum of all payments received',
    interpretation: 'Compare with total spend to ensure profitability. Growing revenue with stable or decreasing CAC is ideal.',
  },
  cpl: {
    name: 'Cost Per Lead (CPL)',
    definition: 'The average cost to acquire a single lead from advertising efforts.',
    formula: 'CPL = Total Ad Spend / Total Number of Leads',
    interpretation: 'Lower CPL is better. Compare across platforms to identify most cost-effective channels.',
  },
  conversionRate: {
    name: 'Conversion Rate',
    definition: 'The percentage of leads that convert into actual patients.',
    formula: 'Conversion Rate = (Number of Patients / Number of Leads) x 100',
    interpretation: 'Industry average is 20-30%. Higher rates indicate better lead quality and effective follow-up.',
  },
  avgPatientValue: {
    name: 'Average Patient Value',
    definition: 'The average revenue generated per patient.',
    formula: 'Avg Patient Value = Total Revenue / Total Number of Patients',
    interpretation: 'Higher value indicates successful upselling and patient retention. Track over time for trends.',
  },
  roas: {
    name: 'Return on Ad Spend (ROAS)',
    definition: 'The revenue generated for every dollar spent on advertising.',
    formula: 'ROAS = Total Revenue / Total Ad Spend',
    interpretation: 'ROAS > 1 means profitable. Aim for 3-5x ROAS for sustainable growth. Compare across campaigns.',
  },
}

// Metric Card Component with Tooltip
function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  metricKey 
}: { 
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
  metricKey: keyof typeof metricDefinitions
}) {
  const metric = metricDefinitions[metricKey]
  
  return (
    <Card className="border-border hover:border-primary/50 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-1">
            {title}
            <TooltipProvider>
              <UITooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-sm p-4">
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground">{metric.name}</p>
                    <p className="text-sm text-muted-foreground">{metric.definition}</p>
                    <div className="pt-2 border-t border-border">
                      <p className="text-xs font-medium text-primary">Formula:</p>
                      <p className="text-xs text-muted-foreground font-mono bg-muted p-1 rounded mt-1">{metric.formula}</p>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs font-medium text-primary">Interpretation:</p>
                      <p className="text-xs text-muted-foreground">{metric.interpretation}</p>
                    </div>
                  </div>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </span>
          {icon}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  )
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [isClient, setIsClient] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setDateRange({
      from: subDays(new Date(), 30),
      to: new Date(),
    })
  }, [])

  // Calculate key metrics
  const totalRevenue = revenueData.reduce((acc, d) => acc + d.revenue, 0)
  const totalAdSpend = revenueData.reduce((acc, d) => acc + d.adSpend, 0)
  const totalLeads = revenueData.reduce((acc, d) => acc + d.leads, 0)
  const totalPatients = branchData.reduce((acc, b) => acc + b.patients, 0)
  
  // Customer Acquisition Cost = Total Ad Spend / Total New Patients (converted leads)
  // Assuming 24.5% conversion rate
  const convertedPatients = Math.round(totalLeads * 0.245)
  const cac = totalAdSpend / convertedPatients

  // Export to Excel
  const exportToExcel = () => {
    // Create workbook
    const wb = XLSX.utils.book_new()
    
    // Key Metrics Sheet
    const metricsData = [
      ['Metric', 'Value'],
      ['Customer Acquisition Cost', `$${cac.toFixed(2)}`],
      ['Total Media Buying Spend', `$${totalAdSpend.toLocaleString()}`],
      ['Total Leads', totalLeads.toLocaleString()],
      ['Total Revenue', `$${totalRevenue.toLocaleString()}`],
      ['Avg. Cost Per Lead', `$${(totalAdSpend / totalLeads).toFixed(2)}`],
      ['Conversion Rate', '24.5%'],
      ['Avg. Patient Value', `$${(totalRevenue / totalPatients).toFixed(2)}`],
      ['ROAS', `${(totalRevenue / totalAdSpend).toFixed(1)}x`],
    ]
    const metricsSheet = XLSX.utils.aoa_to_sheet(metricsData)
    XLSX.utils.book_append_sheet(wb, metricsSheet, 'Key Metrics')
    
    // Revenue Data Sheet
    const revenueSheetData = [
      ['Month', 'Revenue', 'Ad Spend', 'Leads'],
      ...revenueData.map(d => [d.month, d.revenue, d.adSpend, d.leads])
    ]
    const revenueSheet = XLSX.utils.aoa_to_sheet(revenueSheetData)
    XLSX.utils.book_append_sheet(wb, revenueSheet, 'Revenue Data')
    
    // Leads by Source Sheet
    const sourceSheetData = [
      ['Source', 'Leads'],
      ...sourceData.map(s => [s.name, s.value])
    ]
    const sourceSheet = XLSX.utils.aoa_to_sheet(sourceSheetData)
    XLSX.utils.book_append_sheet(wb, sourceSheet, 'Leads by Source')
    
    // Ad Performance Sheet
    const adSheetData = [
      ['Ad ID', 'Platform', 'Leads', 'Spend', 'CPL', 'Status'],
      ...adIdLeadsData.map(ad => [ad.adId, ad.platform, ad.leads, `$${ad.spend.toLocaleString()}`, `$${ad.cpl.toFixed(2)}`, ad.status])
    ]
    const adSheet = XLSX.utils.aoa_to_sheet(adSheetData)
    XLSX.utils.book_append_sheet(wb, adSheet, 'Ad Performance')
    
    // Branch Performance Sheet
    const branchSheetData = [
      ['Branch', 'Patients', 'Revenue', 'Leads', 'Revenue per Patient'],
      ...branchData.map(b => [b.branch, b.patients, `$${b.revenue.toLocaleString()}`, b.leads, `$${(b.revenue / b.patients).toFixed(2)}`])
    ]
    const branchSheet = XLSX.utils.aoa_to_sheet(branchSheetData)
    XLSX.utils.book_append_sheet(wb, branchSheet, 'Branch Performance')
    
    // Download
    XLSX.writeFile(wb, `Densyc_Report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`)
    setExportDialogOpen(false)
  }

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    
    // Title
    doc.setFontSize(20)
    doc.setTextColor(40)
    doc.text('Densyc Clinic Report', pageWidth / 2, 20, { align: 'center' })
    
    // Date
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Generated: ${format(new Date(), 'MMMM dd, yyyy')}`, pageWidth / 2, 28, { align: 'center' })
    
    // Key Metrics Section
    doc.setFontSize(14)
    doc.setTextColor(40)
    doc.text('Key Metrics', 14, 42)
    
    autoTable(doc, {
      startY: 48,
      head: [['Metric', 'Value']],
      body: [
        ['Customer Acquisition Cost', `$${cac.toFixed(2)}`],
        ['Total Media Buying Spend', `$${totalAdSpend.toLocaleString()}`],
        ['Total Leads', totalLeads.toLocaleString()],
        ['Total Revenue', `$${totalRevenue.toLocaleString()}`],
        ['Avg. Cost Per Lead', `$${(totalAdSpend / totalLeads).toFixed(2)}`],
        ['Conversion Rate', '24.5%'],
        ['Avg. Patient Value', `$${(totalRevenue / totalPatients).toFixed(2)}`],
        ['ROAS', `${(totalRevenue / totalAdSpend).toFixed(1)}x`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202] },
    })
    
    // Revenue Data Section
    const revenueTableY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15
    doc.setFontSize(14)
    doc.text('Monthly Revenue & Ad Spend', 14, revenueTableY)
    
    autoTable(doc, {
      startY: revenueTableY + 6,
      head: [['Month', 'Revenue', 'Ad Spend', 'Leads']],
      body: revenueData.map(d => [d.month, `$${d.revenue.toLocaleString()}`, `$${d.adSpend.toLocaleString()}`, d.leads.toString()]),
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202] },
    })
    
    // New page for more data
    doc.addPage()
    
    // Leads by Source
    doc.setFontSize(14)
    doc.text('Leads by Source', 14, 20)
    
    autoTable(doc, {
      startY: 26,
      head: [['Source', 'Leads']],
      body: sourceData.map(s => [s.name, s.value.toString()]),
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202] },
    })
    
    // Ad Performance
    const adTableY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15
    doc.setFontSize(14)
    doc.text('Ad Performance by ID', 14, adTableY)
    
    autoTable(doc, {
      startY: adTableY + 6,
      head: [['Ad ID', 'Platform', 'Leads', 'Spend', 'CPL', 'Status']],
      body: adIdLeadsData.map(ad => [ad.adId, ad.platform, ad.leads.toString(), `$${ad.spend.toLocaleString()}`, `$${ad.cpl.toFixed(2)}`, ad.status]),
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202] },
    })
    
    // Branch Performance
    const branchTableY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15
    doc.setFontSize(14)
    doc.text('Branch Performance', 14, branchTableY)
    
    autoTable(doc, {
      startY: branchTableY + 6,
      head: [['Branch', 'Patients', 'Revenue', 'Leads']],
      body: branchData.map(b => [b.branch, b.patients.toString(), `$${b.revenue.toLocaleString()}`, b.leads.toString()]),
      theme: 'striped',
      headStyles: { fillColor: [66, 139, 202] },
    })
    
    // Save
    doc.save(`Densyc_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`)
    setExportDialogOpen(false)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground mt-1">Analytics, metrics, and business insights. Hover over any metric to see its definition and calculation.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Export Report</DialogTitle>
                  <DialogDescription>
                    Choose the format you want to export the clinic data in.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2"
                    onClick={exportToExcel}
                  >
                    <FileSpreadsheet className="w-8 h-8 text-green-600" />
                    <span>Excel (.xlsx)</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex-col gap-2"
                    onClick={exportToPDF}
                  >
                    <FileText className="w-8 h-8 text-red-600" />
                    <span>PDF (.pdf)</span>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
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

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Customer Acquisition Cost"
            value={`$${cac.toFixed(2)}`}
            subtitle="Cost to acquire a patient"
            icon={<Target className="w-4 h-4 text-primary" />}
            metricKey="cac"
          />
          <MetricCard
            title="Total Media Buying Spend"
            value={`$${totalAdSpend.toLocaleString()}`}
            subtitle="Year to date"
            icon={<DollarSign className="w-4 h-4 text-primary" />}
            metricKey="totalSpend"
          />
          <MetricCard
            title="Total Leads"
            value={totalLeads.toLocaleString()}
            subtitle="From all ad campaigns"
            icon={<Users className="w-4 h-4 text-primary" />}
            metricKey="totalLeads"
          />
          <MetricCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            subtitle="+18% from last year"
            icon={<TrendingUp className="w-4 h-4 text-primary" />}
            metricKey="totalRevenue"
          />
        </div>

        {/* Additional Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Avg. Cost Per Lead"
            value={`$${(totalAdSpend / totalLeads).toFixed(2)}`}
            subtitle="Across all platforms"
            icon={<DollarSign className="w-4 h-4 text-muted-foreground" />}
            metricKey="cpl"
          />
          <MetricCard
            title="Conversion Rate"
            value="24.5%"
            subtitle="Lead to patient"
            icon={<TrendingUp className="w-4 h-4 text-muted-foreground" />}
            metricKey="conversionRate"
          />
          <MetricCard
            title="Avg. Patient Value"
            value={`$${(totalRevenue / totalPatients).toFixed(2)}`}
            subtitle="Revenue per patient"
            icon={<Users className="w-4 h-4 text-muted-foreground" />}
            metricKey="avgPatientValue"
          />
          <MetricCard
            title="ROAS"
            value={`${(totalRevenue / totalAdSpend).toFixed(1)}x`}
            subtitle="Return on ad spend"
            icon={<Target className="w-4 h-4 text-muted-foreground" />}
            metricKey="roas"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Revenue vs Ad Spend Chart */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Revenue vs Ad Spend</CardTitle>
              <CardDescription>Monthly comparison of revenue and advertising costs</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                  <Tooltip
                    cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--foreground)',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    itemStyle={{ color: 'var(--foreground)' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} name="Revenue" activeBar={{ opacity: 0.8 }} />
                  <Bar dataKey="adSpend" fill="var(--chart-2)" radius={[4, 4, 0, 0]} name="Ad Spend" activeBar={{ opacity: 0.8 }} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Leads by Source */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Leads by Source</CardTitle>
              <CardDescription>Distribution of leads across advertising platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      color: 'var(--foreground)',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    itemStyle={{ color: 'var(--foreground)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Leads Trend Chart */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Leads Trend</CardTitle>
            <CardDescription>Monthly lead generation performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" style={{ fontSize: '12px' }} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ stroke: 'var(--muted)', strokeWidth: 2 }}
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    color: 'var(--foreground)',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  itemStyle={{ color: 'var(--foreground)' }}
                />
                <Line type="monotone" dataKey="leads" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--card)', stroke: 'var(--primary)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, fill: 'var(--primary)', stroke: 'var(--card)', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Leads per Ad ID Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Leads by Ad ID</CardTitle>
            <CardDescription>Performance breakdown for each advertising campaign ID</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-foreground font-semibold">Ad ID</TableHead>
                    <TableHead className="text-foreground font-semibold">Platform</TableHead>
                    <TableHead className="text-foreground font-semibold text-right">Leads</TableHead>
                    <TableHead className="text-foreground font-semibold text-right">Spend</TableHead>
                    <TableHead className="text-foreground font-semibold text-right">
                      <TooltipProvider>
                        <UITooltip delayDuration={0}>
                          <TooltipTrigger className="flex items-center gap-1 ml-auto">
                            CPL
                            <Info className="w-3 h-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <p className="font-semibold">Cost Per Lead</p>
                            <p className="text-xs text-muted-foreground">Spend / Number of Leads</p>
                          </TooltipContent>
                        </UITooltip>
                      </TooltipProvider>
                    </TableHead>
                    <TableHead className="text-foreground font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adIdLeadsData.map((ad) => (
                    <TableRow key={ad.adId} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-mono font-medium">{ad.adId}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{ad.platform}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{ad.leads}</TableCell>
                      <TableCell className="text-right">${ad.spend.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">${ad.cpl.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={ad.status === 'active' ? 'default' : 'secondary'}>
                          {ad.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Branch Performance Table */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Branch Performance</CardTitle>
            <CardDescription>Revenue and patient metrics by branch location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {branchData.map((branch, index) => (
                <div key={index} className="space-y-2 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{branch.branch}</h3>
                    <span className="text-sm font-bold text-primary">${branch.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{branch.patients.toLocaleString()} patients | {branch.leads} leads</span>
                    <TooltipProvider>
                      <UITooltip delayDuration={0}>
                        <TooltipTrigger className="flex items-center gap-1">
                          ${(branch.revenue / branch.patients).toFixed(2)} per patient
                          <Info className="w-3 h-3" />
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <p>Revenue / Number of Patients</p>
                        </TooltipContent>
                      </UITooltip>
                    </TooltipProvider>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(branch.revenue / 42400) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
