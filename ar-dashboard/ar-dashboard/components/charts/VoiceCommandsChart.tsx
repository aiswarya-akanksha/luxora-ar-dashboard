'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts'
import type { CountItem } from '@/lib/types'

interface Props {
  data: CountItem[]
}

function formatAction(action: string) {
  if (!action || action.trim() === '') return 'General'
  return action
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase())
}

export default function VoiceCommandsChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div
        style={{
          background: '#111111',
          border: '1px solid #2a2a2a',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
        }}
      >
        <p style={{ color: '#555555', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}>
          No voice command data
        </p>
      </div>
    )
  }

  const formatted = data.map(d => ({
    ...d,
    label: formatAction(d.name),
  }))

  return (
    <div
      style={{
        background: '#111111',
        border: '1px solid #2a2a2a',
        borderRadius: '12px',
        padding: '24px',
      }}
    >
      <p
        style={{
          color: '#888888',
          fontSize: '9px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          fontFamily: 'Inter, system-ui, sans-serif',
          marginBottom: '4px',
        }}
      >
        Voice Commands
      </p>
      <p style={{ color: '#555555', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', marginBottom: '24px' }}>
        Actions triggered by voice during AR sessions
      </p>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          layout="vertical"
          data={formatted}
          margin={{ top: 0, right: 32, left: 0, bottom: 0 }}
        >
          <CartesianGrid horizontal={false} stroke="#1a1a1a" />
          <XAxis
            type="number"
            tick={{ fill: '#666666', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={110}
            tick={{ fill: '#888888', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: '#1a1a1a' }}
            contentStyle={{
              background: '#111111',
              border: '1px solid #2a2a2a',
              borderRadius: '8px',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '12px',
              color: '#ffffff',
            }}
            labelStyle={{ color: '#888888', fontSize: '10px' }}
            formatter={(value) => [Number(value), 'Times used']}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
            {formatted.map((_, i) => (
              <Cell
                key={i}
                fill={i === 0 ? '#c9a84c' : '#2a2a2a'}
                stroke={i === 0 ? '#c9a84c' : '#3a3a3a'}
                strokeWidth={1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
