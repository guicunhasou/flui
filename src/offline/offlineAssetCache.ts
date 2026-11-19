export type OfflineAsset = { id: string; md5: string; type: "png" | "webp" };
export type OfflineAssetIO = {
  directory: string;
  matches: (uri: string, asset: OfflineAsset) => Promise<boolean>;
  ensureDirectory: () => Promise<void>;
  download: (asset: OfflineAsset) => Promise<string>;
  copy: (from: string, to: string) => Promise<void>;
};

// Release images already live inside the application. Validate those files
// before asking the persistent store: first launch offline must not require
// an earlier online session just to copy an image that is already bundled.
export async function resolveOfflineImage(
  asset: OfflineAsset,
  bundledSource: string | undefined,
  allowNetwork: boolean,
  io: Pick<OfflineAssetIO, "matches"> & { prepare: (asset: OfflineAsset, allowNetwork: boolean) => Promise<string> },
) {
  if (bundledSource?.startsWith("file://")) {
    try {
      if (await io.matches(bundledSource, asset)) return bundledSource;
    } catch {
      // A missing/unreadable bundle file may still have a valid stored copy.
    }
  }
  return io.prepare(asset, allowNetwork);
}

// Only the bundled, allowlisted images enter this store. No private URLs or
// user records are written here; file names are versioned by content hash.
export function createOfflineAssetCache(io: OfflineAssetIO) {
  const pending = new Map<string, Promise<string>>();
  let directoryReady: Promise<void> | undefined;
  const prepare = (asset: OfflineAsset, allowDownload = true): Promise<string> => {
    if (!/^[a-z0-9-]+$/.test(asset.id) || !/^[a-f0-9]{32}$/.test(asset.md5) || !["png", "webp"].includes(asset.type)) {
      return Promise.reject(new Error("Invalid bundled asset descriptor"));
    }
    const file = `${io.directory}${asset.id}-${asset.md5}.${asset.type}`;
    if (!allowDownload) return io.matches(file, asset).then(matches => {
      if (!matches) throw new Error("Asset not prepared for offline use");
      return file;
    });
    const current = pending.get(file);
    if (current) return current;
    const task = (async () => {
      // Persistent local copy is checked before any network operation.
      if (await io.matches(file, asset)) return file;
      directoryReady ??= io.ensureDirectory().catch(error => { directoryReady = undefined; throw error; });
      await directoryReady;
      const downloaded = await io.download(asset);
      if (!downloaded.startsWith("file://")) throw new Error("Asset is not a local file");
      await io.copy(downloaded, file);
      if (!await io.matches(file, asset)) throw new Error("Asset copy failed integrity check");
      return file;
    })();
    pending.set(file, task);
    void task.finally(() => { if (pending.get(file) === task) pending.delete(file); }).catch(() => {});
    return task;
  };
  return { prepare };
}
