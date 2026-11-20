import { type ReactNode, useSyncExternalStore } from "react";

const subscribe = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

// A exportação estática não conhece os parâmetros de busca da URL.
// Servidor e primeiro render de hidratação mostram o mesmo fallback;
// navegação cliente e React Native renderizam os filhos imediatamente.
export function RouteHydrationBoundary({
  children,
  fallback,
}: {
  children: ReactNode;
  fallback: ReactNode;
}) {
  const ready = useSyncExternalStore(subscribe, clientReady, serverReady);
  return ready ? children : fallback;
}
