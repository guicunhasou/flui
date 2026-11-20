import assert from "node:assert/strict";
import test from "node:test";
import { recommendStations } from "../src/features/assistant/fluiAssistant";
import { describeAssistantContext, summarizeAssistantContext, summarizeSuggestion } from "../src/features/assistant/assistantPresentation";
import { createStation } from "./fixtures";

test("resumo preserva os valores do motor e os limites de segurança", () => {
  const station = createStation({ name: "Ponto de teste", distanceKm: 7 });
  const result = recommendStations({ stations: [station], intent: "fastCharge", vehicleRangeKm: 400, batteryPercent: 70, now: new Date("2026-10-20T12:00:00-03:00") });
  assert.ok(result);
  const before = JSON.stringify(result);
  const text = summarizeSuggestion(result);
  assert.ok(text.includes(result.primary.name));
  assert.ok(text.includes(`Chegada ≈${result.arrivalBatteryPercent}%`));
  assert.ok(text.includes(`${result.powerKw} kW`));
  for (const warning of ["em linha reta", "Dados simulados", "reserva de 5%", "Confirme funcionamento e compatibilidade"]) assert.ok(text.includes(warning));
  assert.equal(JSON.stringify(result), before);
  assert.ok(text.length < 300);
});

test("contexto distingue bateria manual, origem do cenário e conjunto recebido sem alterar entradas", () => {
  const preferences = { vehicleName: "Veículo de teste", vehicleRangeKm: 330, batteryPercent: 42, batterySource: "manual" as const, batteryUpdatedAt: "2026-10-22T12:00:00.000Z" };
  const before = JSON.stringify(preferences);
  const text = describeAssistantContext(preferences, "Vila Mariana", 3);
  for (const expected of ["330 km", "42%", "Informado manualmente", "Origem do cenário: Vila Mariana", "não usa sua localização real", "consulta: 3", "Sem telemetria"]) assert.ok(text.includes(expected));
  assert.equal(JSON.stringify(preferences), before);
});

test("contexto não atribui bateria demonstrativa ou antiga a telemetria real", () => {
  for (const batterySource of ["demo", "unknown"] as const) {
    const text = describeAssistantContext({ vehicleName: "Exemplo", vehicleRangeKm: 400, batteryPercent: 70, batterySource, batteryUpdatedAt: null }, "FIAP", 0);
    assert.ok(text.includes(batterySource === "demo" ? "Valor de simulação" : "Origem não registrada"));
    assert.ok(text.includes("consulta: 0"));
    assert.ok(text.includes("não confirma disponibilidade real"));
  }
});

test("resumo contextual compacto preserva veículo, bateria e caráter demonstrativo da origem", () => {
  const preferences = { vehicleName: "Veículo com nome longo para leitura ampliada", batteryPercent: 42 };
  const before = JSON.stringify(preferences);
  assert.equal(summarizeAssistantContext(preferences, "Vila Mariana"), `${preferences.vehicleName} · bateria 42%\nOrigem do cenário: Vila Mariana`);
  assert.equal(JSON.stringify(preferences), before);
});


test("resumo visível explica a prioridade sem prometer fila ou velocidade reais", () => {
  const station = createStation({ name: "Ponto de teste", distanceKm: 7, amenities: ["coffee", "restroom", "wifi"] });
  const intents = ["lowBattery", "fastCharge", "avoidQueues", "coffeeAndRestroom", "comfortableWait"] as const;
  const texts = intents.map(intent => {
    const recommendation = recommendStations({ stations: [station], intent, vehicleRangeKm: 400, batteryPercent: 70, now: new Date("2026-10-23T15:00:00Z") });
    assert.ok(recommendation);
    return summarizeSuggestion(recommendation);
  });
  assert.equal(new Set(texts).size, 5);
  assert.match(texts[0], /preservar bateria/);
  assert.match(texts[1], /velocidade depende do carro/);
  assert.match(texts[2], /fila real não é monitorada/);
  assert.match(texts[3], /Café e banheiro/);
  assert.match(texts[4], /esperar com conforto/);
  for (const text of texts) assert.match(text, /Sugiro Ponto de teste/);
});
