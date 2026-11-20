// Parâmetros locais do exemplo NEXT. Não são especificações verificadas do veículo.
export const origensDemonstrativas = [
  { id: "next", nome: "NEXT", latitude: -23.540405908671097, longitude: -46.73414831818115 },
  { id: "fiap", nome: "FIAP", latitude: -23.564304, longitude: -46.652537 },
  { id: "paulista", nome: "Paulista", latitude: -23.5616, longitude: -46.6554 },
  { id: "vila-mariana", nome: "Vila Mariana", latitude: -23.5738, longitude: -46.6237 },
  { id: "campinas", nome: "Campinas", latitude: -22.908, longitude: -47.062 },
  { id: "santos", nome: "Santos", latitude: -23.96, longitude: -46.333 },
  { id: "sao-jose-campos", nome: "São José dos Campos", latitude: -23.185, longitude: -45.884 },
  { id: "paraty", nome: "Paraty", latitude: -23.218, longitude: -44.714 },
  { id: "rio-centro", nome: "Rio de Janeiro — Centro", latitude: -22.911, longitude: -43.185 },
  { id: "rio-barra", nome: "Rio de Janeiro — Barra", latitude: -23.003, longitude: -43.365 },
  { id: "cabo-frio", nome: "Cabo Frio", latitude: -22.879, longitude: -42.019 },
  { id: "buzios", nome: "Búzios", latitude: -22.752, longitude: -41.887 },
] as const;

export type OrigemDemonstrativaId = (typeof origensDemonstrativas)[number]["id"];

export const demonstracaoPadrao = {
  vehicleName: "BYD Dolphin Plus",
  vehicleRangeKm: 400,
  demoOriginId: "fiap" as OrigemDemonstrativaId,
  batteryPercent: 70,
};

export const limiteNomeVeiculo = 60;
export const limiteAutonomiaKm = 2000;

export function obterOrigemDemonstrativa(id: OrigemDemonstrativaId) {
  return origensDemonstrativas.find((origem) => origem.id === id) ?? origensDemonstrativas.find((origem) => origem.id === demonstracaoPadrao.demoOriginId)!;
}
