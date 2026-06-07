'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MousePointerClick,
  BrainCircuit,
  MessageSquare,
} from 'lucide-react'

const NAV = [
  { href: '/',             label: 'Overview',     icon: LayoutDashboard  },
  { href: '/interactions', label: 'Interactions', icon: MousePointerClick },
  { href: '/models',       label: 'Models',       icon: BrainCircuit     },
  { href: '/sentiment',    label: 'Sentiment',    icon: MessageSquare    },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col"
      style={{ background: '#111111', borderRight: '1px solid #2a2a2a' }}
    >
      {/* ── Brand ─────────────────────────────── */}
      <div style={{ borderBottom: '1px solid #2a2a2a', padding: '28px 24px' }}>
        <p
          style={{
            color: '#888888',
            fontSize: '9px',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            marginBottom: '6px',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          AR Analytics
        </p>
        <h1
          style={{
            color: '#ffffff',
            fontFamily: 'Georgia, Cambria, serif',
            fontSize: '20px',
            fontWeight: 300,
            lineHeight: 1.2,
            letterSpacing: '0.02em',
          }}
        >
          Dashboard
        </h1>
      </div>

      {/* ── Navigation ──────────────────────────── */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href

          return (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'Inter, system-ui, sans-serif',
                letterSpacing: '0.08em',
                textDecoration: 'none',
                transition: 'all 0.15s',
                border: active ? '1px solid #c9a84c44' : '1px solid transparent',
                background: active ? 'var(--gold-glow)' : 'transparent',
                color: active ? '#c9a84c' : '#888888',
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = '#1a1a1a'
                  ;(e.currentTarget as HTMLElement).style.color = '#ffffff'
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent'
                  ;(e.currentTarget as HTMLElement).style.color = '#888888'
                }
              }}
            >
              <Icon
                size={14}
                strokeWidth={active ? 2 : 1.5}
                style={{ color: 'currentColor', flexShrink: 0 }}
              />
              <span style={{ textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                {label}
              </span>
              {active && (
                <span
                  style={{
                    marginLeft: 'auto',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#c9a84c',
                  }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── Footer ──────────────────────────────── */}
      <div style={{ borderTop: '1px solid #2a2a2a', padding: '16px 24px' }}>
        <p
          style={{
            color: '#555555',
            fontSize: '9px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          ML-Powered Insights
        </p>
      </div>
    </aside>
  )
}
