'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import type { ProductInteractionItem } from '@/lib/types'

interface Props {
  data: ProductInteractionItem[]
}

const TYPE_COLORS: Record<string, string> = {
  zoom:            '#3a3a5a',
  rotate:          '#3a5a4a',
  category_filter: '#5a4a3a',
  voice_command:   '#4a4a6a',
  view_journey:    '#5a3a4a',
  product_switch:  '#3a4a5a',
  rate:            '#4a5a3a',
  add_to_cart:     '#c9a84c',
}

const TYPE_LABELS: Record<string, string> = {
  zoom:            'Zoom',
  rotate:          'Rotate',
  category_filter: 'Category Filter',
  voice_command:   'Voice Command',
  view_journey:    'View Journey',
  product_switch:  'Product Switch',
  rate:            'Rate',
  add_to_cart:     'Add to Cart',
}

const TYPES = Object.keys(TYPE_COLORS)

export default function ProductInteractionBar({ data }: Props) {
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
          marginBottom: '24px',
        }}
      >
        Interactions by Product
      </p>

      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
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
            dataKey="product"
            width={90}
            tick={{ fill: '#888888', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11 }}
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
            labelStyle={{ color: '#888888', fontSize: '10px', letterSpacing: '0.1em', marginBottom: '4px' }}
            formatter={(value, name) => [Number(value), TYPE_LABELS[String(name)] ?? String(name)]}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: '#666666', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '10px' }}>
                {TYPE_LABELS[value] ?? value}
              </span>
            )}
            iconSize={8}
            iconType="circle"
          />
          {TYPES.map(type => (
            <Bar
              key={type}
              dataKey={type}
              stackId="a"
              fill={TYPE_COLORS[type]}
              radius={type === 'add_to_cart' ? [0, 4, 4, 0] : [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      <p style={{ color: '#555555', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '10px', marginTop: '12px', textAlign: 'right' }}>
        Gold = add to cart · Showing top 8 products by volume
      </p>
    </div>
  )
}
