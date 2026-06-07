'use client'

interface Props {
  matrix: [[number, number], [number, number]]
  title: string
  accent?: boolean
}

export default function ConfusionMatrix({ matrix, title, accent = false }: Props) {
  const [[tn, fp], [fn, tp]] = matrix
  const total = tn + fp + fn + tp

  const cells = [
    { label: 'True Negative',  value: tn, row: 'Actual No',  col: 'Predicted No',  positive: true  },
    { label: 'False Positive', value: fp, row: 'Actual No',  col: 'Predicted Yes', positive: false },
    { label: 'False Negative', value: fn, row: 'Actual Yes', col: 'Predicted No',  positive: false },
    { label: 'True Positive',  value: tp, row: 'Actual Yes', col: 'Predicted Yes', positive: true  },
  ]

  return (
    <div
      style={{
        background: '#111111',
        border: accent ? '1px solid #c9a84c44' : '1px solid #2a2a2a',
        borderRadius: '12px',
        padding: '24px',
      }}
    >
      <p style={{ color: '#888888', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: '20px' }}>
        {title}
      </p>

      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '6px', marginBottom: '6px' }}>
        <div />
        {['Predicted No', 'Predicted Yes'].map(h => (
          <div key={h} style={{ textAlign: 'center', color: '#555555', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif' }}>
            {h}
          </div>
        ))}
      </div>

      {/* Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '6px', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', color: '#555555', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif' }}>
          Actual No
        </div>
        {/* TN */}
        <div style={{ background: '#1a2a1a', border: '1px solid #2a4a2a', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
          <p style={{ color: '#4a9a4a', fontFamily: 'Georgia, Cambria, serif', fontSize: '28px', fontWeight: 400, lineHeight: 1 }}>{tn}</p>
          <p style={{ color: '#555555', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginTop: '4px' }}>True Neg</p>
        </div>
        {/* FP */}
        <div style={{ background: '#2a1a1a', border: '1px solid #4a2a2a', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
          <p style={{ color: '#cc4444', fontFamily: 'Georgia, Cambria, serif', fontSize: '28px', fontWeight: 400, lineHeight: 1 }}>{fp}</p>
          <p style={{ color: '#555555', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginTop: '4px' }}>False Pos</p>
        </div>
      </div>

      {/* Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', color: '#555555', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif' }}>
          Actual Yes
        </div>
        {/* FN */}
        <div style={{ background: '#2a1a1a', border: '1px solid #4a2a2a', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
          <p style={{ color: '#cc4444', fontFamily: 'Georgia, Cambria, serif', fontSize: '28px', fontWeight: 400, lineHeight: 1 }}>{fn}</p>
          <p style={{ color: '#555555', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginTop: '4px' }}>False Neg</p>
        </div>
        {/* TP */}
        <div style={{ background: accent ? '#1a150a' : '#1a1a0a', border: accent ? '1px solid #c9a84c44' : '1px solid #3a3a1a', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
          <p style={{ color: accent ? '#c9a84c' : '#9a8a2a', fontFamily: 'Georgia, Cambria, serif', fontSize: '28px', fontWeight: 400, lineHeight: 1 }}>{tp}</p>
          <p style={{ color: '#555555', fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginTop: '4px' }}>True Pos</p>
        </div>
      </div>

      <p style={{ color: '#444444', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '10px', marginTop: '12px', textAlign: 'right' }}>
        {total} test sessions total
      </p>
    </div>
  )
}
