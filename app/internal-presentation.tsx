import { Redirect } from "expo-router";

// Mantém links locais antigos utilizáveis; os controles agora ficam em Configurações.
export default function InternalPresentationRedirect() {
  return <Redirect href="/settings" />;
}
