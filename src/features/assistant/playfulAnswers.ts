// Brincadeiras só por convite explícito e frase inteira. Não interceptam pedidos
// com pouca bateria, incidentes ou prioridades reais, nem alteram estado do app.
const playfulAnswers: [RegExp, string][] = [
  [/^(?:fluia )?(?:me conta|me conte|conta|conte|manda|quero|me diga)? ?(?:uma )?piada$/, "Por que o carro elétrico levou um livro para recarregar? Porque queria uma história com bastante tensão. Prometo que meus cálculos são melhores que minhas piadas."],
  [/^(?:fluia )?(?:uma )?piada de programador$/, "Um bug entrou no eletroposto e pediu uma carga. Recebeu uma exceção: energia não encontrada. Aqui o humor é preparado; o bug, a gente tenta evitar."],
  [/^42$/, "42. Você encontrou meu lado nerd! A resposta para a vida, o universo e tudo mais ainda não substitui conferir a bateria no painel."],
  [/^(?:fluia )?modo turbo$/, "Turbo só no bom humor. Não consigo aumentar a potência do carregador, mas posso comparar as opções de recarga rápida do catálogo."],
  [/^(?:um )?cafe (?:para|pra) (?:a )?fluia$/, "Obrigada, mas eu funciono à base de código. O café fica para você; para mim, uma pergunta bem escrita já dá energia."],
  [/^(?:fluia )?(?:easter eggs?|segredos? da fluia)$/, "Tem um pouco de humor escondido por aqui. Experimente pedir uma piada, oferecer café para a FluIA ou mandar 42. Nenhum desses comandos muda o carro ou os dados do app."],
];
export function answerPlayfulMessage(normalizedMessage: string): string | undefined {
  return playfulAnswers.find(([pattern]) => pattern.test(normalizedMessage))?.[1];
}
