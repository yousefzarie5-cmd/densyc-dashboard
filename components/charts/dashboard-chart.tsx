'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', patients: 245, reservations: 89 },
  { month: 'Feb', patients: 312, reservations: 105 },
  { month: 'Mar', patients: 289, reservations: 98 },
  { month: 'Apr', patients: 401, reservations: 142 },
  { month: 'May', patients: 478, reservations: 168 },
  { month: 'Jun', patients: 512, reservations: 185 },
  { month: 'Jul', patients: 589, reservations: 210 },
  { month: 'Aug', patients: 645, reservations: 235 },
  { month: 'Sep', patients: 702, reservations: 258 },
  { month: 'Oct', patients: 758, reservations: 280 },
  { month: 'Nov', patients: 812, reservations: 305 },
  { month: 'Dec', patients: 894, reservations: 342 },
]

export function DashboardChart() {
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
