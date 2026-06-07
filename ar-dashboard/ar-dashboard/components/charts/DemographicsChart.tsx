'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { DemographicItem } from '@/lib/types'

interface Props {
  device:   DemographicItem[]
  age:      DemographicItem[]
  gender:   DemographicItem[]
  heardFrom: DemographicItem[]
}

function DemoBar({ data, title }: { data: DemographicItem[]; title: string }) {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '10px', padding: '20px' }}>
      <p style={{ color: '#888888', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: '16px' }}>
        {title}
      </p>
      {data.length === 0 ? (
        <p style={{ color: '#444444', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px' }}>No data</p>
      ) : (
        <ResponsiveContainer width="100%" height={120}>
          <BarChart layout="vertical" data={data} margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="label" width={70} tick={{ fill: '#888888', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: '#1a1a1a' }}
              contentStyle={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '8px', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', color: '#ffffff' }}
              formatter={(value: number) => [value, 'Responses']}
            />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={16}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.value === max ? '#c9a84c' : '#2a2a2a'}
                  stroke={entry.value === max ? '#c9a84c' : '#3a3a3a'}
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default function DemographicsChart({ device, age, gender, heardFrom }: Props) {
  return (
    <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px' }}>
      <p style={{ color: '#888888', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: '20px' }}>
        User Demographics
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <DemoBar data={device}    title="Device" />
        <DemoBar data={age}       title="Age Group" />
        <DemoBar data={gender}    title="Gender" />
        <DemoBar data={heardFrom} title="Heard From" />
      </div>
    </div>
  )
}
