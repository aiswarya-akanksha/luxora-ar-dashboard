interface MetricCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: boolean
  className?: string
}

export default function MetricCard({
  label,
  value,
  sub,
  accent = false,
  className = '',
}: MetricCardProps) {
  return (
    <div
      className={className}
      style={{
        background: '#111111',
        border: accent ? '1px solid #c9a84c44' : '1px solid #2a2a2a',
        borderRadius: '12px',
        padding: '24px',
      }}
    >
      {/* Label */}
      <p
        style={{
          color: '#888888',
          fontSize: '9px',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          fontFamily: 'Inter, system-ui, sans-serif',
          marginBottom: '12px',
        }}
      >
        {label}
      </p>

      {/* Value */}
      <p
        style={{
          color: accent ? '#c9a84c' : '#ffffff',
          fontFamily: 'Georgia, Cambria, serif',
          fontSize: '32px',
          fontWeight: 400,
          lineHeight: 1,
          letterSpacing: '-0.01em',
        }}
      >
        {value}
      </p>

      {/* Sub-label */}
      {sub && (
        <p
          style={{
            color: '#666666',
            fontSize: '11px',
            fontFamily: 'Inter, system-ui, sans-serif',
            marginTop: '8px',
          }}
        >
          {sub}
        </p>
      )}
    </div>
  )
}
