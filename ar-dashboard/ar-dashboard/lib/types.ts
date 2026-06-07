// ─── Raw Supabase row types ───────────────────────────────────────────────────

export interface InteractionRow {
  id: string
  created_at: string
  type: string
  product_index: number | null
  product_id: string | null
  product_name: string | null
  from_index: number | null
  to_index: number | null
  action: string | null
  color: string | null
  category: string | null
  raw_transcript: string | null
  rating: number | null
  session_start: number | null
  session_id: string | null
}

export interface FeedbackRow {
  id: string
  created_at: string
  product_id: string | null
  product_name: string | null
  rating: number | null
  comment: string | null
  recommend: string | null
  user_name: string | null
  user_email: string | null
  user_nationality: string | null
  product_index: number | null
  session_start: number | null
  session_id: string | null
  category_interest: string | null
  would_use_for_shopping: string | null
  user_age: string | null
  user_gender: string | null
  heard_from: string | null
  device: string | null
  sentiment_score: number | null
  sentiment_label: string | null
}

// ─── model_runs JSONB shapes ──────────────────────────────────────────────────

export interface ModelMetrics {
  accuracy: number
  precision: number
  recall: number
  f1: number
  roc_auc: number
  confusion_matrix: [[number, number], [number, number]]
  roc_curve: { fpr: number[]; tpr: number[] }
  coefficients?: Record<string, number>
  intercept?: number
  feature_importances?: Record<string, number>
}

export interface ModelRun {
  id: number
  run_at: string
  total_sessions: number
  cart_sessions: number
  lr_metrics: ModelMetrics
  rf_metrics: ModelMetrics
  correlation_matrix: Record<string, Record<string, number>>
  top_keywords: {
    positive: Record<string, number>
    negative: Record<string, number>
  }
  lr_coefficients: {
    coefficients: Record<string, number>
    intercept: number
    features: string[]
  }
}

// ─── Chart data shapes (computed server-side, passed as props) ────────────────

export interface CountItem {
  name: string
  count: number
}

export interface ProductInteractionItem {
  product: string
  zoom: number
  rotate: number
  category_filter: number
  voice_command: number
  view_journey: number
  product_switch: number
  add_to_cart: number
  rate: number
}

export interface DemographicItem {
  label: string
  value: number
}

export interface RunHistoryItem {
  id: number
  run_at: string
  total_sessions: number
  cart_sessions: number
  lr_accuracy: number
  rf_accuracy: number
}
