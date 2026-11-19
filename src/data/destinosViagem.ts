// Destinos e paradas de recarga inteiramente demonstrativos para o
// Planejador de viagens. As origens seguem cadastradas em ./demonstracao.ts
// (todas dentro da capital de SP); aqui ficam destinos fora dela, para que a
// viagem demonstrativa tenha distância e paradas de recarga no caminho.
// Paradas novas são fictícias, posicionadas por fração da linha reta; não
// representam estabelecimentos, rodovias ou coordenadas verificadas de postos.
// Coordenadas de cidade são aproximadas; não representam roteamento real.
export type ParadaDemonstrativa = {
  id: string;
  nome: string;
  powerKw: number;
  // Posição aproximada da parada no trajeto reto origem → destino (0 a 1).
  fracaoRota: number;
};

export type DestinoViagem = {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  latitude: number;
  longitude: number;
  paradas: ParadaDemonstrativa[];
};

export const destinosDemonstrativos: DestinoViagem[] = [
  {
    id: "campos-do-jordao",
    nome: "Campos do Jordão, SP",
    cidade: "Campos do Jordão",
    estado: "SP",
    latitude: -22.7394,
    longitude: -45.5914,
    paradas: [
      { id: "atibaia", nome: "Shell Recharge – Atibaia", powerKw: 150, fracaoRota: 0.35 },
      { id: "braganca", nome: "Eletroposto – Bragança Paulista", powerKw: 100, fracaoRota: 0.65 },
      { id: "sjcampos", nome: "Ponto Flui – São José dos Campos", powerKw: 120, fracaoRota: 0.85 },
    ],
  },
  {
    id: "campinas",
    nome: "Campinas, SP",
    cidade: "Campinas",
    estado: "SP",
    latitude: -22.9099,
    longitude: -47.0626,
    paradas: [
      { id: "jundiai", nome: "Eletroposto – Jundiaí", powerKw: 120, fracaoRota: 0.55 },
    ],
  },
  {
    id: "santos",
    nome: "Santos, SP",
    cidade: "Santos",
    estado: "SP",
    latitude: -23.9608,
    longitude: -46.3339,
    paradas: [
      { id: "sao-bernardo", nome: "Ponto Flui – São Bernardo do Campo", powerKw: 100, fracaoRota: 0.5 },
    ],
  },
  {
    id: "paraty", nome: "Paraty, RJ", cidade: "Paraty", estado: "RJ",
    latitude: -23.22, longitude: -44.72,
    paradas: [
      { id: "paraty-litoral", nome: "Recarga do cenário · Litoral Norte", powerKw: 120, fracaoRota: 0.35 },
      { id: "paraty-costa", nome: "Recarga do cenário · Costa Verde", powerKw: 100, fracaoRota: 0.7 },
    ],
  },
  {
    id: "angra-dos-reis", nome: "Angra dos Reis, RJ", cidade: "Angra dos Reis", estado: "RJ",
    latitude: -23.01, longitude: -44.32,
    paradas: [
      { id: "angra-litoral", nome: "Recarga do cenário · Litoral Norte", powerKw: 120, fracaoRota: 0.35 },
      { id: "angra-costa", nome: "Recarga do cenário · Costa Verde", powerKw: 150, fracaoRota: 0.7 },
    ],
  },
  {
    id: "rio-de-janeiro", nome: "Rio de Janeiro, RJ", cidade: "Rio de Janeiro", estado: "RJ",
    latitude: -22.91, longitude: -43.17,
    paradas: [
      { id: "rio-vale", nome: "Recarga do cenário · Vale do Paraíba", powerKw: 150, fracaoRota: 0.35 },
      { id: "rio-sul", nome: "Recarga do cenário · Sul Fluminense", powerKw: 120, fracaoRota: 0.65 },
      { id: "rio-baixada", nome: "Recarga do cenário · Baixada Fluminense", powerKw: 150, fracaoRota: 0.85 },
    ],
  },
  {
    id: "cabo-frio", nome: "Cabo Frio, RJ", cidade: "Cabo Frio", estado: "RJ",
    latitude: -22.88, longitude: -42.02,
    paradas: [
      { id: "cabo-vale", nome: "Recarga do cenário · Vale do Paraíba", powerKw: 150, fracaoRota: 0.35 },
      { id: "cabo-metropolitana", nome: "Recarga do cenário · Região Metropolitana", powerKw: 150, fracaoRota: 0.65 },
      { id: "cabo-lagos", nome: "Recarga do cenário · Região dos Lagos", powerKw: 120, fracaoRota: 0.85 },
    ],
  },
  {
    id: "buzios", nome: "Búzios, RJ", cidade: "Armação dos Búzios", estado: "RJ",
    latitude: -22.75, longitude: -41.88,
    paradas: [
      { id: "buzios-vale", nome: "Recarga do cenário · Vale do Paraíba", powerKw: 150, fracaoRota: 0.35 },
      { id: "buzios-metropolitana", nome: "Recarga do cenário · Região Metropolitana", powerKw: 150, fracaoRota: 0.65 },
      { id: "buzios-lagos", nome: "Recarga do cenário · Região dos Lagos", powerKw: 120, fracaoRota: 0.85 },
    ],
  },
];

export type DestinoViagemId = (typeof destinosDemonstrativos)[number]["id"];

export function obterDestinoDemonstrativo(id: DestinoViagemId | string) {
  return (
    destinosDemonstrativos.find((destino) => destino.id === id) ??
    destinosDemonstrativos[0]
  );
}
