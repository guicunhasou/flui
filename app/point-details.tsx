import { LocationContextProvider } from "@/src/context/LocationContext";
import PointDetailsScreen from "../src/features/stations/PointDetailsScreen";
import { LoadingOverlay } from "../src/components";
import { RouteHydrationBoundary } from "../src/components/RouteHydrationBoundary";

export default function PointDetailsRoute() {
  return (
    <LocationContextProvider>
      <RouteHydrationBoundary fallback={<LoadingOverlay visible message="Carregando ponto..." />}>
        <PointDetailsScreen />
      </RouteHydrationBoundary>
    </LocationContextProvider>
  );
}
