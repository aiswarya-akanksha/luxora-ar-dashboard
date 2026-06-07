'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Props {
  positive: Record<string, number>
  negative: Record<string, number>
}

function toChartData(obj: Record<string, number>) {
  return Object.entries(obj)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
}

function MiniBar({ data, color, label }: { data: { word: string; count: number }[]; color: string; label: string }) {
  if (data.length === 0) {
    return (
      <div style={{ flex: 1 }}>
        <p style={{ color: '#555555', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: '12px' }}>{label}</p>
        <p style={{ color: '#444444', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px' }}>No data</p>
      </div>
    )
  }

  return (
    <div style={{ flex: 1 }}>
      <p style={{ color: '#555555', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: '12px' }}>{label}</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart layout="vertical" data={data} margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
          <XAxis type="number" tick={{ fill: '#666666', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 9 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="word" width={80} tick={{ fill: '#888888', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip
            cursor={{ fill: '#1a1a1a' }}
            contentStyle={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '8px', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', color: '#ffffff' }}
            formatter={(value: number) => [value, 'Mentions']}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={20}>
            {data.map((_, i) => (
              <Cell key={i} fill={i === 0 ? color : '#2a2a2a'} stroke={i === 0 ? color : '#3a3a3a'} strokeWidth={1} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function KeywordsChart({ positive, negative }: Props) {
  const posData = toChartData(positive)
  const negData = toChartData(negative)

  return (
    <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px' }}>
      <p style={{ color: '#888888', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: '24px' }}>
        Top Keywords
      </p>
      <div style={{ display: 'flex', gap: '32px' }}>
        <MiniBar data={posData} color="#4a9a4a" label="Positive Comments" />
        <div style={{ width: '1px', background: '#1a1a1a', flexShrink: 0 }} />
        <MiniBar data={negData} color="#cc4444" label="Negative Comments" />
      </div>
    </div>
  )
}
