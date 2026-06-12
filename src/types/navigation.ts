export type AppRoute =
  | '/'
  | '/map'
  | '/search'
  | '/point-details'
  | '/filters'
  | '/review'
  | '/favorites'
  | '/activities'
  | '/profile'
  | '/settings';

export type StationRouteParams = {
  stationId: string;
};