// Only a genuinely absent key is empty. Failed reads must reach the UI instead
// of being used as an empty list by a later read/modify/write operation.
export async function readStoredJson<T>(read: () => Promise<string | null>, fallback: T): Promise<T> {
  let value: string | null;
  try { value = await read(); } catch { throw new Error("Não foi possível ler os dados locais."); }
  if (value === null) return fallback;
  try { return JSON.parse(value) as T; } catch { throw new Error("Não foi possível interpretar os dados locais."); }
}
