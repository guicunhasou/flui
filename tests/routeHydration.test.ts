import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import React from "react";
import { RouteHydrationBoundary } from "../src/components/RouteHydrationBoundary";

// Reutiliza o renderer instalado, sem adicionar dependências de tipos ao projeto.
const { renderToString } = createRequire(import.meta.url)("react-dom/server") as {
  renderToString(element: React.ReactElement): string;
};

test("exportação não avalia uma tela cujo parâmetro só existe na URL do navegador", () => {
  function QueryDependentScreen(): never {
    throw new Error("A estação da URL ainda não é conhecida no servidor");
  }
  const html = renderToString(React.createElement(RouteHydrationBoundary, {
    fallback: React.createElement("span", null, "Carregando ponto..."),
    children: React.createElement(QueryDependentScreen),
  }));
  assert.match(html, /Carregando ponto/);
});
