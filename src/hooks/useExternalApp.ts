import { useConnectivity } from "../context/ConnectivityContext";
import { useState } from "react";
import { Linking } from "react-native";
import { type RouteProvider } from "../features/stations/stationPresentation";
import { ChargingStation } from "../types";
import { openExternalRoute } from "../utils/externalRoute";

type ExternalMapErrorType = null | string;

type ExternamMapResponseType = {
  error: ExternalMapErrorType;
  isLoading: boolean;
  routeToExternalApp: (provider: RouteProvider) => Promise<void>;
};

export function useExternalMapApp(
  station: ChargingStation,
  origin?: Pick<ChargingStation, "latitude" | "longitude">,
): ExternamMapResponseType {
  const { checkConnection } = useConnectivity();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ExternalMapErrorType>(null);
  const routeToExternalApp = async (provider: RouteProvider) => {
    if (isLoading) return;
    setError(null);
    setIsLoading(true);
    try {
      setError(await openExternalRoute(station, provider, origin, Linking, checkConnection));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    isLoading,
    routeToExternalApp,
  };
}
