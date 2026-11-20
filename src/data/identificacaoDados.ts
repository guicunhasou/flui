// Classificação do conjunto atual, sem atribuir origem real a dados não verificados.
// Bateria mantém sua classificação própria: demo/manual/unknown em batteryData.ts.
// Veículo, autonomia e origem continuam configurados pela infraestrutura da Alfa 1.3.
export const identificacaoDados = {
  catalogo: {
    origem: "demonstrativa",
    resumo: "Catálogo de simulação: estações, status, notas e imagens sem verificação em campo ou atualização em tempo real. Podem estar desatualizados.",
    aviso: "Catálogo demonstrativo: estações, horários, disponibilidade, notas e imagens não verificados em campo. Dados desta versão, sem atualização pela conexão; podem estar desatualizados.",
  },
  estimativas: {
    origem: "estimada",
    aviso: "Distância em linha reta, autonomia e tempo de carga são estimativas simplificadas, sem telemetria ou cálculo de percurso.",
  },
  avaliacoesExemplo: {
    origem: "demonstrativa",
    rotulo: "Avaliação demonstrativa",
    aviso: "Notas, totais, distribuição e comentários do catálogo são exemplos. Sua avaliação local não altera esses números.",
  },
  avaliacoesLocais: {
    origem: "manual",
    rotulo: "Sua avaliação · salva neste dispositivo",
    aviso: "Avaliações salvas somente neste dispositivo, sem envio ou publicação para outros motoristas.",
  },
  perfil: {
    origem: "demonstrativa",
    rotulo: "Perfil demonstrativo · nome e foto ilustrativos",
  },
  fluia: {
    origem: "estimada",
    aviso: "FluIA experimental · sugestões locais com dados demonstrativos, sem IA generativa ou disponibilidade em tempo real.",
  },
  viagem: {
    origem: "estimada",
    aviso: "Planejador demonstrativo: trajeto, paradas de recarga, tempos e bateria estimada em linha reta, sem cálculo de rota real, trânsito ou reserva nos pontos.",
  },
} as const;
