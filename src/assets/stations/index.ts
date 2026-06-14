import type { ImageSourcePropType } from "react-native";

export type StationImageKey =
  | "station-01"
  | "station-02"
  | "station-03"
  | "station-04"
  | "station-05"
  | "station-06"
  | "station-07"
  | "station-08"
  | "station-09"
  | "station-10"
  | "station-11"
  | "station-12";

export const stationImages: Record<StationImageKey, ImageSourcePropType> = {
  "station-01": require("./station-01.png"),
  "station-02": require("./station-02.png"),
  "station-03": require("./station-03.png"),
  "station-04": require("./station-04.png"),
  "station-05": require("./station-05.png"),
  "station-06": require("./station-06.png"),
  "station-07": require("./station-07.png"),
  "station-08": require("./station-08.png"),
  "station-09": require("./station-09.png"),
  "station-10": require("./station-10.png"),
  "station-11": require("./station-11.png"),
  "station-12": require("./station-12.png"),
};

export const stationImageKeys = Object.keys(stationImages) as StationImageKey[];

export const getStationImageSource = (
  imageKey?: StationImageKey,
): ImageSourcePropType | undefined => {
  if (!imageKey) {
    return undefined;
  }

  return stationImages[imageKey];
};
