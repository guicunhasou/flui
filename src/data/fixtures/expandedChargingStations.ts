import type { StationImageKey } from "../../assets/stations";
import { criarExperienciaDaEstacao } from "./expandedStationExperience";
import type { Amenity, ChargingStation, StationStatus } from "../../types";
import { obterOrigemDemonstrativa } from "../demonstracao";
import { calcularDistanciaGeograficaKm } from "../../utils/demonstracao";

// Cenários inteiramente fictícios autorizados para o NEXT. Coordenadas apenas
// distribuem pontos pelo mapa; não localizam estabelecimentos ou rodovias reais.
// Endereços plausíveis criados para a apresentação, não geocodificados/verificados.
// As 12 fotos ilustrativas existentes são reutilizadas; não são fotos desses locais.
// Notas e comentários também pertencem ao cenário; favoritos salvos não mudam.
type LocalDoCenario = [id: string, local: string, cidade: string, estado: "SP" | "RJ", latitude: number, longitude: number];

const locais: LocalDoCenario[] = [
  ["butanta", "Villa-Lobos", "São Paulo", "SP", -23.542, -46.728],
  ["vila-sonia", "Vila Sônia", "São Paulo", "SP", -23.592, -46.737],
  ["pinheiros", "Pinheiros", "São Paulo", "SP", -23.566, -46.696],
  ["alto-pinheiros", "Alto de Pinheiros", "São Paulo", "SP", -23.548, -46.71],
  ["osasco", "Osasco", "Osasco", "SP", -23.532, -46.792],
  ["alphaville", "Alphaville", "Barueri", "SP", -23.497, -46.849],
  ["taboao", "Taboão da Serra", "Taboão da Serra", "SP", -23.613, -46.768],
  ["cotia", "Cotia", "Cotia", "SP", -23.603, -46.919],
  ["carapicuiba", "Carapicuíba", "Carapicuíba", "SP", -23.522, -46.835],
  ["mogi", "Mogi das Cruzes", "Mogi das Cruzes", "SP", -23.523, -46.188],
  ["aruja", "Arujá", "Arujá", "SP", -23.397, -46.32],
  ["guarulhos", "Guarulhos", "Guarulhos", "SP", -23.455, -46.534],
  ["jundiai", "Jundiaí", "Jundiaí", "SP", -23.185, -46.895],
  ["campinas", "Campinas", "Campinas", "SP", -22.908, -47.062],
  ["americana", "Americana", "Americana", "SP", -22.738, -47.333],
  ["limeira", "Limeira", "Limeira", "SP", -22.565, -47.4],
  ["sao-carlos", "São Carlos", "São Carlos", "SP", -22.017, -47.891],
  ["ribeirao", "Ribeirão Preto", "Ribeirão Preto", "SP", -21.177, -47.811],
  ["atibaia", "Atibaia", "Atibaia", "SP", -23.117, -46.553],
  ["braganca", "Bragança Paulista", "Bragança Paulista", "SP", -22.951, -46.541],
  ["jacarei", "Jacareí", "Jacareí", "SP", -23.305, -45.966],
  ["sao-jose-campos", "São José dos Campos", "São José dos Campos", "SP", -23.185, -45.884],
  ["cacapava", "Caçapava", "Caçapava", "SP", -23.101, -45.707],
  ["taubate", "Taubaté", "Taubaté", "SP", -23.026, -45.556],
  ["pinda", "Pindamonhangaba", "Pindamonhangaba", "SP", -22.924, -45.462],
  ["guaratingueta", "Guaratinguetá", "Guaratinguetá", "SP", -22.809, -45.193],
  ["lorena", "Lorena", "Lorena", "SP", -22.732, -45.126],
  ["cruzeiro", "Cruzeiro", "Cruzeiro", "SP", -22.577, -44.962],
  ["queluz", "Queluz", "Queluz", "SP", -22.537, -44.775],
  ["itatiaia", "Itatiaia", "Itatiaia", "RJ", -22.488, -44.566],
  ["resende", "Resende", "Resende", "RJ", -22.469, -44.451],
  ["barra-mansa", "Barra Mansa", "Barra Mansa", "RJ", -22.544, -44.172],
  ["volta-redonda", "Volta Redonda", "Volta Redonda", "RJ", -22.523, -44.104],
  ["pirai", "Piraí", "Piraí", "RJ", -22.629, -43.901],
  ["seropedica", "Seropédica", "Seropédica", "RJ", -22.747, -43.708],
  ["itaguai", "Itaguaí", "Itaguaí", "RJ", -22.863, -43.776],
  ["rio-centro", "Rio Centro", "Rio de Janeiro", "RJ", -22.911, -43.185],
  ["rio-barra", "Barra da Tijuca", "Rio de Janeiro", "RJ", -23.003, -43.365],
  ["santos", "Santos", "Santos", "SP", -23.96, -46.333],
  ["guaruja", "Guarujá", "Guarujá", "SP", -23.993, -46.255],
  ["bertioga", "Bertioga", "Bertioga", "SP", -23.854, -46.139],
  ["sao-sebastiao", "São Sebastião", "São Sebastião", "SP", -23.798, -45.414],
  ["caraguatatuba", "Caraguatatuba", "Caraguatatuba", "SP", -23.622, -45.412],
  ["ubatuba", "Ubatuba", "Ubatuba", "SP", -23.434, -45.074],
  ["paraty", "Paraty", "Paraty", "RJ", -23.218, -44.714],
  ["angra", "Angra dos Reis", "Angra dos Reis", "RJ", -23.006, -44.318],
  ["mangaratiba", "Mangaratiba", "Mangaratiba", "RJ", -22.96, -44.04],
  ["niteroi", "Niterói", "Niterói", "RJ", -22.883, -43.104],
  ["marica", "Maricá", "Maricá", "RJ", -22.919, -42.819],
  ["saquarema", "Saquarema", "Saquarema", "RJ", -22.932, -42.51],
  ["araruama", "Araruama", "Araruama", "RJ", -22.873, -42.343],
  ["cabo-frio", "Cabo Frio", "Cabo Frio", "RJ", -22.879, -42.019],
  ["arraial", "Arraial do Cabo", "Arraial do Cabo", "RJ", -22.969, -42.027],
  ["buzios", "Búzios", "Armação dos Búzios", "RJ", -22.752, -41.887],
  ["moema", "Moema", "São Paulo", "SP", -23.602, -46.664],
  ["vila-olimpia", "Vila Olímpia", "São Paulo", "SP", -23.595, -46.683],
  ["santo-amaro", "Santo Amaro", "São Paulo", "SP", -23.651, -46.708],
  ["copacabana", "Copacabana", "Rio de Janeiro", "RJ", -22.972, -43.186],
  ["tijuca", "Tijuca", "Rio de Janeiro", "RJ", -22.924, -43.233],
  ["petropolis", "Petrópolis", "Petrópolis", "RJ", -22.505, -43.179],
  ["acesso-next", "Arca", "São Paulo", "SP", -23.5416, -46.7330],
  ["vila-lageado", "Vila Lageado", "São Paulo", "SP", -23.5338, -46.7389],
  ["campus-oeste", "Campus Oeste", "São Paulo", "SP", -23.5481, -46.7318],
  ["jaguare", "Leopoldina", "São Paulo", "SP", -23.5358, -46.7281],
  ["corifeu", "Corifeu", "São Paulo", "SP", -23.5521, -46.7410],
  ["rio-pequeno", "Rio Pequeno", "São Paulo", "SP", -23.5488, -46.7511],
  ["politecnica", "Politécnica", "São Paulo", "SP", -23.5271, -46.7461],
  ["vila-universitaria", "Vila Universitária", "São Paulo", "SP", -23.5421, -46.7485],
];

const origem = obterOrigemDemonstrativa("fiap");
const ruasDoCenario = ["Avenida das Palmeiras", "Rua dos Ipês", "Avenida Central", "Rua das Acácias", "Alameda dos Jacarandás", "Rua do Bosque", "Avenida do Lago", "Rua das Paineiras", "Avenida do Sol", "Rua Bela Vista", "Avenida dos Pinhais", "Rua do Comércio"];
const numerosDoCenario = [220, 145, 680, 315, 90, 470, 1250, 835, 540, 260, 720, 180];

export const expandedChargingStations: ChargingStation[] = locais.map(
  ([slug, local, city, state, latitude, longitude], index) => {
    const id = `next-${slug}`;
    const status: StationStatus = index % 13 === 12 ? "maintenance"
      : index % 11 === 10 ? "unavailable" : index % 7 === 6 ? "busy" : "available";
    const powerKw = [150, 60, 120, 50][index % 4];
    const isAvailable = status === "available";
    const amenities: Amenity[] = index % 3 === 0 ? ["parking", "coffee", "restroom", "wifi", "coveredArea", "security"]
      : index % 3 === 1 ? ["coffee", "restroom", "parking", "restaurant"] : ["market", "restroom", "parking", "coveredArea"];
    const experience = criarExperienciaDaEstacao(id, local, city, index, status, powerKw, amenities);
    return {
      id, name: `Flui ${local}`, city, state, latitude, longitude,
      address: `${ruasDoCenario[index % ruasDoCenario.length]}, ${numerosDoCenario[index % numerosDoCenario.length] + Math.floor(index / 12) * 100}`, neighborhood: local,
      imageKey: `station-${String(index % 12 + 1).padStart(2, "0")}` as StationImageKey,
      distanceKm: calcularDistanciaGeograficaKm(origem, { latitude, longitude }),
      ...experience,
      isFavorite: false,
      status, powerKw,
      connectors: [
        { id: `${id}-ccs2`, type: "ccs2", label: "CCS2", powerKw, totalChargers: 4, availableChargers: isAvailable ? 2 : 0 },
        { id: `${id}-type2`, type: "type2", label: "Type 2", powerKw: 22, totalChargers: 2, availableChargers: isAvailable ? 1 : 0 },
      ],
      amenities,
    };
  },
);
