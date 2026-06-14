import { ChargingStation, StationFilters } from "../types";

type FiltrarEstacoesParams = {
  estacoes: ChargingStation[];
  filtros: StationFilters;
  termoBusca?: string;
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

function pontoTemCarregadorLivre(estacao: ChargingStation) {
  return estacao.connectors.some(
    (connector) => connector.availableChargers > 0,
  );
}

function pontoEstaAbertoAgora(estacao: ChargingStation) {
  return estacao.status === "available" || estacao.status === "busy";
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

function atendeDisponibilidade(estacao: ChargingStation, filtros: StationFilters) {
  if (!filtros.onlyOpenNow) {
    return true;
  }

  return pontoEstaAbertoAgora(estacao) && pontoTemCarregadorLivre(estacao);
}

export function filtrarEstacoes({
  estacoes,
  filtros,
  termoBusca = "",
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
      atendeDisponibilidade(estacao, filtros) &&
      atendePotencia &&
      atendeDistancia &&
      atendeAvaliacao
    );
  });
}
