import { ChargingStation, StationFilters } from "../types";
import { isStationOpenAt } from "./stationHours";

type FiltrarEstacoesParams = {
  estacoes: ChargingStation[];
  filtros: StationFilters;
  termoBusca?: string;
  agora?: Date;
};

function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function obterConectores(estacao: ChargingStation) {
  return estacao.connectors
    .map((connector) =>
      normalizarTexto(`${connector.type} ${connector.label}`),
    )
    .filter(Boolean);
}

function obterTextoBuscavel(estacao: ChargingStation) {
  return normalizarTexto(
    [
      estacao.name,
      estacao.address,
      estacao.neighborhood,
      estacao.city,
      estacao.state,
      `${estacao.powerKw} kW`,
      estacao.openingHours,
      estacao.lessBusyPeriods.join(" "),
      estacao.connectors
        .map((connector) => `${connector.type} ${connector.label}`)
        .join(" "),
      estacao.amenities.join(" "),
    ].join(" "),
  );
}

export function pontoEstaAbertoAgora(
  estacao: ChargingStation,
  agora = new Date(),
) {
  if (estacao.status === "unavailable" || estacao.status === "maintenance") {
    return false;
  }

  if (estacao.openingSchedule) return isStationOpenAt(estacao, agora);

  const horarioNormalizado = normalizarTexto(estacao.openingHours);

  if (horarioNormalizado.includes("indisponivel")) {
    return false;
  }

  if (horarioNormalizado.includes("24 hora")) {
    return true;
  }

  const diaDaSemana = agora.getDay();
  const funcionaDeSegundaASabado = horarioNormalizado.includes(
    "segunda a sabado",
  );

  if (funcionaDeSegundaASabado && diaDaSemana === 0) {
    return false;
  }

  const intervalo = horarioNormalizado.match(
    /(\d{1,2})h\s*(?:as|a)\s*(\d{1,2})h/,
  );

  if (!intervalo) {
    return false;
  }

  const minutosAtuais = agora.getHours() * 60 + agora.getMinutes();
  const minutosAbertura = Number(intervalo[1]) * 60;
  const minutosFechamento = Number(intervalo[2]) * 60;

  return (
    minutosAtuais >= minutosAbertura &&
    minutosAtuais < minutosFechamento
  );
}

function pontoFunciona24Horas(estacao: ChargingStation) {
  return normalizarTexto(estacao.openingHours).includes("24 hora");
}

function atendeBusca(estacao: ChargingStation, termoBusca?: string) {
  const termoNormalizado = normalizarTexto(termoBusca ?? "");

  if (!termoNormalizado) {
    return true;
  }

  return obterTextoBuscavel(estacao).includes(termoNormalizado);
}

function atendeConectores(estacao: ChargingStation, filtros: StationFilters) {
  if (filtros.connectorTypes.length === 0) {
    return true;
  }

  const conectores = obterConectores(estacao);

  return filtros.connectorTypes.some((tipoConector) =>
    conectores.some((conector) =>
      conector.includes(normalizarTexto(tipoConector)),
    ),
  );
}

function atendeStatus(estacao: ChargingStation, filtros: StationFilters) {
  if (filtros.statuses.length === 0) {
    return true;
  }

  return filtros.statuses.includes(estacao.status);
}

function atendeComodidades(estacao: ChargingStation, filtros: StationFilters) {
  if (filtros.amenities.length === 0) {
    return true;
  }

  return filtros.amenities.every((comodidade) =>
    estacao.amenities.includes(comodidade),
  );
}

export function pontoTemRecargaDisponivel(
  estacao: ChargingStation,
  agora = new Date(),
  tipos: StationFilters["connectorTypes"] = [],
) {
  return estacao.status === "available" && pontoEstaAbertoAgora(estacao, agora)
    && estacao.connectors.some((connector) =>
      connector.availableChargers > 0 && (!tipos.length || tipos.includes(connector.type)),
    );
}

function atendeFuncionamento24h(estacao: ChargingStation, filtros: StationFilters) {
  if (!filtros.onlyOpen24h) {
    return true;
  }

  return pontoFunciona24Horas(estacao);
}

export function filtrarEstacoes({
  estacoes,
  filtros,
  termoBusca = "",
  agora = new Date(),
}: FiltrarEstacoesParams) {
  return estacoes.filter((estacao) => {
    const atendePotencia = estacao.powerKw >= filtros.power.minKw;
    const atendeDistancia = estacao.distanceKm <= filtros.distance.maxKm;
    const atendeAvaliacao = estacao.rating >= filtros.rating.minRating;

    return (
      atendeBusca(estacao, termoBusca) &&
      atendeConectores(estacao, filtros) &&
      atendeStatus(estacao, filtros) &&
      atendeComodidades(estacao, filtros) &&
      (!filtros.onlyOpenNow || pontoEstaAbertoAgora(estacao, agora)) &&
      (!filtros.onlyAvailableChargers || pontoTemRecargaDisponivel(estacao, agora, filtros.connectorTypes)) &&
      atendeFuncionamento24h(estacao, filtros) &&
      atendePotencia &&
      atendeDistancia &&
      atendeAvaliacao
    );
  });
}
