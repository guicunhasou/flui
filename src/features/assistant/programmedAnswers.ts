export type ProgrammedAnswer = {
  keywords: string[];
  answer: string;
  pattern?: RegExp;
  // Pedidos de uma ação inexistente não devem virar sugestões de estações.
  takesPrecedence?: boolean;
};

// Palavras-chave ja sem acento e em minúsculas,
// porque o chatEngine normaliza a mensagem antes de comparar.
export const programmedAnswers: ProgrammedAnswer[] = [
  {
    keywords: ["kw", "quilowatt", "quilowatts"],
    answer:
      "kW (quilowatt) indica a potência de recarga. Um número maior pode permitir uma carga mais rápida, mas o carro também limita a potência que consegue receber.",
  },
  {
    keywords: ["autonomia"],
    answer:
      "Autonomia é a distância estimada que você pode percorrer com a carga atual. No Flui, ela usa a bateria e a autonomia com carga cheia informadas no app. A chegada considera a distância em linha reta; esses valores não são lidos do carro.",
  },
  {
    keywords: ["quanto tempo", "demora", "demorar", "demorado", "demorada"],
    answer:
      "O tempo de recarga depende do carro, da potência disponível e de quanto você quer carregar. A velocidade costuma diminuir perto da carga cheia. Sem esses dados, não consigo informar um tempo confiável.",
  },
  {
    keywords: ["kwh", "quilowatt hora"],
    answer: "kWh é uma medida de energia; kW é uma medida de potência. A energia necessária para completar a carga e a potência que o carro aceita influenciam o tempo de recarga. O Flui não lê a capacidade nem o consumo real do seu veículo.",
  },
  {
    keywords: [], pattern: /\b(?:preco|precos|custa|custar|valor da recarga|tarifa|tarifas|gratuito|gratis|mais barat[oa])\b/, takesPrecedence: true,
    answer: "Não tenho tarifas verificadas para comparar preços ou confirmar gratuidade. Confira o valor, as formas de pagamento e possíveis taxas com o operador antes de iniciar a recarga. O Flui não realiza cobranças.",
  },
  {
    keywords: [], pattern: /\b(?:reservar|reserve|agendar|agende|fazer uma reserva|reserva de (?:vaga|carregador|recarga))\b/, takesPrecedence: true,
    answer: "Posso sugerir uma estação, mas não reservar ou agendar um carregador. A sugestão e o Plano B não garantem vaga. Você pode abrir a ficha para comparar as opções e confirmar o funcionamento com o operador.",
  },
  {
    keywords: [], pattern: /\b(?:pagamento|pagar|pago|pix|cartao de credito|cartao de debito)\b/, takesPrecedence: true,
    answer: "O Flui não processa pagamentos nem inicia a recarga no equipamento. Confirme com o operador como pagar e usar o carregador; não envie dados de cartão por aqui.",
  },
  {
    keywords: [], pattern: /\b(?:compativel|compatibilidade|conectores?|ccs ?2|type ?2|tipo ?2|chademo|gbt)\b/,
    answer: "A ficha mostra os conectores cadastrados em cada estação. Compare o padrão com a entrada e as especificações do seu carro. O nome do veículo no Flui não confirma compatibilidade elétrica; eu não consigo garanti-la nesta consulta.",
  },
  {
    keywords: [], pattern: /\b(?:reserva(?: minima| de bateria)?|margem de seguranca|5 (?:por cento|percent)|cinco por cento)\b/,
    answer: "O Flui exige uma reserva mínima de 5% na chegada estimada. A verificação usa o valor exato antes de arredondar a apresentação. É uma regra da simulação em linha reta, sem considerar trânsito, relevo ou consumo real; mantenha uma margem adequada à viagem.",
  },
  {
    keywords: [], pattern: /\b(?:favorit[oa]s?|favoritar|salvar (?:um |uma |o |a )?(?:posto|ponto|estacao))\b/,
    answer: "Abra a ficha da estação e toque no coração para adicionar ou retirar dos favoritos. Você encontra a lista no Perfil. Os favoritos são salvos neste dispositivo; não há sincronização com uma conta online.",
  },
  {
    keywords: [], pattern: /\b(?:avaliacoes?|avaliar|comentarios?|comentar|nota da estacao)\b/,
    answer: "Na ficha, a seção Avaliações reúne os comentários do catálogo e a sua avaliação local. Você pode informar nota e comentário; isso fica salvo neste dispositivo e não é publicado. A nota agregada do catálogo não é recalculada pela sua avaliação.",
  },
  {
    keywords: [], pattern: /\b(?:offline|sem (?:internet|conexao)|nao (?:tenho|ha) (?:internet|conexao)|modo aviao)\b/,
    answer: "Favoritos, avaliações e preferências ficam salvos no dispositivo. Para as fotos, confira o indicador de preparação em Configurações. Abrir o app do zero sem rede depende da versão instalada; a instalação de desenvolvimento ainda depende do Metro. A área de mapa disponível sem rede não é garantida.",
  },
  {
    keywords: [], pattern: /\b(?:mudar (?:a |sua )?voz|trocar (?:a |sua )?voz|escolher (?:a |uma )?voz|voz da fluia)\b/,
    answer: "Uso a voz padrão do dispositivo em português. Você pode ligar ou desligar a leitura pelo botão de som no topo da conversa e interromper uma resposta pelo botão de parar. Nesta versão não há seleção de outra voz nem serviço de voz do Google Cloud integrado.",
  },
  {
    keywords: [], pattern: /\b(?:voce (?:me )?ouve|voce (?:me )?escuta|microfone|reconhecimento de (?:voz|fala)|comando de voz|falar com voce)\b/, takesPrecedence: true,
    answer: "Nesta versão eu leio respostas em voz alta, mas ainda não capturo a sua fala. Digite a pergunta ou use uma opção pronta. Você pode parar a leitura pelo botão de parar; o estado Ouvindo no teste da Orb é apenas uma demonstração visual.",
  },
  {
    keywords: [], pattern: /\b(?:quem e voce|o que voce (?:faz|sabe)|como voce funciona|ia generativa|inteligencia artificial|chatgpt)\b/,
    answer: "Sou a FluIA, a assistente do Flui. Comparo as estações recebidas nesta consulta com regras locais e uso respostas preparadas para explicar o app e a recarga. Não sou uma IA generativa e não consulto disponibilidade em tempo real.",
  },
  {
    keywords: [], pattern: /\b(?:gps|localizacao real|minha localizacao|onde estou|localizacao inicial|origem da (?:viagem|apresentacao|simulacao))\b/,
    answer: "As comparações desta consulta usam a localização inicial escolhida nas Configurações. Não recebo a sua posição GPS aqui. Troque a localização inicial e envie uma nova pergunta para comparar as estações a partir dela.",
  },
  {
    keywords: [], pattern: /\b(?:plano b|outra alternativa|alternativa de recarga)\b/,
    answer: "Quando existe outra estação viável para a mesma prioridade, mostro um Plano B. Ele passa pelas mesmas regras de alcance, funcionamento e carregadores utilizáveis do catálogo. Se não aparecer, não encontrei uma segunda opção; isso não confirma a situação real dos postos.",
  },
  {
    keywords: [], pattern: /\b(?:planejador|planejar viagem|paradas da viagem|quantas paradas|trajeto|percurso)\b/,
    answer: "No planejador, escolha o destino para ver as recargas calculadas, a ordem e as estações de parada. O resultado usa a bateria e a autonomia configuradas, com reserva mínima de 5%. Os trechos são em linha reta, sem roteamento por ruas; eu não inicio essa viagem pela conversa.",
  },
  {
    keywords: [], pattern: /\b(?:filtros?|filtrar)\b/,
    answer: "Use os filtros do mapa para refinar as estações por conector, potência, funcionamento e comodidades. Recolher os filtros rápidos preserva as escolhas. Ao mudar os valores ou a seleção de estações, envie uma nova pergunta: a resposta anterior mantém o contexto em que foi criada.",
  },
  {
    keywords: [], pattern: /\b(?:tempo real|dados reais|(?:postos|estacoes) (?:sao )?reais|dados simulados|demonstrativ[oa]s?|simulacao)\b/,
    answer: "O catálogo desta apresentação é simulado: estações, disponibilidade, imagens e notas não confirmam estabelecimentos ou condições reais. Uso esses dados para demonstrar a comparação e o planejamento. Confirme funcionamento e compatibilidade antes de uma viagem real.",
  },
  {
    keywords: [], pattern: /\b(?:recarregar ate 100|carregar ate 100|carga cheia|80 (?:por cento|percent)|oitenta por cento)\b/,
    answer: "No planejador do Flui, as paradas usam 80% como alvo de saída quando é necessário recarregar. É um parâmetro do cenário, não uma recomendação específica para a bateria do seu carro. O tempo e os limites reais devem ser conferidos no veículo e com o operador.",
  },
  {
    keywords: [], pattern: /\b(?:alterar|ajustar|mudar|informar|definir) (?:a |o )?(?:minha |meu )?(?:bateria|carga)\b/,
    answer: "Toque no carro com a porcentagem, no topo do mapa. Arraste o controle de bateria ou use os botões de menos e mais para ajustar com precisão; depois toque em Definir carga. Uma mensagem na conversa não altera esse valor.",
  },
  {
    keywords: [], pattern: /\b(?:o que e|como funciona|explique) (?:a )?(?:recarga rapida|carregamento rapido|recarga lenta)\b/,
    answer: "No Flui, a opção Recarga rápida prioriza a potência entre as estações viáveis para a consulta. O valor em kW é o máximo cadastrado, não uma velocidade garantida: o carro e as condições de recarga também limitam a potência. A sugestão não confirma um tempo real de carga.",
  },
  {
    keywords: [], pattern: /^(?:(?:oi|ola)(?: fluia)?|bom dia|boa tarde|boa noite)$/,
    answer: "Olá! Posso ajudar a escolher uma recarga ou explicar o Flui. Você quer preservar bateria, carregar rápido, esperar menos ou encontrar uma parada com café e banheiro?",
  },
  {
    keywords: [], pattern: /^(?:obrigad[oa](?: fluia)?|valeu|muito obrigad[oa])$/,
    answer: "Por nada! Se mudar a bateria, a localização inicial ou as estações da consulta, envie uma nova pergunta para eu comparar de novo.",
  },
];

export function matchesProgrammedAnswer(item: ProgrammedAnswer, message: string) {
  return item.pattern?.test(message) || item.keywords.some(keyword => new RegExp(`\\b${keyword}\\b`).test(message));
}
