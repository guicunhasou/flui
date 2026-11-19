import SearchFiltersScreen from "../src/features/search/SearchFiltersScreen";
import { LoadingOverlay } from "../src/components";
import { RouteHydrationBoundary } from "../src/components/RouteHydrationBoundary";

export default function Route() {
  return (
    <RouteHydrationBoundary fallback={<LoadingOverlay visible message="Carregando busca..." />}>
      <SearchFiltersScreen />
    </RouteHydrationBoundary>
  );
}
