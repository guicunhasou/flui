import type { ChargingStation, ConnectorType } from "../types";
import { isStationOpenAt } from "./stationHours";

export function getUsableConnectors(
  station: ChargingStation,
  vehicleConnectorTypes?: ConnectorType[],
) {
  return station.connectors.filter(
    (connector) =>
      (!vehicleConnectorTypes?.length ||
        vehicleConnectorTypes.includes(connector.type)) &&
      Number.isFinite(connector.powerKw) &&
      connector.powerKw > 0 &&
      Number.isInteger(connector.availableChargers) &&
      connector.availableChargers > 0 &&
      Number.isInteger(connector.totalChargers) &&
      connector.totalChargers >= connector.availableChargers,
  );
}

export function canChargeAt(
  station: ChargingStation,
  now = new Date(),
  vehicleConnectorTypes?: ConnectorType[],
) {
  return (
    station.status === "available" &&
    isStationOpenAt(station, now) &&
    getUsableConnectors(station, vehicleConnectorTypes).length > 0
  );
}
