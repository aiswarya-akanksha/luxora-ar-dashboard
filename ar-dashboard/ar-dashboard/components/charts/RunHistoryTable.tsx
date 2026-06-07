'use client'

import type { RunHistoryItem } from '@/lib/types'

interface Props {
  runs: RunHistoryItem[]
}

export default function RunHistoryTable({ runs }: Props) {
  if (runs.length === 0) {
    return (
      <div style={{ padding: '24px', background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', color: '#555555', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}>
        No training history yet.
      </div>
    )
  }

  return (
    <div
      style={{
        background: '#111111',
        border: '1px solid #2a2a2a',
        borderRadius: '12px',
        padding: '24px',
        overflowX: 'auto',
      }}
    >
      <p style={{ color: '#888888', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: '20px' }}>
        Training History
      </p>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Run', 'Date', 'Sessions', 'Cart Events', 'LR Accuracy', 'RF Accuracy'].map(h => (
              <th
                key={h}
                style={{
                  color: '#555555',
                  fontSize: '9px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontWeight: 400,
                  textAlign: 'left',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #1a1a1a',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {runs.map((run, i) => {
            const isLatest = i === 0
            return (
              <tr
                key={run.id}
                style={{ borderBottom: '1px solid #1a1a1a' }}
              >
                <td style={{ padding: '12px 0', color: isLatest ? '#c9a84c' : '#555555', fontFamily: 'Georgia, Cambria, serif', fontSize: '14px' }}>
                  #{run.id}
                  {isLatest && (
                    <span style={{ marginLeft: '6px', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', color: '#c9a84c' }}>
                      Latest
                    </span>
                  )}
                </td>
                <td style={{ padding: '12px 12px 12px 0', color: '#888888', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}>
                  {new Date(run.run_at).toLocaleString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </td>
                <td style={{ padding: '12px 12px 12px 0', color: '#ffffff', fontFamily: 'Georgia, Cambria, serif', fontSize: '15px' }}>
                  {run.total_sessions}
                </td>
                <td style={{ padding: '12px 12px 12px 0', color: '#ffffff', fontFamily: 'Georgia, Cambria, serif', fontSize: '15px' }}>
                  {run.cart_sessions}
                </td>
                <td style={{ padding: '12px 12px 12px 0', color: '#888888', fontFamily: 'Georgia, Cambria, serif', fontSize: '15px' }}>
                  {(run.lr_accuracy * 100).toFixed(1)}%
                </td>
                <td style={{ padding: '12px 0', color: isLatest ? '#c9a84c' : '#888888', fontFamily: 'Georgia, Cambria, serif', fontSize: '15px' }}>
                  {(run.rf_accuracy * 100).toFixed(1)}%
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
