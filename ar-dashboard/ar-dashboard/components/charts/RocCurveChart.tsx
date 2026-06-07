'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

interface RocData {
  fpr: number[]
  tpr: number[]
}

interface Props {
  lr: RocData & { auc: number }
  rf: RocData & { auc: number }
}

export default function RocCurveChart({ lr, rf }: Props) {
  // Merge all FPR points and interpolate TPR for both models
  const allFpr = Array.from(new Set([...lr.fpr, ...rf.fpr])).sort((a, b) => a - b)

  function interpolate(fprArr: number[], tprArr: number[], x: number): number {
    const idx = fprArr.findIndex(v => v >= x)
    if (idx === -1) return tprArr[tprArr.length - 1]
    if (idx === 0)  return tprArr[0]
    const t = (x - fprArr[idx - 1]) / (fprArr[idx] - fprArr[idx - 1])
    return tprArr[idx - 1] + t * (tprArr[idx] - tprArr[idx - 1])
  }

  const chartData = allFpr.map(fpr => ({
    fpr: Math.round(fpr * 100) / 100,
    lr:  Math.round(interpolate(lr.fpr, lr.tpr, fpr) * 1000) / 1000,
    rf:  Math.round(interpolate(rf.fpr, rf.tpr, fpr) * 1000) / 1000,
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <p style={{ color: '#888888', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif' }}>
          ROC Curve
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span style={{ color: '#666666', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '10px' }}>
            LR AUC: <span style={{ color: '#6888aa' }}>{lr.auc.toFixed(3)}</span>
          </span>
          <span style={{ color: '#666666', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '10px' }}>
            RF AUC: <span style={{ color: '#c9a84c' }}>{rf.auc.toFixed(3)}</span>
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="#1a1a1a" />
          <XAxis
            dataKey="fpr"
            domain={[0, 1]}
            tickCount={6}
            tick={{ fill: '#666666', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            label={{ value: 'False Positive Rate', position: 'insideBottom', offset: -2, fill: '#555555', fontSize: 10, fontFamily: 'Inter, system-ui, sans-serif' }}
          />
          <YAxis
            domain={[0, 1]}
            tickCount={6}
            tick={{ fill: '#666666', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            label={{ value: 'True Positive Rate', angle: -90, position: 'insideLeft', fill: '#555555', fontSize: 10, fontFamily: 'Inter, system-ui, sans-serif' }}
          />
          <Tooltip
            contentStyle={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '8px', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', color: '#ffffff' }}
            labelStyle={{ color: '#888888', fontSize: '10px' }}
            formatter={(value, name) => [Number(value).toFixed(3), name === 'lr' ? 'Logistic Regression' : 'Random Forest']}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: '#666666', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '10px' }}>
                {value === 'lr' ? 'Logistic Regression' : 'Random Forest'}
              </span>
            )}
          />
          {/* Diagonal baseline */}
          <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]} stroke="#2a2a2a" strokeDasharray="4 4" />
          <Line type="monotone" dataKey="lr" stroke="#6888aa" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="rf" stroke="#c9a84c" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
