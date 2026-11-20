import assert from "node:assert/strict";
import test from "node:test";
import { getMapSearchScope } from "../src/features/map/mapSearchScope";
import { cloneDefaultFilters } from "../src/utils/stationFilterParams";
import { filtrarEstacoes } from "../src/utils/filtrarEstacoes";
import { chargingStations } from "../src/data/fixtures/chargingStations";
import { aplicarOrigemDemonstrativa } from "../src/utils/demonstracao";
import { obterOrigemDemonstrativa } from "../src/data/demonstracao";

const catalog = aplicarOrigemDemonstrativa(chargingStations, obterOrigemDemonstrativa("fiap"));

test("mapa sem busca inclui os 80 pontos, sem alterar filtros salvos ou origem", () => {
  const filters = cloneDefaultFilters(), before = JSON.stringify(filters);
  const result = filtrarEstacoes({ estacoes: catalog, filtros: getMapSearchScope(filters, false) });
  assert.equal(result.length, 80);
  assert.ok(result.some(s => s.id === "next-buzios"));
  assert.equal(JSON.stringify(filters), before);
});

test("busca distante e retorno à busca vazia usam o mesmo catálogo completo", () => {
  const filters = getMapSearchScope(cloneDefaultFilters(), false);
  for (const city of ["Búzios", "Rio de Janeiro", "Cabo Frio"]) {
    assert.ok(filtrarEstacoes({ estacoes: catalog, filtros: filters, termoBusca: city }).length > 0, city);
  }
  assert.equal(filtrarEstacoes({ estacoes: catalog, filtros: filters, termoBusca: "  " }).length, 80);
});

test("raio explicitamente escolhido e filtros rápidos continuam limitando os pontos", () => {
  const filters = cloneDefaultFilters();
  assert.strictEqual(getMapSearchScope(filters, true), filters);
  assert.equal(filtrarEstacoes({ estacoes: catalog, filtros: getMapSearchScope(filters, true), termoBusca: "Búzios" }).length, 0);
  filters.statuses = ["maintenance"];
  const result = filtrarEstacoes({ estacoes: catalog, filtros: getMapSearchScope(filters, false) });
  assert.ok(result.length > 0 && result.length < 80);
  assert.ok(result.some(s => s.state === "RJ"));
  assert.ok(result.every(s => s.status === "maintenance"));
});
