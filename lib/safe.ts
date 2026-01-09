/**
 * Safe async wrapper - prevents UI crashes from failed promises
 * Returns fallback value if promise rejects
 * 
 * @example
 * const report = await safe(
 *   supabase.from("Snapshot").select("*").single(),
 *   null
 * );
 */
export async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    console.error("Safe promise failed:", error);
    return fallback;
  }
}

/**
 * Safe data fetch with Supabase - handles errors gracefully
 * Returns fallback if error or no data
 */
export async function safeFetch<T>(
  promise: Promise<{ data: T | null; error: any }>,
  fallback: T
): Promise<T> {
  try {
    const result = await promise;
    if (result.error) {
      console.error("Safe fetch error:", result.error);
      return fallback;
    }
    return result.data ?? fallback;
  } catch (error) {
    console.error("Safe fetch failed:", error);
    return fallback;
  }
}
