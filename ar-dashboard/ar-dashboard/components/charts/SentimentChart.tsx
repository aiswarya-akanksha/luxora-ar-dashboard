'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Props {
  data: { label: string; count: number; pct: string }[]
}

const COLORS: Record<string, string> = {
  Positive: '#4a9a4a',
  Neutral:  '#2a2a2a',
  Negative: '#cc4444',
}

export default function SentimentChart({ data }: Props) {
  return (
    <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px' }}>
      <p style={{ color: '#888888', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: '24px' }}>
        Sentiment Distribution
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <XAxis dataKey="label" tick={{ fill: '#888888', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#666666', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: '#1a1a1a' }}
            contentStyle={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '8px', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px', color: '#ffffff' }}
            formatter={(value, _, props: any) => [`${Number(value)} responses (${props.payload.pct}%)`, '']}
            labelStyle={{ color: '#888888', fontSize: '10px' }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={64}>
            {data.map((entry, i) => (
              <Cell key={i} fill={COLORS[entry.label] ?? '#2a2a2a'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
