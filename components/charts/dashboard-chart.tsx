'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getSupabaseBrowser } from '@/lib/supabase/client'
import { format, parseISO } from 'date-fns'

export function DashboardChart() {
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const supabase = getSupabaseBrowser()
      try {
        const { data: patients } = await supabase.from('patients').select('created_at, date')
        const { data: reservations } = await supabase.from('reservations').select('created_at, date')

        const monthMap: Record<string, any> = {}
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        monthNames.forEach(m => monthMap[m] = { month: m, patients: 0, reservations: 0 })

        ;(patients || []).forEach((p: any) => {
          const d = p.date || p.created_at
          if (d) {
            const m = format(parseISO(d), 'MMM')
            if (monthMap[m]) monthMap[m].patients += 1
          }
        })

        ;(reservations || []).forEach((r: any) => {
          const d = r.date || r.created_at
          if (d) {
            const m = format(parseISO(d), 'MMM')
            if (monthMap[m]) monthMap[m].reservations += 1
          }
        })

        // Find the first month with data or just show all if empty
        let startIdx = 0
        const activeMonths = monthNames.filter(m => monthMap[m].patients > 0 || monthMap[m].reservations > 0)
        if (activeMonths.length > 0) {
          const firstMonth = activeMonths[0]
          startIdx = monthNames.indexOf(firstMonth)
        }
        // Always show from startIdx to current month
        const currentMonthIdx = new Date().getMonth()
        const displayData = monthNames.slice(Math.min(startIdx, currentMonthIdx), Math.max(startIdx, currentMonthIdx) + 1).map(m => monthMap[m])
        // If displayData is empty (no data at all), just show last 6 months
        if (displayData.every(d => d.patients === 0 && d.reservations === 0)) {
          setData(monthNames.slice(Math.max(0, currentMonthIdx - 5), currentMonthIdx + 1).map(m => monthMap[m]))
        } else {
          setData(displayData)
        }

      } catch (error) {
        console.error('Error fetching dashboard chart data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  if (isLoading) {
    return <div className="w-full h-[300px] flex items-center justify-center border rounded-lg bg-muted/20">Loading chart...</div>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis 
          dataKey="month" 
          stroke="var(--muted-foreground)"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="var(--muted-foreground)"
          style={{ fontSize: '12px' }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: 'var(--card-foreground)',
          }}
        />
        <Line
          type="monotone"
          dataKey="patients"
          stroke="var(--primary)"
          strokeWidth={2}
          dot={{ fill: 'var(--primary)', r: 4 }}
          activeDot={{ r: 6 }}
          name="Patients"
        />
        <Line
          type="monotone"
          dataKey="reservations"
          stroke="var(--chart-2)"
          strokeWidth={2}
          dot={{ fill: 'var(--chart-2)', r: 4 }}
          activeDot={{ r: 6 }}
          name="Reservations"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
