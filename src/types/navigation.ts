export type AppRoute =
  | "/"
  | "/map"
  | "/loading"
  | "/search"
  | "/point-details"
  | "/filters"
  | "/review"
  | "/profile"
  | "/settings"
  | "/trip-planner";

export type StationRouteParams = {
  stationId: string;
};
