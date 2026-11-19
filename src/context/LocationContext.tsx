import * as Location from "expo-location";
import { LocationObject } from "expo-location";
import { createContext, useContext, useState } from "react";
import { acquireCurrentLocation, type CurrentLocationResult } from "../utils/currentLocation";

type LocationContextType = {
  location?: LocationObject;
  setLocation: (location: LocationObject) => void;
  getCurrentLocation: () => Promise<CurrentLocationResult>;
};

const LocationContext = createContext<LocationContextType | null>(null);

export function LocationContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [location, setLocation] = useState<LocationObject>();

  async function getCurrentLocation() {
    const result = await acquireCurrentLocation(Location);
    setLocation(result.status === "success" ? result.location : undefined);
    return result;
  }

  return (
    <LocationContext.Provider
      value={{ location, setLocation, getCurrentLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const context = useContext(LocationContext);

  if (!context) {
    throw new Error(
      "useLocationContext deve ser usado dentro de LocationContextProvider.",
    );
  }

  return context;
}
