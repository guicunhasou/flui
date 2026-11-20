import type { Amenity, ChargingStationReview, StationStatus, Weekday } from "../../types";

// Comentários escritos para o cenário NEXT; nomes definidos para a apresentação.
// Não são depoimentos verificados das pessoas nomeadas.
// IDs independentes mantêm avaliações locais e perfis de apresentação separados.
const nomes = ["Camila Duarte", "Rafael Menezes", "Luiza Andrade", "Pedro Nogueira", "Beatriz Tavares", "Diego Azevedo", "Helena Martins", "André Campos", "Juliana Pires", "Felipe Rocha", "Clara Moreira", "Lucas Freitas",
  "Alexandre Barcelos", "André Tritiack", "Anderson Rodrigues", "Antonio Sérgio",
  "Artur Coelho", "Bruna Matos", "Daniel Corrêa", "Gabriel Wulfrick",
  "Heloiza Gabriolli", "Leonardo Romão", "Luís Carlos", "Luiz Gustavo",
  "Marcos Crivelaro", "Mauricio Viana", "Paula Regina", "Rafael Piassa",
  "Raíssa Fregolent", "Thiago Keller", "Thiago Yamamoto", "Victor Atui Filho",
];
const chegadas = [
  "A entrada está bem sinalizada e consegui encontrar as vagas sem dar voltas.",
  "O acesso é simples e o espaço ajuda na hora de posicionar o carro junto ao conector.",
  "Fiz a parada no meio do trajeto e achei a área de recarga fácil de localizar.",
  "Consegui encaixar a recarga na rotina sem precisar fazer um desvio grande.",
  "As vagas são bem demarcadas e a circulação ao redor dos carros é tranquila.",
  "A sinalização na chegada ajudou bastante na minha primeira visita.",
  "É uma opção prática para uma parada planejada antes de continuar a viagem.",
  "Achei o acesso organizado, com espaço para conectar o cabo sem atrapalhar a passagem.",
  "Localização conveniente para quem já está passando pela região.",
  "A área de recarga é fácil de identificar, mesmo chegando pela primeira vez.",
  "Cheguei no começo da tarde e consegui organizar a parada com tranquilidade.",
  "O ponto funciona bem como apoio para dividir um percurso mais longo.",
];

export function criarExperienciaDaEstacao(id: string, local: string, city: string, index: number, status: StationStatus, powerKw: number, amenities: Amenity[]) {
  const maintenance = status === "maintenance";
  const busy = status === "busy";
  const unavailable = status === "unavailable";
  const rating = maintenance ? 3.5 : unavailable ? 3.8 : busy ? 4.1 : [4.6, 4.4, 4.8, 4.3][index % 4];
  const horarios = [
    { text: "24 horas, todos os dias", opensAt: "00:00", closesAt: "24:00", lessBusy: ["06h às 08h", "13h às 15h", "22h às 00h"] },
    { text: "Todos os dias, 06h às 23h", opensAt: "06:00", closesAt: "23:00", lessBusy: ["06h às 08h", "14h às 16h", "21h às 22h"] },
    { text: "Todos os dias, 07h às 22h", opensAt: "07:00", closesAt: "22:00", lessBusy: ["09h às 11h", "14h às 16h", "20h às 21h"] },
  ];
  const horario = horarios[index % horarios.length];
  const apoio = amenities.includes("coffee")
    ? "O café ajuda a aproveitar o tempo de espera sem ficar dentro do carro."
    : amenities.includes("market")
      ? "Aproveitei a pausa para fazer compras no mercado próximo."
      : "O estacionamento facilita organizar uma pausa antes de seguir viagem.";
  const comments = [
    maintenance ? `Já utilizei o ponto de ${local}, mas na visita mais recente encontrei manutenção. Vou confirmar o retorno antes de sair.`
      : unavailable ? `O acesso em ${local} é prático, mas na última visita não consegui iniciar a recarga. Vale verificar antes de ir.`
        : `${chegadas[index % chegadas.length]} Foi uma boa pausa em ${city}.`,
    maintenance ? "A estrutura de apoio é boa, mas a indisponibilidade muda o planejamento. Por enquanto vou usar outro ponto."
      : busy ? `${apoio} Peguei uma fila no fim da tarde e prefiro voltar fora do horário de pico.`
        : unavailable ? `${apoio} Para recarregar, precisei procurar uma alternativa naquele dia.` : apoio,
    maintenance ? "O espaço tem potencial para voltar à minha rota. Falta confirmar a liberação dos carregadores antes de contar com ele."
      : unavailable ? "Prefiro ter um Plano B enquanto o ponto não volta a oferecer recarga. Na próxima visita vou conferir o status."
        : busy ? `O CCS2 de até ${powerKw} kW atende meu carro, mas o movimento pede uma margem de tempo para esperar.`
          : `Usei o CCS2 de até ${powerKw} kW. A potência variou durante a sessão, então deixei uma margem no tempo da parada.`,
  ];
  const autoresArca = id === "next-acesso-next" ? ["Bruno Maia", "Joseffe Barroso", "Wagner Sanchez", "John Paul"] : null;
  if (autoresArca) comments.push("A pausa na Arca foi confortável. Aproveitei a estrutura do local enquanto acompanhava o andamento da recarga.");
  const baseScore = maintenance || unavailable ? 3 : busy ? 4 : Math.round(rating);
  const reviews: ChargingStationReview[] = comments.map((comment, reviewIndex) => ({
    id: `${id}-catalog-review-${reviewIndex + 1}`,
    stationId: id,
    userName: autoresArca?.[reviewIndex] ?? nomes[(index * 3 + reviewIndex + Math.floor(index / 4)) % nomes.length],
    rating: reviewIndex === 1 ? Math.min(5, baseScore + 1) : baseScore,
    quality: maintenance || unavailable ? 3 : Math.min(5, baseScore + 1),
    cleaning: 4 + ((index + reviewIndex) % 2),
    availability: maintenance || unavailable ? 2 : busy ? 3 : 4 + ((index + reviewIndex) % 2),
    amenities: amenities.length >= 5 ? 5 : 4,
    comment,
    wouldReturn: !(maintenance || unavailable) || reviewIndex === 2,
    recommend: !(maintenance || unavailable),
    createdAt: `2026-09-${String(1 + (index * 3 + reviewIndex * 7) % 28).padStart(2, "0")}`,
  }));
  return {
    rating,
    reviewCount: 36 + (index * 17) % 149,
    reviews,
    openingHours: maintenance ? "Indisponível temporariamente" : horario.text,
    openingSchedule: { timeZone: "America/Sao_Paulo", periods: [{ days: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as Weekday[], opensAt: horario.opensAt, closesAt: horario.closesAt }] },
    lessBusyPeriods: maintenance ? [] : [...horario.lessBusy],
  };
}
