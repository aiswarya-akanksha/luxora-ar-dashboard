'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Props {
  data: { star: number; count: number }[]
}

export default function RatingDistribution({ data }: Props) {
  const max = Math.max(...data.map(d => d.count), 1)

  return (
    <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px' }}>
      <p style={{ color: '#888888', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: '24px' }}>
        Rating Distribution
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="star"
            tick={{ fill: '#888888', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => `${'★'.repeat(v)}`}
          />
          <YAxis tick={{ fill: '#666666', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: '#1a1a1a' }}
            contentStyle={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '8px', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px', color: '#ffffff' }}
            formatter={(value) => [Number(value), 'Responses']}
            labelFormatter={v => `${v} Star${v !== 1 ? 's' : ''}`}
            labelStyle={{ color: '#888888', fontSize: '10px' }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.count === max ? '#c9a84c' : '#2a2a2a'}
                stroke={entry.count === max ? '#c9a84c' : '#3a3a3a'}
                strokeWidth={1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p style={{ color: '#555555', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '10px', marginTop: '8px', textAlign: 'right' }}>
        Gold = most common rating
      </p>
    </div>
  )
}
