import HomeMapScreen from "../src/features/map/HomeMapScreen";
import { LoadingOverlay } from "../src/components";
import { RouteHydrationBoundary } from "../src/components/RouteHydrationBoundary";

export default function Route() {
  return (
    <RouteHydrationBoundary fallback={<LoadingOverlay visible message="Carregando mapa..." />}>
      <HomeMapScreen />
    </RouteHydrationBoundary>
  );
}
