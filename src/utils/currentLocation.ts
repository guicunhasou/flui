import type { LocationObject } from "expo-location";

export type CurrentLocationResult =
  | { status: "success"; location: LocationObject }
  | { status: "permission-denied" | "unavailable" };

type LocationSource = {
  requestForegroundPermissionsAsync: () => Promise<{ status: string }>;
  getCurrentPositionAsync: (options: object) => Promise<LocationObject>;
};

// O limite só começa após a decisão de permissão do usuário.
export async function acquireCurrentLocation(
  source: LocationSource,
  timeoutMs = 15000,
): Promise<CurrentLocationResult> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    const { status } = await source.requestForegroundPermissionsAsync();
    if (status !== "granted") return { status: "permission-denied" };

    return await Promise.race([
      source.getCurrentPositionAsync({}).then((location): CurrentLocationResult => {
        const { latitude, longitude } = location.coords;
        return Number.isFinite(latitude) && Number.isFinite(longitude)
          && Math.abs(latitude) <= 90 && Math.abs(longitude) <= 180
          ? { status: "success", location }
          : { status: "unavailable" };
      }),
      new Promise<CurrentLocationResult>((resolve) => {
        timeout = setTimeout(() => resolve({ status: "unavailable" }), timeoutMs);
      }),
    ]);
  } catch {
    return { status: "unavailable" };
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
