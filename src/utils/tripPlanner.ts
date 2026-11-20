import type { DestinoViagem } from "../data/destinosViagem";
import { calcularDistanciaGeograficaKm } from "./demonstracao";
import { avaliarAlcance, type NivelDeAlcance } from "./autonomia";

// Planejador 100% demonstrativo: distâncias em linha reta (haversine) entre
// origem, paradas e destino, sem roteamento real, trânsito ou reserva nos
// pontos. Ver aviso em ../data/identificacaoDados.ts (chave "viagem").

type Coordenada = { latitude: number; longitude: number };

export type ParadaDeViagem = {
  id: string;
  nome: string;
  powerKw: number;
  latitude: number;
  longitude: number;
  distanciaTrechoKm: number;
  tempoTrechoMin: number;
  bateriaChegadaPercent: number;
  bateriaSaidaPercent: number;
};

export type PlanoDeViagem = {
  distanciaTotalKm: number;
  tempoEstimadoMin: number;
  paradas: ParadaDeViagem[];
  bateriaChegadaDestinoPercent: number;
  nivelDeAlcance: NivelDeAlcance;
  trechoFinal: {
    distanciaKm: number;
    tempoMin: number;
    bateriaSaidaPercent: number;
  };
};

const MARGEM_SEGURANCA_PERCENT = 20;
// Mesma reserva mínima usada nas recomendações da FluIA.
export const RESERVA_MINIMA_PARADA_PERCENT = 5;
export const BATERIA_ALVO_PARADA_PERCENT = 80;
export const VELOCIDADE_MEDIA_KMH = 70;

function interpolarCoordenada(
  origem: Coordenada,
  destino: Coordenada,
  fracao: number,
): Coordenada {
  return {
    latitude: origem.latitude + (destino.latitude - origem.latitude) * fracao,
    longitude:
      origem.longitude + (destino.longitude - origem.longitude) * fracao,
  };
}

function calcularTempoMin(distanciaKm: number) {
  return Math.round((distanciaKm / VELOCIDADE_MEDIA_KMH) * 60);
}

export function planejarViagem(
  origem: Coordenada,
  destino: DestinoViagem,
  vehicleRangeKm: number,
  batteryPercent: number,
): PlanoDeViagem {
  const paradasOrdenadas = [...destino.paradas].sort(
    (a, b) => a.fracaoRota - b.fracaoRota,
  );

  let posicaoAtual = origem;
  let bateriaAtual = batteryPercent;
  let distanciaTotalKm = 0;
  let trechoInviavel = false;
  const paradas: ParadaDeViagem[] = [];

  for (const candidata of paradasOrdenadas) {
    const distanciaAoDestinoKm = calcularDistanciaGeograficaKm(
      posicaoAtual,
      destino,
    );
    const avaliacaoDireta = avaliarAlcance(
      distanciaAoDestinoKm,
      vehicleRangeKm,
      bateriaAtual,
    );

    if (avaliacaoDireta.nivel === "tranquilo") {
      break;
    }

    const coordenadaParada = interpolarCoordenada(
      origem,
      destino,
      candidata.fracaoRota,
    );
    const distanciaTrechoKm = calcularDistanciaGeograficaKm(
      posicaoAtual,
      coordenadaParada,
    );
    // Não atribuir recarga em um ponto que o veículo não consegue alcançar.
    // Comparar a bateria sem arredondar para preservar a reserva de 5%.
    const bateriaChegadaExata =
      bateriaAtual - (distanciaTrechoKm / vehicleRangeKm) * 100;
    if (bateriaChegadaExata < RESERVA_MINIMA_PARADA_PERCENT) {
      trechoInviavel = true;
      break;
    }
    const bateriaChegadaPercent = Math.round(bateriaChegadaExata);

    paradas.push({
      id: candidata.id,
      nome: candidata.nome,
      powerKw: candidata.powerKw,
      latitude: coordenadaParada.latitude,
      longitude: coordenadaParada.longitude,
      distanciaTrechoKm: Math.round(distanciaTrechoKm),
      tempoTrechoMin: calcularTempoMin(distanciaTrechoKm),
      bateriaChegadaPercent,
      bateriaSaidaPercent: Math.max(
        bateriaChegadaPercent,
        BATERIA_ALVO_PARADA_PERCENT,
      ),
    });

    distanciaTotalKm += distanciaTrechoKm;
    bateriaAtual = paradas[paradas.length - 1].bateriaSaidaPercent;
    posicaoAtual = coordenadaParada;
  }

  const trechoFinalKm = calcularDistanciaGeograficaKm(posicaoAtual, destino);
  const avaliacaoFinal = avaliarAlcance(
    trechoFinalKm,
    vehicleRangeKm,
    bateriaAtual,
  );

  distanciaTotalKm += trechoFinalKm;

  // Exigir reserva mínima de 5% também na chegada ao destino.
  // Comparar antes do arredondamento da apresentação.
  const bateriaChegadaDestinoExata =
    bateriaAtual - (trechoFinalKm / vehicleRangeKm) * 100;

  const destinoSemReserva =
    !Number.isFinite(bateriaChegadaDestinoExata) ||
    bateriaChegadaDestinoExata < RESERVA_MINIMA_PARADA_PERCENT;

  return {
    distanciaTotalKm: Math.round(distanciaTotalKm),
    // Expõe os valores já calculados; não redefine o trajeto nem a reserva.
    trechoFinal: {
      distanciaKm: Math.round(trechoFinalKm),
      tempoMin: calcularTempoMin(trechoFinalKm),
      bateriaSaidaPercent: bateriaAtual,
    },
    tempoEstimadoMin: calcularTempoMin(distanciaTotalKm),
    paradas,
    bateriaChegadaDestinoPercent:
      trechoInviavel || !Number.isFinite(bateriaChegadaDestinoExata)
        ? 0
        : Math.max(0, Math.floor(bateriaChegadaDestinoExata)),
    nivelDeAlcance:
      trechoInviavel || destinoSemReserva
        ? "foraDeAlcance"
        : avaliacaoFinal.nivel,
  };
}

export function podeIniciarViagem(
  plano: Pick<PlanoDeViagem, "nivelDeAlcance">,
) {
  return plano.nivelDeAlcance !== "foraDeAlcance";
}

export const MARGEM_SEGURANCA_PARADAS_PERCENT = MARGEM_SEGURANCA_PERCENT;


// Mesma descrição no seletor de destino e no resumo, sempre do plano calculado.
export function describeTripStops(plan: PlanoDeViagem) {
  const count = plan.paradas.length;
  if (!podeIniciarViagem(plan)) return count
    ? `Plano inviável · ${count} parada${count === 1 ? "" : "s"} ${count === 1 ? "alcançável" : "alcançáveis"}`
    : "Plano inviável · sem sequência de recargas viável";
  return count ? `${count} parada${count === 1 ? "" : "s"} de recarga necessária${count === 1 ? "" : "s"}` : "Sem paradas de recarga necessárias";
}
