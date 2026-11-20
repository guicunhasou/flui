import TripPlannerScreen from "../src/features/trip/TripPlannerScreen";
import { LoadingOverlay } from "../src/components";
import { RouteHydrationBoundary } from "../src/components/RouteHydrationBoundary";

export default function Route() {
  return (
    <RouteHydrationBoundary fallback={<LoadingOverlay visible message="Carregando planejador..." />}>
      <TripPlannerScreen />
    </RouteHydrationBoundary>
  );
}
