import assert from "node:assert/strict";
import test from "node:test";
import {
  canRecognizeSpeech,
  canSpeakText,
  speakText,
  startSpeechInput,
  stopSpeechOutput,
} from "../src/features/assistant/browserSpeech";

test("recurso de voz não presume APIs disponíveis fora do navegador", () => {
  assert.equal(canRecognizeSpeech(), false);
  assert.equal(canSpeakText(), false);
  assert.equal(startSpeechInput({ onResult() {}, onError() {}, onEnd() {} }), null);
  stopSpeechOutput();
});

test("reconhecimento aguarda fala final, em português, sem escutar continuamente", () => {
  let instance: FakeRecognition | null = null;
  class FakeRecognition {
    lang = "";
    continuous = true;
    interimResults = true;
    onresult: ((event: { results: ArrayLike<({ 0: { transcript: string }; isFinal: boolean })>; resultIndex: number }) => void) | null = null;
    onerror: ((event: { error?: string }) => void) | null = null;
    onend: (() => void) | null = null;
    started = false;
    aborted = false;
    constructor() { instance = this; }
    start() { this.started = true; }
    abort() { this.aborted = true; }
  }
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", { configurable: true, value: { webkitSpeechRecognition: FakeRecognition } });
  try {
    assert.equal(canRecognizeSpeech(), true);
    const transcripts: string[] = [];
    const session = startSpeechInput({ onResult: text => transcripts.push(text), onError() {}, onEnd() {} });
    const current = instance as FakeRecognition | null;
    assert.ok(current);
    assert.ok(session);
    assert.equal(current.started, true);
    assert.equal(current.lang, "pt-BR");
    assert.equal(current.continuous, false);
    assert.equal(current.interimResults, false);
    current.onresult?.({ results: [{ 0: { transcript: "incompleto" }, isFinal: false }], resultIndex: 0 });
    current.onresult?.({ results: [{ 0: { transcript: " onde recarregar? " }, isFinal: true }], resultIndex: 0 });
    assert.deepEqual(transcripts, ["onde recarregar?"]);
    session.stop();
    assert.equal(current.aborted, true);
  } finally {
    if (original) Object.defineProperty(globalThis, "window", original);
    else Reflect.deleteProperty(globalThis, "window");
  }
});

test("síntese escolhe voz pt-BR e pode ser interrompida", () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "window");
  const originalUtterance = Object.getOwnPropertyDescriptor(globalThis, "SpeechSynthesisUtterance");
  const spoken: Array<{ text: string; lang?: string; voice?: { lang: string; voiceURI: string } }> = [];
  let canceled = 0;
  class FakeUtterance {
    lang = "";
    rate = 1;
    voice?: { lang: string; voiceURI: string };
    onend?: () => void;
    onerror?: () => void;
    text: string;
    constructor(text: string) { this.text = text; }
  }
  Object.defineProperty(globalThis, "SpeechSynthesisUtterance", { configurable: true, value: FakeUtterance });
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    speechSynthesis: {
      getVoices: () => [{ lang: "en-US", voiceURI: "en" }, { lang: "pt-BR", voiceURI: "br" }],
      speak: (utterance: FakeUtterance) => spoken.push(utterance),
      cancel: () => { canceled += 1; },
    },
  } });
  try {
    assert.equal(canSpeakText(), true);
    assert.equal(speakText("Uma estação próxima", { onEnd() {}, onError() {} }, "br"), true);
    assert.equal(spoken.length, 1);
    assert.equal(spoken[0].text, "Uma estação próxima");
    assert.equal(spoken[0].voice?.voiceURI, "br");
    assert.equal(spoken[0].lang, "pt-BR");
    stopSpeechOutput();
    assert.ok(canceled >= 2);
  } finally {
    if (original) Object.defineProperty(globalThis, "window", original);
    else Reflect.deleteProperty(globalThis, "window");
    if (originalUtterance) Object.defineProperty(globalThis, "SpeechSynthesisUtterance", originalUtterance);
    else Reflect.deleteProperty(globalThis, "SpeechSynthesisUtterance");
  }
});
