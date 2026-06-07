import { createServerClient } from '@/lib/supabase/server'
import MetricCard from '@/components/ui/MetricCard'
import InteractionTypeBar from '@/components/charts/InteractionTypeBar'
import ProductInteractionBar from '@/components/charts/ProductInteractionBar'
import VoiceCommandsChart from '@/components/charts/VoiceCommandsChart'
import type { CountItem, ProductInteractionItem } from '@/lib/types'

export const revalidate = 0
export const dynamic = 'force-dynamic'

const INTERACTION_TYPES = [
  'zoom', 'rotate', 'category_filter', 'voice_command',
  'view_journey', 'product_switch', 'rate', 'add_to_cart',
]

export default async function InteractionsPage() {
  const supabase = createServerClient()

  const { data: rows } = await supabase
    .from('interactions')
    .select('type, product_name, action')

  if (!rows) {
    return <p style={{ color: '#888888', fontFamily: 'Inter, system-ui, sans-serif' }}>No interaction data found.</p>
  }

  // ── Type counts ──────────────────────────────────────────────────────────────
  const typeCounts: Record<string, number> = {}
  for (const r of rows) {
    const t = r.type ?? 'unknown'
    typeCounts[t] = (typeCounts[t] ?? 0) + 1
  }
  const typeCountsArray: CountItem[] = Object.entries(typeCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  // ── Product × type matrix ────────────────────────────────────────────────────
  const productMap: Record<string, Record<string, number>> = {}
  for (const r of rows) {
    const product = r.product_name?.trim() || 'Unknown'
    const type    = r.type ?? 'unknown'
    if (!productMap[product]) productMap[product] = {}
    productMap[product][type] = (productMap[product][type] ?? 0) + 1
  }

  // Top 8 products by total interactions
  const productData: ProductInteractionItem[] = Object.entries(productMap)
    .map(([product, types]) => ({
      product,
      zoom:            types['zoom']            ?? 0,
      rotate:          types['rotate']          ?? 0,
      category_filter: types['category_filter'] ?? 0,
      voice_command:   types['voice_command']   ?? 0,
      view_journey:    types['view_journey']    ?? 0,
      product_switch:  types['product_switch']  ?? 0,
      rate:            types['rate']            ?? 0,
      add_to_cart:     types['add_to_cart']     ?? 0,
    }))
    .sort((a, b) => {
      const totalA = INTERACTION_TYPES.reduce((s, t) => s + (a[t as keyof ProductInteractionItem] as number), 0)
      const totalB = INTERACTION_TYPES.reduce((s, t) => s + (b[t as keyof ProductInteractionItem] as number), 0)
      return totalB - totalA
    })
    .slice(0, 8)

  // ── Voice commands ───────────────────────────────────────────────────────────
  const voiceRows  = rows.filter(r => r.type === 'voice_command')
  const actionCounts: Record<string, number> = {}
  for (const r of voiceRows) {
    const a = r.action?.trim() || 'General'
    actionCounts[a] = (actionCounts[a] ?? 0) + 1
  }
  const voiceData: CountItem[] = Object.entries(actionCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)

  // ── KPIs ─────────────────────────────────────────────────────────────────────
  const totalEvents    = rows.length
  const uniqueProducts = Object.keys(productMap).length
  const addToCartCount = typeCounts['add_to_cart'] ?? 0
  const voiceCount     = typeCounts['voice_command'] ?? 0
  const topType        = typeCountsArray[0]?.name ?? '—'

  const formatType = (t: string) =>
    t.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '36px' }}>
        <p style={{ color: '#888888', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: '8px' }}>
          Analytics
        </p>
        <h1 style={{ color: '#ffffff', fontFamily: 'Georgia, Cambria, serif', fontSize: '36px', fontWeight: 400, lineHeight: 1.1 }}>
          Interactions
        </h1>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <MetricCard
          label="Total Events"
          value={totalEvents.toLocaleString()}
          sub="Across all sessions"
        />
        <MetricCard
          label="Add to Cart"
          value={addToCartCount.toLocaleString()}
          sub="Conversion events"
          accent
        />
        <MetricCard
          label="Products Viewed"
          value={uniqueProducts.toLocaleString()}
          sub="Unique products interacted with"
        />
        <MetricCard
          label="Voice Commands"
          value={voiceCount.toLocaleString()}
          sub={`Most common: ${formatType(topType)}`}
        />
      </div>

      {/* Interaction type breakdown */}
      <div style={{ marginBottom: '24px' }}>
        <InteractionTypeBar data={typeCountsArray} />
      </div>

      {/* Product breakdown */}
      <div style={{ marginBottom: '24px' }}>
        <ProductInteractionBar data={productData} />
      </div>

      {/* Voice commands */}
      <div>
        <VoiceCommandsChart data={voiceData} />
      </div>
    </div>
  )
}
