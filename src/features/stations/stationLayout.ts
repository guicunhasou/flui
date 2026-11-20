// Reserva espaço também para palavras longas no corpo, não apenas para o título.
export function shouldStackStationCards(contentWidth: number, appFontScale = 1, systemFontScale = 1) {
  return contentWidth / Math.max(1, appFontScale * systemFontScale) < 312;
}
