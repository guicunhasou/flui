import React from "react";
import type { ImageSourcePropType } from "react-native";

// Web keeps its own service worker; native code is selected by Metro.
export function OfflineAssetsProvider({ children }: { children: React.ReactNode }) { return <>{children}</>; }
export function useOfflineImageSource(source: ImageSourcePropType | undefined) { return source; }
