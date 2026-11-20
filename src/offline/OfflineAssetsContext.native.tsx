import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AppState, Image, type ImageSourcePropType, type ImageURISource } from "react-native";
import { requireOptionalNativeModule } from "expo";
import { useConnectivity } from "../context/ConnectivityContext";
import { stationImages } from "../assets/stations";
import { offlineImageMetadata } from "./offlineImageMetadata";
import { createOfflineAssetCache, resolveOfflineImage, type OfflineAsset } from "./offlineAssetCache";

// Both native modules already belong to the installed SDK54 pods. No new module
// or dependency is installed. Methods checked against that SDK's native source.
type FileSystemModule = {
  documentDirectory: string | null;
  getInfoAsync: (uri: string, options: { md5: boolean }) => Promise<{ exists: boolean; isDirectory?: boolean; size?: number; md5?: string }>;
  makeDirectoryAsync: (uri: string, options: { intermediates: boolean }) => Promise<void>;
  copyAsync: (options: { from: string; to: string }) => Promise<void>;
};
type AssetModule = { downloadAsync: (uri: string, md5: string, type: string) => Promise<string> };
const sources: Record<string, ImageSourcePropType> = {
  profile: require("../assets/user/profile1.webp"),
  "profile-alternative": require("../assets/user/profile2.webp"),
  "vehicle-alternative": require("../assets/user/car2.webp"),
  "vehicle-alternative-cutout": require("../assets/user/car2-transparent-v1.png"),
  "vehicle-portrait": require("../assets/user/car1.webp"),
  "vehicle-header": require("../assets/user/car1.png"),
  ...stationImages,
};
const fs = requireOptionalNativeModule<FileSystemModule>("ExponentFileSystem");
const downloader = requireOptionalNativeModule<AssetModule>("ExpoAsset");
const directory = fs?.documentDirectory ? `${fs.documentDirectory}flui-demo-images-v1/` : null;
const matches = async (uri: string, asset: OfflineAsset) => {
  if (!fs) return false;
  const info = await fs.getInfoAsync(uri, { md5: true });
  return info.exists && !info.isDirectory && (info.size ?? 0) > 0 && info.md5 === asset.md5;
};
const cache = fs && downloader && directory ? createOfflineAssetCache({
  directory,
  matches,
  ensureDirectory: () => fs.makeDirectoryAsync(directory, { intermediates: true }),
  download: async asset => {
    const source = Image.resolveAssetSource(sources[asset.id]);
    if (!source?.uri) throw new Error("Bundled image source unavailable");
    return downloader.downloadAsync(source.uri, asset.md5, asset.type);
  },
  copy: (from, to) => fs.copyAsync({ from, to }),
}) : null;

type State = { local: ReadonlyMap<number, ImageURISource>; preparing: boolean; ready: number; supported: boolean; retry: () => void };
const Context = createContext<State>({ local: new Map(), preparing: false, ready: 0, supported: false, retry: () => {} });

export function OfflineAssetsProvider({ children }: { children: React.ReactNode }) {
  const { status } = useConnectivity();
  const [local, setLocal] = useState<ReadonlyMap<number, ImageURISource>>(new Map());
  const [preparing, setPreparing] = useState(false);
  const [retryToken, setRetryToken] = useState(0);
  const retry = useCallback(() => setRetryToken(value => value + 1), []);
  useEffect(() => {
    let active = true;
    if (!cache) return;
    const store = cache;
    setPreparing(true);
    let index = 0;
    const worker = async () => {
      while (index < offlineImageMetadata.length && active) {
        const asset = offlineImageMetadata[index++];
        try {
          const module = sources[asset.id];
          const resolved = Image.resolveAssetSource(module);
          const uri = await resolveOfflineImage(asset, resolved?.uri, status !== "offline", { matches, prepare: store.prepare });
          if (active && typeof module === "number") {
            setLocal(current => new Map(current).set(module, { ...resolved, uri }));
          }
        } catch {
          const module = sources[asset.id];
          if (active && typeof module === "number") setLocal(current => {
            const next = new Map(current);
            next.delete(module);
            return next;
          });
          // Original image remains usable online; retry on reconnect/foreground.
          // Never publish a failed/partial copy as an offline image.
        }
      }
    };
    void Promise.all([worker(), worker(), worker()]).finally(() => { if (active) setPreparing(false); });
    return () => { active = false; };
  }, [status, retryToken]);
  useEffect(() => {
    const listener = AppState.addEventListener("change", state => { if (state === "active") retry(); });
    return () => listener.remove();
  }, [retry]);
  const value = useMemo(() => ({ local, preparing, ready: local.size, supported: !!cache, retry }), [local, preparing, retry]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useOfflineImageSource(source: ImageSourcePropType | undefined) {
  const { local } = useContext(Context);
  return typeof source === "number" ? local.get(source) ?? source : source;
}
export function useOfflinePhotosStatus() { return useContext(Context); }
