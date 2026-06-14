export const stationImageFileNames = {
  "station-01": "station-01.png",
  "station-02": "station-02.png",
  "station-03": "station-03.png",
  "station-04": "station-04.png",
  "station-05": "station-05.png",
  "station-06": "station-06.png",
  "station-07": "station-07.png",
  "station-08": "station-08.png",
  "station-09": "station-09.png",
  "station-10": "station-10.png",
  "station-11": "station-11.png",
  "station-12": "station-12.png",
} as const;

export type StationImageKey = keyof typeof stationImageFileNames;

export const stationImageKeys = Object.keys(
  stationImageFileNames,
) as StationImageKey[];
