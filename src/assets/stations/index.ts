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
  "station-01": require("./station-01.webp"),
  "station-02": require("./station-02.webp"),
  "station-03": require("./station-03.webp"),
  "station-04": require("./station-04.webp"),
  "station-05": require("./station-05.webp"),
  "station-06": require("./station-06.webp"),
  "station-07": require("./station-07.webp"),
  "station-08": require("./station-08.webp"),
  "station-09": require("./station-09.webp"),
  "station-10": require("./station-10.webp"),
  "station-11": require("./station-11.webp"),
  "station-12": require("./station-12.webp"),
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
