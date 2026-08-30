export type AppRoute =
  | "/"
  | "/map"
  | "/loading"
  | "/search"
  | "/point-details"
  | "/filters"
  | "/review"
  | "/profile"
  | "/settings";

export type StationRouteParams = {
  stationId: string;
};
