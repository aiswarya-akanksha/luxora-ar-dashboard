'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { CountItem } from '@/lib/types'

interface Props {
  data: CountItem[]
}

function formatLabel(type: string) {
  return type
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default function InteractionTypeBar({ data }: Props) {
  const formatted = data.map(d => ({ ...d, label: formatLabel(d.name) }))

  return (
    <div
      style={{
        background: '#111111',
        border: '1px solid #2a2a2a',
        borderRadius: '12px',
        padding: '24px',
      }}
    >
      {/* Header */}
      <p
        style={{
          color: '#888888',
          fontSize: '9px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          fontFamily: 'Inter, system-ui, sans-serif',
          marginBottom: '24px',
        }}
      >
        Interaction Types
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={formatted}
          margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="#1a1a1a"
            strokeDasharray="0"
          />
          <XAxis
            dataKey="label"
            tick={{
              fill: '#666666',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 10,
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{
              fill: '#666666',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 10,
            }}
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
            itemStyle={{ color: '#c9a84c' }}
            labelStyle={{ color: '#888888', fontSize: '10px', letterSpacing: '0.1em' }}
            formatter={(value: number) => [value.toLocaleString(), 'Events']}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {formatted.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.name === 'add_to_cart' ? '#c9a84c' : '#2a2a2a'}
                stroke={entry.name === 'add_to_cart' ? '#c9a84c' : '#3a3a3a'}
                strokeWidth={1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p
        style={{
          color: '#555555',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: '10px',
          marginTop: '12px',
          textAlign: 'right',
        }}
      >
        Gold bar = add to cart events
      </p>
    </div>
  )
}
