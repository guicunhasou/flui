import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";
export default function Html({ children }: PropsWithChildren) {
  return <html lang="pt-BR"><head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" /><title>Flui Lab</title><meta name="description" content="Laboratório experimental do Flui: explore estações de simulação e converse com a FluIA." /><meta name="theme-color" content="#2B0055" /><ScrollViewStyleReset /></head><body>{children}</body></html>;
}
