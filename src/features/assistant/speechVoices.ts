export type AppSpeechVoice = { identifier: string; name: string; language: string };
export function normalizeSpeechVoiceId(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 256 && !/[\u0000-\u001f]/.test(value) ? value.trim() : null;
}
export function portugueseSpeechVoices(voices: AppSpeechVoice[]) {
  const seen = new Set<string>();
  return voices.filter(voice => {
    if (!/^pt(?:[-_]|$)/i.test(voice.language) || !normalizeSpeechVoiceId(voice.identifier) || seen.has(voice.identifier)) return false;
    seen.add(voice.identifier);
    return true;
  }).sort((a, b) => Number(/^pt[-_]br$/i.test(b.language)) - Number(/^pt[-_]br$/i.test(a.language)) || a.name.localeCompare(b.name, "pt-BR"));
}
export async function loadSpeechVoices(load: () => Promise<AppSpeechVoice[]>, timeoutMs = 3000): Promise<AppSpeechVoice[]> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return portugueseSpeechVoices(await Promise.race([load(), new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error("Consulta de vozes excedeu o tempo.")), timeoutMs); })]));
  } finally { if (timer) clearTimeout(timer); }
}
export async function resolveSpeechVoiceIdentifier(selected: string | null, load: () => Promise<AppSpeechVoice[]>): Promise<string | undefined> {
  if (!selected) return undefined;
  try { return (await loadSpeechVoices(load)).find(voice => voice.identifier === selected)?.identifier; }
  catch { return undefined; }
}
