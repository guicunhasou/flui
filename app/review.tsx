import ReviewScreen from '../src/features/reviews/ReviewScreen';
import { LoadingOverlay } from '../src/components';
import { RouteHydrationBoundary } from '../src/components/RouteHydrationBoundary';

export default function ReviewRoute() {
  return (
    <RouteHydrationBoundary fallback={<LoadingOverlay visible message="Carregando avaliação..." />}>
      <ReviewScreen />
    </RouteHydrationBoundary>
  );
}
