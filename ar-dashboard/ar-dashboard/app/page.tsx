import { createServerClient } from '@/lib/supabase/server'
import MetricCard from '@/components/ui/MetricCard'
import CartConversionDonut from '@/components/charts/CartConversionDonut'
import InteractionTypeBar from '@/components/charts/InteractionTypeBar'
import type { ModelRun, CountItem } from '@/lib/types'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export default async function OverviewPage() {
  const supabase = createServerClient()

  // Latest model run
  const { data: run } = await supabase
    .from('model_runs')
    .select('*')
    .order('run_at', { ascending: false })
    .limit(1)
    .single() as { data: ModelRun | null }

  // Counts
  const { count: totalInteractions } = await supabase
    .from('interactions')
    .select('*', { count: 'exact', head: true })

  const { count: totalFeedback } = await supabase
    .from('feedback')
    .select('*', { count: 'exact', head: true })

  // Interaction types for bar chart
  const { data: interactionRows } = await supabase
    .from('interactions')
    .select('type')

  // Compute
  const totalSessions  = run?.total_sessions ?? 0
  const cartSessions   = run?.cart_sessions  ?? 0
  const conversionRate = totalSessions > 0
    ? ((cartSessions / totalSessions) * 100).toFixed(1)
    : '0.0'

  const typeCounts: Record<string, number> = {}
  for (const row of interactionRows ?? []) {
    const t = row.type ?? 'unknown'
    typeCounts[t] = (typeCounts[t] ?? 0) + 1
  }
  const typeCountsArray: CountItem[] = Object.entries(typeCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  const lastTrained = run
    ? new Date(run.run_at).toLocaleString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : 'No run yet'

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '36px' }}>
        <p style={{ color: '#888888', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: '8px' }}>
          Dashboard
        </p>
        <h1 style={{ color: '#ffffff', fontFamily: 'Georgia, Cambria, serif', fontSize: '36px', fontWeight: 400, lineHeight: 1.1, marginBottom: '8px' }}>
          Overview
        </h1>
        <p style={{ color: '#555555', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px' }}>
          Last trained: <span style={{ color: '#888888' }}>{lastTrained}</span>
        </p>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <MetricCard label="Total Sessions"    value={totalSessions.toLocaleString()}            sub="Unique AR sessions tracked" />
        <MetricCard label="Cart Conversions"  value={cartSessions.toLocaleString()}             sub={`${conversionRate}% of all sessions`} accent />
        <MetricCard label="Total Events"      value={(totalInteractions ?? 0).toLocaleString()} sub="Individual interaction events" />
        <MetricCard label="Feedback Entries"  value={(totalFeedback ?? 0).toLocaleString()}     sub="User feedback responses" />
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '16px', marginBottom: '24px' }}>
        <CartConversionDonut cart={cartSessions} noCart={totalSessions - cartSessions} />
        <InteractionTypeBar data={typeCountsArray} />
      </div>

      {/* Model summary */}
      {run && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {[
            { title: 'Logistic Regression', metrics: run.lr_metrics, gold: false },
            { title: 'Random Forest',       metrics: run.rf_metrics, gold: true  },
          ].map(({ title, metrics, gold }) => (
            <div
              key={title}
              style={{
                background: '#111111',
                border: gold ? '1px solid #c9a84c44' : '1px solid #2a2a2a',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <p style={{ color: '#888888', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: '16px' }}>
                {title}
              </p>
              <div style={{ display: 'flex', gap: '32px' }}>
                {[
                  { label: 'Accuracy',  val: `${(metrics.accuracy  * 100).toFixed(1)}%` },
                  { label: 'Precision', val: `${(metrics.precision * 100).toFixed(1)}%` },
                  { label: 'Recall',    val: `${(metrics.recall    * 100).toFixed(1)}%` },
                  { label: 'F1',        val: `${(metrics.f1        * 100).toFixed(1)}%` },
                ].map(({ label, val }) => (
                  <div key={label}>
                    <p style={{ color: '#555555', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: '4px' }}>{label}</p>
                    <p style={{ color: gold ? '#c9a84c' : '#ffffff', fontFamily: 'Georgia, Cambria, serif', fontSize: '22px', fontWeight: 400 }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!run && (
        <div style={{ padding: '32px', background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: '#888888', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
            No model run found — run <code style={{ color: '#c9a84c', background: '#1a1a1a', padding: '2px 6px', borderRadius: '4px' }}>python train_and_store.py</code> first.
          </p>
        </div>
      )}
    </div>
  )
}
