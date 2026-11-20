/**
 * Voice is opt-in and browser-only. Speech recognition is started only by a
 * deliberate user action; browsers may process captured audio remotely.
 * Neither feature requires an API key from the Flui application.
 */
export type SpeechSession = { stop: () => void };
export type SpeechInputCallbacks = {
  onResult: (transcript: string) => void;
  onError: (message: string) => void;
  onEnd: () => void;
};
export type SpeechOutputCallbacks = {
  onEnd: () => void;
  onError: () => void;
};

type SpeechRecognitionResultLike = ArrayLike<{ transcript: string }> & { isFinal?: boolean };
type SpeechRecognitionEventLike = {
  results: ArrayLike<SpeechRecognitionResultLike>;
  resultIndex?: number;
};
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  abort: () => void;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function recognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === "undefined") return null;
  const browser = window as typeof window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return browser.SpeechRecognition ?? browser.webkitSpeechRecognition ?? null;
}

export function canRecognizeSpeech(): boolean {
  return recognitionConstructor() !== null;
}

export function canSpeakText(): boolean {
  return typeof window !== "undefined" &&
    typeof window.speechSynthesis?.speak === "function" &&
    typeof SpeechSynthesisUtterance === "function";
}

const recognitionErrors: Record<string, string> = {
  "not-allowed": "Autorize o microfone nas permissões do navegador.",
  "service-not-allowed": "O reconhecimento de voz foi bloqueado pelo navegador.",
  "audio-capture": "Não foi possível acessar o microfone.",
  "no-speech": "Não ouvi nenhuma fala. Tente novamente.",
  "network": "O reconhecimento de voz precisa de conexão neste navegador.",
  "language-not-supported": "O navegador não oferece reconhecimento em português.",
};

export function startSpeechInput(callbacks: SpeechInputCallbacks): SpeechSession | null {
  const Constructor = recognitionConstructor();
  if (!Constructor) return null;

  let recognition: SpeechRecognitionLike;
  try {
    recognition = new Constructor();
  } catch {
    callbacks.onError("Não foi possível iniciar o reconhecimento de voz.");
    return null;
  }

  recognition.lang = "pt-BR";
  recognition.continuous = false;
  recognition.interimResults = false;
  let finished = false;
  let recognized = false;

  recognition.onresult = (event) => {
    if (finished || recognized) return;
    const result = event.results[event.resultIndex ?? 0] ?? event.results[0];
    const transcript = result?.[0]?.transcript?.trim();
    if (!transcript || result?.isFinal === false) return;
    recognized = true;
    callbacks.onResult(transcript);
  };
  recognition.onerror = (event) => {
    if (finished) return;
    callbacks.onError(recognitionErrors[event.error ?? ""] ?? "Não consegui reconhecer sua fala. Tente novamente.");
  };
  recognition.onend = () => {
    if (finished) return;
    finished = true;
    callbacks.onEnd();
  };

  try {
    recognition.start();
  } catch {
    finished = true;
    callbacks.onError("Não foi possível ativar o microfone. Tente novamente.");
    callbacks.onEnd();
    return null;
  }

  return {
    stop: () => {
      if (finished) return;
      finished = true;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try { recognition.abort(); } catch { /* may already be stopped */ }
    },
  };
}

export function stopSpeechOutput(): void {
  if (typeof window === "undefined") return;
  window.speechSynthesis?.cancel();
}

export function speakText(
  text: string,
  callbacks: SpeechOutputCallbacks,
  preferredVoiceId?: string | null,
): boolean {
  if (!canSpeakText() || !text.trim()) return false;
  try {
    stopSpeechOutput();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-BR";
    utterance.rate = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((voice) => voice.voiceURI === preferredVoiceId && /^pt(?:[-_]|$)/i.test(voice.lang)) ??
      voices.find((voice) => /^pt[-_]br$/i.test(voice.lang)) ??
      voices.find((voice) => /^pt(?:[-_]|$)/i.test(voice.lang));
    if (preferred) utterance.voice = preferred;
    utterance.onend = callbacks.onEnd;
    utterance.onerror = callbacks.onError;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    callbacks.onError();
    return false;
  }
}
