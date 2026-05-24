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
  return (
    <PreferencesProvider>
      <RootStack />
    </PreferencesProvider>
  );
}