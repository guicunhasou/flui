export type AppRoute =
  | '/'
  | '/point-details'
  | '/filters'
  | '/review'
  | '/favorites'
  | '/activities';

export type StationRouteParams = {
  stationId: string;
};