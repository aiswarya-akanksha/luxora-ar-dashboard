'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts'

interface Props {
  importances: Record<string, number>
}

function formatFeature(key: string) {
  return key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export default function FeatureImportanceChart({ importances }: Props) {
  const data = Object.entries(importances)
    .map(([key, value]) => ({ feature: formatFeature(key), raw: key, value }))
    .sort((a, b) => b.value - a.value)

  const max = data[0]?.value ?? 1

  return (
    <div
      style={{
        background: '#111111',
        border: '1px solid #c9a84c44',
        borderRadius: '12px',
        padding: '24px',
      }}
    >
      <p style={{ color: '#888888', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: '4px' }}>
        Feature Importance
      </p>
      <p style={{ color: '#555555', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', marginBottom: '24px' }}>
        Which AR behaviours most predict cart conversion — Random Forest
      </p>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 48, left: 0, bottom: 0 }}
        >
          <CartesianGrid horizontal={false} stroke="#1a1a1a" />
          <XAxis
            type="number"
            domain={[0, max * 1.1]}
            tick={{ fill: '#666666', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => v.toFixed(2)}
          />
          <YAxis
            type="category"
            dataKey="feature"
            width={110}
            tick={{ fill: '#888888', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: '#1a1a1a' }}
            contentStyle={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '8px', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px', color: '#ffffff' }}
            labelStyle={{ color: '#888888', fontSize: '10px' }}
            formatter={(value: number) => [value.toFixed(4), 'Importance']}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={28}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={i === 0 ? '#c9a84c' : i === 1 ? '#a07830' : '#2a2a2a'}
                stroke={i === 0 ? '#c9a84c' : i === 1 ? '#a07830' : '#3a3a3a'}
                strokeWidth={1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p style={{ color: '#555555', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '10px', marginTop: '12px', textAlign: 'right' }}>
        Gold = highest impact feature
      </p>
    </div>
  )
}
