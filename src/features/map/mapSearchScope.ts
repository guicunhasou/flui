import type { StationFilters } from "../../types";

// O mapa livre inclui todo o catálogo, inclusive sem texto de busca. Uma
// distância escolhida nos filtros continua válida; não altera dados salvos.
export function getMapSearchScope(filters: StationFilters, hasExplicitFilters: boolean) {
  return hasExplicitFilters ? filters : { ...filters, distance: { maxKm: Infinity } };
}
