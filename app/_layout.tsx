import { useEffect } from "react";
import { Platform } from "react-native";
import { ConnectivityProvider } from "../src/context/ConnectivityContext";
import { OfflineAssetsProvider } from "../src/offline/OfflineAssetsContext";
import { Stack } from "expo-router";

import {
  PreferencesProvider,
  useAppPreferences,
} from "../src/context/PreferencesContext";

function RootStack() {
  const { theme } = useAppPreferences();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: {
          backgroundColor: theme.background,
        },
      }}
    />
  );
}

export default function Layout() {
  useEffect(() => {
    if (Platform.OS === "web" && !__DEV__ && "serviceWorker" in navigator) {
      // A exportação grava no worker uma versão derivada dos arquivos públicos.
      void navigator.serviceWorker.register("/offline-worker.js", { scope: "/", updateViaCache: "none" }).catch(() => {
        // Sem suporte/permissão de cache, a sessão carregada continua utilizável.
      });
    }
  }, []);
  return (
    <PreferencesProvider>
      <ConnectivityProvider>
        <OfflineAssetsProvider>
          <RootStack />
        </OfflineAssetsProvider>
      </ConnectivityProvider>
    </PreferencesProvider>
  );
}
