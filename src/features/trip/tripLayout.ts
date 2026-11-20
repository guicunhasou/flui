import { spacing } from "../../theme/spacing";

// Considera tanto a preferência de fonte do Flui quanto a ampliação do sistema.
export function getTripReadingLayout(width: number, appFontScale = 1, systemFontScale = 1) {
  const readingWidth = width / Math.max(1, appFontScale * systemFontScale);
  return { stacked: readingWidth < 430 };
}

// Usa a largura do próprio resumo, descontando padding e os dois separadores.
// Reserva 100 pontos de leitura por indicador; o texto pode ocupar várias linhas.
export function shouldStackTripStats(containerWidth: number, appFontScale = 1, systemFontScale = 1) {
  const availableWidth = Math.max(0, containerWidth - 2 * spacing.md - 2);
  const scale = Math.max(1, appFontScale * systemFontScale);
  return availableWidth / scale < 3 * 100;
}
