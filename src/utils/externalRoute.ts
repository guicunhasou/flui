import { externalActionBlock, type ConnectionStatus } from "./connectivity";
import { getStationRouteUrl, type RouteProvider } from "../features/stations/stationPresentation";
import type { ChargingStation } from "../types";

type Coordinates = Pick<ChargingStation, "latitude" | "longitude">;
type ExternalLinking = {
  canOpenURL: (url: string) => Promise<boolean>;
  openURL: (url: string) => Promise<unknown>;
};

// Compartilhado pelo botão da ficha e pelo atalho da FluIA; bloqueia antes do GPS.
export async function prepareExternalRoute(
  checkConnection: () => Promise<ConnectionStatus>,
  onReady: () => void,
): Promise<string | null> {
  let status: ConnectionStatus;
  try {
    status = await checkConnection();
  } catch {
    status = "unknown";
  }
  const blocked = externalActionBlock(status);
  if (!blocked) onReady();
  return blocked;
}

export async function openExternalRoute(
  station: Coordinates,
  provider: RouteProvider,
  origin: Coordinates | undefined,
  linking: ExternalLinking,
  checkConnection?: () => Promise<ConnectionStatus>,
): Promise<string | null> {
  if (!Number.isFinite(station.latitude) || !Number.isFinite(station.longitude)) {
    return "Este ponto ainda não possui coordenadas cadastradas.";
  }

  try {
    if (checkConnection) {
      const blocked = externalActionBlock(await checkConnection());
      if (blocked) return blocked;
    }
    const url = getStationRouteUrl(station, provider, origin);
    if (!(await linking.canOpenURL(url))) {
      return "Seu dispositivo não conseguiu abrir o aplicativo de mapas. Tente novamente ou escolha outro aplicativo.";
    }
    await linking.openURL(url);
    return null;
  } catch {
    return "Não foi possível abrir a rota agora. Tente novamente ou escolha outro aplicativo.";
  }
}
