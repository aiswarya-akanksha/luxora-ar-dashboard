'use client'

import { useState } from 'react'

interface Props {
  coefficients: Record<string, number>
  intercept: number
  features: string[]
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x))
}

function formatFeature(key: string) {
  return key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const FEATURE_MAX: Record<string, number> = {
  zoom:            30,
  rotate:          20,
  category_filter: 10,
  voice_command:   10,
  view_journey:    5,
  product_switch:  5,
}

export default function PredictorWidget({ coefficients, intercept, features }: Props) {
  const [inputs, setInputs] = useState<Record<string, number>>(
    Object.fromEntries(features.map(f => [f, 0]))
  )

  const logit       = intercept + features.reduce((sum, f) => sum + (coefficients[f] ?? 0) * (inputs[f] ?? 0), 0)
  const probability = sigmoid(logit)
  const pct         = (probability * 100).toFixed(1)
  const isHigh      = probability >= 0.5

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
        Live Predictor
      </p>
      <p style={{ color: '#555555', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', marginBottom: '24px' }}>
        Adjust session behaviour to predict cart conversion likelihood
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
        {features.map(feature => (
          <div key={feature}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label
                style={{
                  color: '#888888',
                  fontSize: '9px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              >
                {formatFeature(feature)}
              </label>
              <span
                style={{
                  color: '#c9a84c',
                  fontFamily: 'Georgia, Cambria, serif',
                  fontSize: '14px',
                }}
              >
                {inputs[feature] ?? 0}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={FEATURE_MAX[feature] ?? 20}
              step={1}
              value={inputs[feature] ?? 0}
              onChange={e => setInputs(prev => ({ ...prev, [feature]: Number(e.target.value) }))}
              style={{
                width: '100%',
                accentColor: '#c9a84c',
                cursor: 'pointer',
              }}
            />
          </div>
        ))}
      </div>

      {/* Result */}
      <div
        style={{
          background: '#0a0a0a',
          border: isHigh ? '1px solid #c9a84c44' : '1px solid #2a2a2a',
          borderRadius: '10px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p style={{ color: '#555555', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: '4px' }}>
            Conversion Probability
          </p>
          <p style={{ color: isHigh ? '#c9a84c' : '#888888', fontFamily: 'Georgia, Cambria, serif', fontSize: '36px', fontWeight: 400, lineHeight: 1 }}>
            {pct}%
          </p>
        </div>
        <div
          style={{
            background: isHigh ? '#c9a84c15' : '#1a1a1a',
            border: isHigh ? '1px solid #c9a84c44' : '1px solid #2a2a2a',
            borderRadius: '8px',
            padding: '8px 16px',
          }}
        >
          <p style={{ color: isHigh ? '#c9a84c' : '#555555', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {isHigh ? 'Likely to convert' : 'Unlikely to convert'}
          </p>
        </div>
      </div>

      <p style={{ color: '#444444', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '10px', marginTop: '12px' }}>
        Computed from Logistic Regression coefficients stored at last training run.
      </p>
    </div>
  )
}
