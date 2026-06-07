import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client for use in Server Components, Server Actions,
 * and Route Handlers. Uses the publishable key — safe for server-side reads.
 * All tables have RLS read policies set to public.
 */
export function createServerClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )
}

/**
 * Fetches ALL rows from a table by paginating in batches of 1000.
 * Supabase returns max 1000 rows per request by default — this gets around that.
 */
export async function fetchAll<T>(
  table: string,
  columns: string = '*'
): Promise<T[]> {
  const supabase = createServerClient()
  const batchSize = 1000
  const allRows: T[] = []
  let offset = 0

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .range(offset, offset + batchSize - 1)

    if (error || !data || data.length === 0) break

    allRows.push(...(data as T[]))

    if (data.length < batchSize) break
    offset += batchSize
  }

  return allRows
}
