import { createServerClient } from '@/lib/supabase/server'
import MetricCard from '@/components/ui/MetricCard'
import SentimentChart from '@/components/charts/SentimentChart'
import KeywordsChart from '@/components/charts/KeywordsChart'
import RatingDistribution from '@/components/charts/RatingDistribution'
import DemographicsChart from '@/components/charts/DemographicsChart'
import type { FeedbackRow, ModelRun, DemographicItem } from '@/lib/types'

export const revalidate = 0
export const dynamic = 'force-dynamic'

function countBy<T>(arr: T[], key: (item: T) => string): DemographicItem[] {
  const counts: Record<string, number> = {}
  for (const item of arr) {
    const k = key(item)?.trim()
    if (k) counts[k] = (counts[k] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
}

export default async function SentimentPage() {
  const supabase = createServerClient()

  const { data: feedbackRows } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false }) as { data: FeedbackRow[] | null }

  const { data: latestRun } = await supabase
    .from('model_runs')
    .select('top_keywords')
    .order('run_at', { ascending: false })
    .limit(1)
    .single() as { data: Pick<ModelRun, 'top_keywords'> | null }

  const rows = feedbackRows ?? []

  // ── KPI computations ──────────────────────────────────────────────────────────
  const ratingsWithValue  = rows.filter(r => r.rating !== null)
  const avgRating = ratingsWithValue.length > 0
    ? (ratingsWithValue.reduce((s, r) => s + (r.rating ?? 0), 0) / ratingsWithValue.length).toFixed(1)
    : '—'

  const positiveRecommend = rows.filter(r => r.recommend === 'Yes' || r.recommend === 'Definitely').length
  const recommendRate     = rows.length > 0 ? Math.round((positiveRecommend / rows.length) * 100) : 0

  const wouldUse     = rows.filter(r => r.would_use_for_shopping === 'Definitely' || r.would_use_for_shopping === 'Yes').length
  const wouldUseRate = rows.length > 0 ? Math.round((wouldUse / rows.length) * 100) : 0

  const positiveCount = rows.filter(r => r.sentiment_label === 'Positive').length
  const positiveRate  = rows.length > 0 ? Math.round((positiveCount / rows.length) * 100) : 0

  // ── Sentiment chart data ──────────────────────────────────────────────────────
  const sentimentOrder = ['Positive', 'Neutral', 'Negative']
  const sentimentCounts: Record<string, number> = {}
  for (const r of rows) {
    const l = r.sentiment_label ?? 'Neutral'
    sentimentCounts[l] = (sentimentCounts[l] ?? 0) + 1
  }
  const sentimentData = sentimentOrder.map(label => ({
    label,
    count: sentimentCounts[label] ?? 0,
    pct:   rows.length > 0 ? ((sentimentCounts[label] ?? 0) / rows.length * 100).toFixed(0) : '0',
  }))

  // ── Rating distribution ───────────────────────────────────────────────────────
  const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  for (const r of rows) {
    if (r.rating && r.rating >= 1 && r.rating <= 5) {
      ratingCounts[r.rating] = (ratingCounts[r.rating] ?? 0) + 1
    }
  }
  const ratingData = [1, 2, 3, 4, 5].map(star => ({ star, count: ratingCounts[star] ?? 0 }))

  // ── Demographics ──────────────────────────────────────────────────────────────
  const deviceData    = countBy(rows, r => r.device    ?? '')
  const ageData       = countBy(rows, r => r.user_age  ?? '')
  const genderData    = countBy(rows, r => r.user_gender ?? '')
  const heardFromData = countBy(rows, r => r.heard_from ?? '')

  // ── Keywords ──────────────────────────────────────────────────────────────────
  const keywords = latestRun?.top_keywords ?? { positive: {}, negative: {} }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <p style={{ color: '#888888', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: '8px' }}>
          Feedback
        </p>
        <h1 style={{ color: '#ffffff', fontFamily: 'Georgia, Cambria, serif', fontSize: '36px', fontWeight: 400, lineHeight: 1.1 }}>
          Sentiment
        </h1>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <MetricCard label="Avg Rating"       value={`${avgRating} / 5`} sub={`${ratingsWithValue.length} rated responses`} accent />
        <MetricCard label="Would Recommend"  value={`${recommendRate}%`} sub={`${positiveRecommend} of ${rows.length} respondents`} />
        <MetricCard label="Use for Shopping" value={`${wouldUseRate}%`}  sub={`${wouldUse} would shop via AR`} />
        <MetricCard label="Positive Sentiment" value={`${positiveRate}%`} sub={`${positiveCount} positive comments`} />
      </div>

      {/* Sentiment + Keywords */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <SentimentChart data={sentimentData} />
        <KeywordsChart positive={keywords.positive} negative={keywords.negative} />
      </div>

      {/* Rating distribution + Demographics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <RatingDistribution data={ratingData} />
        <DemographicsChart device={deviceData} age={ageData} gender={genderData} heardFrom={heardFromData} />
      </div>

      {/* Feedback table */}
      <div style={{ background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px', overflowX: 'auto' }}>
        <p style={{ color: '#888888', fontSize: '9px', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: '20px' }}>
          All Feedback — {rows.length} Entries
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['User', 'Product', 'Rating', 'Comment', 'Sentiment', 'Recommend'].map(h => (
                <th key={h} style={{ color: '#555555', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 400, textAlign: 'left', paddingBottom: '12px', borderBottom: '1px solid #1a1a1a', paddingRight: '16px' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const sentColor = r.sentiment_label === 'Positive' ? '#4a9a4a' : r.sentiment_label === 'Negative' ? '#cc4444' : '#555555'
              return (
                <tr key={r.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                  <td style={{ padding: '12px 16px 12px 0', color: '#ffffff', fontFamily: 'Georgia, Cambria, serif', fontSize: '14px', whiteSpace: 'nowrap' }}>
                    {r.user_name || '—'}
                  </td>
                  <td style={{ padding: '12px 16px 12px 0', color: '#888888', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {r.product_name || '—'}
                  </td>
                  <td style={{ padding: '12px 16px 12px 0', color: '#c9a84c', fontFamily: 'Georgia, Cambria, serif', fontSize: '14px', whiteSpace: 'nowrap' }}>
                    {r.rating ? `${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}` : '—'}
                  </td>
                  <td style={{ padding: '12px 16px 12px 0', color: '#888888', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px', maxWidth: '280px' }}>
                    {r.comment?.trim() || <span style={{ color: '#444444' }}>No comment</span>}
                  </td>
                  <td style={{ padding: '12px 16px 12px 0', whiteSpace: 'nowrap' }}>
                    <span style={{ color: sentColor, fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px', letterSpacing: '0.1em' }}>
                      {r.sentiment_label || '—'}
                    </span>
                    {r.sentiment_score !== null && (
                      <span style={{ color: '#444444', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '10px', marginLeft: '6px' }}>
                        ({r.sentiment_score?.toFixed(2)})
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '12px 0', color: '#888888', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '12px', whiteSpace: 'nowrap' }}>
                    {r.recommend || '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
