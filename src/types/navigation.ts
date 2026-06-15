export type AppRoute =
  | '/'
  | '/map'
  | '/search'
  | '/point-details'
  | '/filters'
  | '/review'
  | '/profile'
  | '/settings';

export type StationRouteParams = {
  stationId: string;
};
