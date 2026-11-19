import assert from "node:assert/strict";
import test from "node:test";
import {
  getBatterySourceLabels,
  normalizeBatteryData,
} from "../src/utils/batteryData";

test("bateria padrão é demonstrativa e não inventa atualização", () => {
  const data = normalizeBatteryData();
  assert.equal(data.batterySource, "demo");
  assert.equal(data.batteryUpdatedAt, null);
  assert.deepEqual(getBatterySourceLabels(data), {
    source: "Valor de simulação",
    detail: "Informe a carga do painel para personalizar as estimativas",
  });
});

test("edição manual conserva valor, origem e data após serialização e leitura", () => {
  const saved = {
    batteryPercent: 35,
    batterySource: "manual" as const,
    batteryUpdatedAt: "2026-10-15T19:30:00Z",
  };
  const data = normalizeBatteryData(JSON.parse(JSON.stringify(saved)));
  assert.deepEqual(data, saved);
  assert.equal(getBatterySourceLabels(data).source, "Informado manualmente");
  assert.doesNotMatch(
    getBatterySourceLabels(data).detail,
    /agora|há 1 min|veículo/,
  );
});

test("preferências antigas não recebem uma origem fabricada", () => {
  const data = normalizeBatteryData({ batteryPercent: 40 });
  assert.equal(data.batteryPercent, 40);
  assert.equal(data.batterySource, "unknown");
  assert.equal(getBatterySourceLabels(data).source, "Origem não registrada");
});

test("dados inválidos não preservam uma alegação manual nem valores não finitos", () => {
  for (const batteryPercent of [NaN, Infinity, -Infinity]) {
    assert.equal(
      normalizeBatteryData({ batteryPercent }).batterySource,
      "demo",
    );
  }
  assert.equal(
    normalizeBatteryData({
      batteryPercent: 25,
      batterySource: "manual",
      batteryUpdatedAt: "inválida",
    }).batterySource,
    "unknown",
  );
});
