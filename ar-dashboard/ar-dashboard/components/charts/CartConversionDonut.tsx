'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  cart: number
  noCart: number
}

const COLORS = ['#c9a84c', '#2a2a2a']

export default function CartConversionDonut({ cart, noCart }: Props) {
  const total = cart + noCart
  const rate = total > 0 ? ((cart / total) * 100).toFixed(1) : '0.0'

  const data = [
    { name: 'Added to Cart', value: cart },
    { name: 'No Cart Action', value: noCart },
  ]

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
        Cart Conversion
      </p>

      {/* Chart + centre label */}
      <div style={{ position: 'relative', height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#111111',
                border: '1px solid #2a2a2a',
                borderRadius: '8px',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '12px',
                color: '#ffffff',
              }}
              itemStyle={{ color: '#888888' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Centre label */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none',
          }}
        >
          <p
            style={{
              color: '#c9a84c',
              fontFamily: 'Georgia, Cambria, serif',
              fontSize: '30px',
              fontWeight: 400,
              lineHeight: 1,
              marginBottom: '4px',
            }}
          >
            {rate}%
          </p>
          <p
            style={{
              color: '#666666',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '8px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
            }}
          >
            Conversion
          </p>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: COLORS[i],
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: '#888888',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '11px',
              }}
            >
              {d.value} {d.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
