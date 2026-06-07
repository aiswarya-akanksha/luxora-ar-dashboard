import { createServerClient } from '@/lib/supabase/server'
import MetricCard from '@/components/ui/MetricCard'
import ConfusionMatrix from '@/components/charts/ConfusionMatrix'
import RocCurveChart from '@/components/charts/RocCurveChart'
import FeatureImportanceChart from '@/components/charts/FeatureImportanceChart'
import PredictorWidget from '@/components/charts/PredictorWidget'
import RunHistoryTable from '@/components/charts/RunHistoryTable'
import type { ModelRun, RunHistoryItem } from '@/lib/types'

export const revalidate = 0

export default async function ModelsPage() {
  const supabase = createServerClient()

  const { data: runs } = await supabase
    .from('model_runs')
    .select('*')
    .order('run_at', { ascending: false }) as { data: ModelRun[] | null }

  if (!runs || runs.length === 0) {
    return (
      <div>
        <p style={{ color: '#888888', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: '8px' }}>Machine Learning</p>
        <h1 style={{ color: '#ffffff', fontFamily: 'Georgia, Cambria, serif', fontSize: '36px', fontWeight: 400, marginBottom: '32px' }}>Model Performance</h1>
        <div style={{ padding: '32px', background: '#111111', border: '1px solid #2a2a2a', borderRadius: '12px', textAlign: 'center' }}>
          <p style={{ color: '#888888', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '13px' }}>
            No model run found — run <code style={{ color: '#c9a84c', background: '#1a1a1a', padding: '2px 6px', borderRadius: '4px' }}>python train_and_store.py</code> first.
          </p>
        </div>
      </div>
    )
  }

  const run = runs[0]
  const { lr_metrics: lr, rf_metrics: rf } = run

  const history: RunHistoryItem[] = runs.map(r => ({
    id:            r.id,
    run_at:        r.run_at,
    total_sessions: r.total_sessions,
    cart_sessions:  r.cart_sessions,
    lr_accuracy:   r.lr_metrics.accuracy,
    rf_accuracy:   r.rf_metrics.accuracy,
  }))

  const bestModel  = rf.accuracy >= lr.accuracy ? 'Random Forest' : 'Logistic Regression'
  const bestAuc    = Math.max(rf.roc_auc, lr.roc_auc)

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <p style={{ color: '#888888', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', fontFamily: 'Inter, system-ui, sans-serif', marginBottom: '8px' }}>
          Machine Learning
        </p>
        <h1 style={{ color: '#ffffff', fontFamily: 'Georgia, Cambria, serif', fontSize: '36px', fontWeight: 400, lineHeight: 1.1, marginBottom: '8px' }}>
          Model Performance
        </h1>
        <p style={{ color: '#444444', fontFamily: 'Inter, system-ui, sans-serif', fontSize: '11px' }}>
          Trained on {run.total_sessions} sessions · {run.cart_sessions} positive labels · Small dataset — treat metrics as directional
        </p>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <MetricCard label="LR Accuracy"  value={`${(lr.accuracy  * 100).toFixed(1)}%`} sub={`AUC ${lr.roc_auc.toFixed(3)}`} />
        <MetricCard label="RF Accuracy"  value={`${(rf.accuracy  * 100).toFixed(1)}%`} sub={`AUC ${rf.roc_auc.toFixed(3)}`} accent />
        <MetricCard label="Best Model"   value={bestModel === 'Random Forest' ? 'RF' : 'LR'} sub={bestModel} accent />
        <MetricCard label="Best AUC"     value={bestAuc.toFixed(3)} sub="Higher = better separation" />
      </div>

      {/* Confusion matrices */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <ConfusionMatrix matrix={lr.confusion_matrix} title="Logistic Regression — Confusion Matrix" />
        <ConfusionMatrix matrix={rf.confusion_matrix} title="Random Forest — Confusion Matrix" accent />
      </div>

      {/* ROC + Feature importance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <RocCurveChart
          lr={{ ...lr.roc_curve, auc: lr.roc_auc }}
          rf={{ ...rf.roc_curve, auc: rf.roc_auc }}
        />
        <FeatureImportanceChart importances={rf.feature_importances ?? {}} />
      </div>

      {/* Live predictor */}
      <div style={{ marginBottom: '24px' }}>
        <PredictorWidget
          coefficients={run.lr_coefficients.coefficients}
          intercept={run.lr_coefficients.intercept}
          features={run.lr_coefficients.features}
        />
      </div>

      {/* Run history */}
      <RunHistoryTable runs={history} />
    </div>
  )
}
