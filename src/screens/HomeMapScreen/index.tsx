import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  type Region,
} from "react-native-maps";
import Svg, { Circle, G, Path, SvgXml } from "react-native-svg";
import { router, type Href, useLocalSearchParams } from "expo-router";
import {
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  BatteryWarning,
  ChevronRight,
  Clock3,
  Coffee,
  Crosshair,
  Maximize2,
  Navigation,
  Plug,
  Search,
  SlidersHorizontal,
  Star,
  Toilet,
  Zap,
} from "lucide-react-native";

import { chargingStations } from "../../data";
import { defaultFilters } from "../../data/filterOptions";
import { StationFilters } from "../../types";
import { filtrarEstacoes } from "../../utils/filtrarEstacoes";
import { avaliarAlcance } from "../../utils/autonomia";
import {
  LoadingOverlay,
  PressableScale,
  ScreenTransition,
} from "../../components";
import baseStyles, { colors as baseColors } from "./styles";
import { useTelaComPreferencias } from "../../hooks/useTelaComPreferencias";
import { useAppPreferences } from "../../context/PreferencesContext";

const FEEDBACK_DURATION = 1500;
const SHEET_VISIBLE_HANDLE = 30;
const SHEET_OCULTO_MARGEM_EXTRA = 40;
const QUICK_FILTERS_CONTENT_HEIGHT = 56;
const HANDLE_HINT_DISTANCE = 4;

const chevronControleBaixoXml = `<svg width="28" height="12" viewBox="0 0 28 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4.25L14 8.25L22 4.25" stroke="#BECAC5" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const chevronControleCimaXml = `<svg width="28" height="12" viewBox="0 0 28 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 7.75L14 3.75L22 7.75" stroke="#BECAC5" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const logoFluiXml = `
<svg width="1115" height="516" viewBox="0 0 1115 516" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M706 14L702 11L694 9L660 6L659 5H649L648 4H637L636 3L606 2L605 1H582L581 0H524L523 1H505L504 2H491L490 3L464 5L428 11L407 16L372 27L367 30L355 34L308 58L269 84L212 128L181 148L155 161L120 174L92 181L55 187L19 188L17 189L14 193V202L12 209L11 222L2 268L0 273V278L3 281H67L69 283L55 309L49 324L43 345L40 362V395L42 407L49 430L62 454L69 463L86 480L106 494L124 503L138 508L171 515L200 516L201 515H212L231 512L265 501L281 493L295 484L305 476L324 457L336 441L348 419L357 393L361 368L360 336L356 317L350 300L342 285V282L343 281H410L412 280L415 276L426 236L428 233L430 224L440 197V192L435 188H305L304 187L305 184L314 173L337 151L367 131L403 115L442 104L477 98L507 96L508 95H526L527 94H578L579 95H600L601 96L628 97L639 99H654L658 96L670 78L706 29L708 25V18L706 14ZM425 436L426 437V452L430 472L434 482L444 496L456 505L469 510L480 512L506 511L523 506L536 500L560 483L583 460L592 448L594 449V457L597 471L604 486L612 496L623 504L638 510L649 512H667L683 508L692 504L705 495L727 473L751 439L765 415L766 416L765 420V449L767 462L773 481L779 491L788 500L805 509L821 512H838L853 509L871 501L883 493L897 481L928 445L929 446V456L931 468L934 477L943 493L953 502L964 508L980 512H1000L1014 509L1034 500L1048 490L1066 473L1076 461L1088 444L1100 423L1115 387L1114 379L1111 376L1105 375L1102 377L1090 399L1076 421L1054 448L1043 458L1032 464H1025L1020 459L1018 453V443L1025 413L1048 350L1093 241V231L1085 223L1071 218L1050 215H1033L1032 216L1018 217L1009 220L1000 225L991 234L984 247L963 303L943 362L933 397L917 422L906 436L884 457L870 464H863L857 460L854 451L855 435L859 419L875 374L903 306L925 258L926 250L924 245L918 240L908 237L893 236L892 235H859L841 239L828 246L817 257L810 267L796 298L774 356L740 417L727 436L708 457L699 463L691 464L685 459L683 454V440L687 420L715 341L745 267L752 253V244L748 238L741 234L723 230L677 229L661 233L653 237L647 242L638 254L634 263L611 334L610 341L602 367L594 408L574 433L556 450L545 458L535 463L520 464L513 457L512 445L515 428L523 399L540 350L570 274L571 269L618 155L619 144L616 140L612 138H513L509 140L505 149L501 163L497 171L495 179L473 237L447 316L431 380L426 414L425 436ZM228 287L240 292L252 300L262 310L271 324L276 338L278 348L277 371L271 390L258 411L242 427L222 439L206 444L193 446L173 445L159 441L143 432L132 422L123 409L119 400L115 385V362L120 343L126 331L136 317L147 306L163 295L182 287L197 284H214L228 287Z" fill="#2B0055"/>
  <path d="M1064.4 192C1091.74 192 1113.9 169.838 1113.9 142.5C1113.9 115.162 1091.74 93 1064.4 93C1037.06 93 1014.9 115.162 1014.9 142.5C1014.9 169.838 1037.06 192 1064.4 192Z" fill="#9B35F5"/>
</svg>
`;

const imagemPerfilUsuario = require("../../assets/user/profile1.webp");

const MARKER_ICON_CANVAS_SIZE = 44;
const MARKER_ICON_BORDER_COLOR = "#FCFEFA";
const USER_LOCATION_ICON_CANVAS_SIZE = 54;
const USER_LOCATION_ICON_KEY = "user-location";

const plugIconPaths = [
  "M12 22v-5",
  "M15 8V2",
  "M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z",
  "M9 8V2",
];

type GeradorDeIconeDeMarcadorProps = {
  markerKey: string;
  tamanhoCanvas: number;
  onPronto: (markerKey: string, uri: string) => void;
  children: React.ReactNode;
};

const GeradorDeIconeDeMarcador = ({
  markerKey,
  tamanhoCanvas,
  onPronto,
  children,
}: GeradorDeIconeDeMarcadorProps) => {
  const svgRef = useRef<Svg | null>(null);

  const capturarIcone = useCallback(() => {
    requestAnimationFrame(() => {
      svgRef.current?.toDataURL((base64) => {
        onPronto(markerKey, `data:image/png;base64,${base64}`);
      });
    });
  }, [markerKey, onPronto]);

  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", top: -9999, left: -9999 }}
    >
      <Svg
        ref={svgRef}
        width={tamanhoCanvas}
        height={tamanhoCanvas}
        viewBox={`0 0 ${tamanhoCanvas} ${tamanhoCanvas}`}
        onLayout={capturarIcone}
      >
        {children}
      </Svg>
    </View>
  );
};

const ConteudoIconeEstacao = ({ cor }: { cor: string }) => (
  <>
    <Circle
      cx={MARKER_ICON_CANVAS_SIZE / 2}
      cy={MARKER_ICON_CANVAS_SIZE / 2}
      r={MARKER_ICON_CANVAS_SIZE / 2 - 3}
      fill={cor}
      stroke={MARKER_ICON_BORDER_COLOR}
      strokeWidth={3}
    />
    <G
      transform="translate(12, 12) scale(0.8333)"
      fill="none"
      stroke={MARKER_ICON_BORDER_COLOR}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {plugIconPaths.map((d) => (
        <Path key={d} d={d} />
      ))}
    </G>
  </>
);

const ConteudoIconeLocalizacaoUsuario = ({ cor }: { cor: string }) => {
  const centro = USER_LOCATION_ICON_CANVAS_SIZE / 2;

  return (
    <>
      <Circle cx={centro} cy={centro} r={centro} fill="rgba(31, 169, 113, 0.18)" />
      <Circle
        cx={centro}
        cy={centro}
        r={12}
        fill={cor}
        stroke={MARKER_ICON_BORDER_COLOR}
        strokeWidth={5}
      />
    </>
  );
};

const criarLogoFluiXml = (corPrincipal: string, corPonto: string) => {
  return logoFluiXml
    .replace('fill="#2B0055"', `fill="${corPrincipal}"`)
    .replace('fill="#9B35F5"', `fill="${corPonto}"`);
};

type EstiloMapa = {
  elementType?: string;
  featureType?: string;
  stylers: Record<string, string>[];
}[];

const estiloEscuroDoMapa: EstiloMapa = [
  { elementType: "geometry", stylers: [{ color: "#172033" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#D7E4DF" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0E1320" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#2F405C" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#1D2A3D" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#183628" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#26344D" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#111827" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#384D6B" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#243149" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0A2237" }],
  },
];

type FiltroRapidoId = "openNow" | "ccs2" | "fast" | "restroom";

type ControleMapaAtivo = "aproximar" | "afastar" | "centralizar" | null;

type FiltrosRapidos = Record<FiltroRapidoId, boolean>;

const filtrosRapidosIniciais: FiltrosRapidos = {
  openNow: false,
  ccs2: false,
  fast: false,
  restroom: false,
};

const pointLabels = [
  { id: "near", title: "Mais próximo", icon: Navigation },
  { id: "best", title: "Melhor avaliado", icon: Star },
  { id: "comfort", title: "Mais confortável", icon: Coffee },
  { id: "fast", title: "Carga rápida", icon: Zap },
  { id: "open", title: "Recomendado", icon: Clock3 },
];

type Station = (typeof chargingStations)[number];

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};
type MapColorTokens = typeof baseColors & {
  dangerBorder?: string;
  success?: string;
  successSoft?: string;
  dangerSoft?: string;
  warningLight?: string;
};

type UserLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
};

const LOCALIZACAO_DEMO_FIAP: UserLocation = {
  latitude: -23.564304,
  longitude: -46.652537,
  accuracy: 25,
};

const toRecord = (value: unknown): Record<string, unknown> => {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
};

const readString = (source: unknown, key: string, fallback = "") => {
  const value = toRecord(source)[key];
  return typeof value === "string" ? value : fallback;
};

const readNumber = (source: unknown, key: string, fallback = 0) => {
  const value = toRecord(source)[key];
  return typeof value === "number" ? value : fallback;
};

const readBoolean = (source: unknown, key: string, fallback = false) => {
  const value = toRecord(source)[key];
  return typeof value === "boolean" ? value : fallback;
};

const readArray = (source: unknown, key: string) => {
  const value = toRecord(source)[key];
  return Array.isArray(value) ? value : [];
};

const readStringArray = (source: unknown, key: string) => {
  return readArray(source, key).filter(
    (item): item is string => typeof item === "string",
  );
};

const getRouteParamAsString = (param: unknown) => {
  if (typeof param === "string") {
    return param;
  }

  if (Array.isArray(param) && typeof param[0] === "string") {
    return param[0];
  }

  return "";
};

const parseRouteFilters = (param: unknown): StationFilters => {
  const rawFilters = getRouteParamAsString(param);

  if (!rawFilters) {
    return defaultFilters;
  }

  try {
    const parsedFilters = JSON.parse(rawFilters);
    const parsedRecord = toRecord(parsedFilters);

    return {
      connectorTypes: readStringArray(
        parsedRecord,
        "connectorTypes",
      ) as StationFilters["connectorTypes"],
      statuses: readStringArray(
        parsedRecord,
        "statuses",
      ) as StationFilters["statuses"],
      amenities: readStringArray(
        parsedRecord,
        "amenities",
      ) as StationFilters["amenities"],
      power: {
        minKw: readNumber(
          parsedRecord.power,
          "minKw",
          defaultFilters.power.minKw,
        ),
      },
      distance: {
        maxKm: readNumber(
          parsedRecord.distance,
          "maxKm",
          defaultFilters.distance.maxKm,
        ),
      },
      rating: {
        minRating: readNumber(
          parsedRecord.rating,
          "minRating",
          defaultFilters.rating.minRating,
        ),
      },
      onlyOpenNow: readBoolean(
        parsedRecord,
        "onlyOpenNow",
        defaultFilters.onlyOpenNow,
      ),
      onlyOpen24h: readBoolean(
        parsedRecord,
        "onlyOpen24h",
        defaultFilters.onlyOpen24h,
      ),
    };
  } catch {
    return defaultFilters;
  }
};

const hasActiveFilters = (filters: StationFilters) => {
  return (
    filters.connectorTypes.length > 0 ||
    filters.statuses.length > 0 ||
    filters.amenities.length > 0 ||
    filters.power.minKw > 0 ||
    filters.distance.maxKm !== defaultFilters.distance.maxKm ||
    filters.rating.minRating > 0 ||
    filters.onlyOpenNow ||
    filters.onlyOpen24h
  );
};

const combinarFiltrosRapidos = (
  filters: StationFilters,
  filtrosRapidos: FiltrosRapidos,
): StationFilters => {
  return {
    connectorTypes: filtrosRapidos.ccs2
      ? Array.from(new Set([...filters.connectorTypes, "ccs2"]))
      : filters.connectorTypes,
    statuses: filters.statuses,
    amenities: filtrosRapidos.restroom
      ? Array.from(new Set([...filters.amenities, "restroom"]))
      : filters.amenities,
    power: {
      minKw: filtrosRapidos.fast
        ? Math.max(filters.power.minKw, 50)
        : filters.power.minKw,
    },
    distance: filters.distance,
    rating: filters.rating,
    onlyOpenNow: filters.onlyOpenNow || filtrosRapidos.openNow,
    onlyOpen24h: filters.onlyOpen24h,
  };
};

const hasFiltrosRapidosAtivos = (filtrosRapidos: FiltrosRapidos) => {
  return Object.values(filtrosRapidos).some(Boolean);
};

const getStationId = (station: Station, index: number) => {
  return readString(
    station,
    "id",
    `station-${String(index + 1).padStart(2, "0")}`,
  );
};

const getStationName = (station: Station) => {
  return readString(station, "name", readString(station, "title", "Ponto"));
};

const getStationNameById = (stationId: string) => {
  const station = chargingStations.find((item, index) => {
    return getStationId(item, index) === stationId;
  });

  return station ? getStationName(station) : "ponto de recarga";
};

const getStationAddress = (station: Station) => {
  return readString(
    station,
    "address",
    readString(station, "location", "Endereço não informado"),
  );
};

const getRawStationStatus = (station: Station) => {
  return readString(station, "status", "available").toLowerCase();
};

const getStationStatus = (station: Station) => {
  const status = getRawStationStatus(station);

  if (status.includes("maintenance") || status.includes("manutenção")) {
    return "Em manutenção";
  }

  if (status.includes("unavailable") || status.includes("indispon")) {
    return "Indisponível";
  }

  if (status.includes("busy") || status.includes("ocup")) {
    return "Ocupado agora";
  }

  return readString(station, "statusLabel", "Aberto agora");
};

const getStationPowerNumber = (station: Station) => {
  const stationPower = readNumber(
    station,
    "powerKw",
    readNumber(
      station,
      "powerKW",
      readNumber(station, "maxPowerKw", readNumber(station, "power", 0)),
    ),
  );

  const connectorPowers = readArray(station, "connectors").map((connector) =>
    readNumber(connector, "powerKw", readNumber(connector, "powerKW", 0)),
  );

  return Math.max(stationPower, ...connectorPowers, 0);
};

const getStationPower = (station: Station) => {
  const customLabel = readString(station, "powerLabel");

  if (customLabel) {
    return customLabel;
  }

  const power = getStationPowerNumber(station);

  return power > 0 ? `${power} kW` : "-- kW";
};

const getStationRatingNumber = (station: Station) => {
  return readNumber(station, "rating", readNumber(station, "averageRating", 0));
};

const getStationRating = (station: Station) => {
  const rating = getStationRatingNumber(station) || 4.8;

  return rating.toFixed(1).replace(".", ",");
};

const getStationDistanceNumber = (station: Station, index: number) => {
  return readNumber(station, "distanceKm", 0.45 + index * 0.8);
};

const criarRegiaoDoMapa = (
  station: Station | undefined,
  aproxima: boolean,
): Region => {
  return {
    latitude: station?.latitude ?? -23.5639,
    longitude: station?.longitude ?? -46.6524,
    latitudeDelta: aproxima ? 0.018 : 0.035,
    longitudeDelta: aproxima ? 0.018 : 0.035,
  };
};

const criarRegiaoComFocoVisivel = (
  latitude: number,
  longitude: number,
  aproxima = true,
  fracaoDeDeslocamento = 0.08,
): Region => {
  const latitudeDelta = aproxima ? 0.014 : 0.026;
  const longitudeDelta = aproxima ? 0.014 : 0.026;

  return {
    latitude: latitude - latitudeDelta * fracaoDeDeslocamento,
    longitude,
    latitudeDelta,
    longitudeDelta,
  };
};

const limitarValor = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const getStationMarkerColor = (station: Station, colorSet: MapColorTokens) => {
  const status = getRawStationStatus(station);

  if (status === "busy") {
    return colorSet.yellowDark;
  }

  if (status === "maintenance") {
    return colorSet.dangerBorder ?? colorSet.yellowDark;
  }

  if (status === "unavailable") {
    return colorSet.textLight;
  }

  return colorSet.green ?? colorSet.success ?? colorSet.primary;
};

const NIVEIS_DE_BATERIA_VEICULO = [20, 40, 60, 80, 100];

function obterIconeDeBateriaAtual(percentual: number) {
  if (percentual >= 60) {
    return BatteryFull;
  }

  if (percentual >= 25) {
    return BatteryMedium;
  }

  return BatteryLow;
}

function obterCorDeBateriaAtual(percentual: number, colorSet: MapColorTokens) {
  if (percentual >= 60) {
    return colorSet.green ?? colorSet.success ?? colorSet.primary;
  }

  if (percentual >= 25) {
    return colorSet.yellowDark;
  }

  return colorSet.dangerBorder ?? colorSet.yellowDark;
}

function obterCorDoAlcance(
  nivel: ReturnType<typeof avaliarAlcance>["nivel"],
  colorSet: MapColorTokens,
) {
  if (nivel === "tranquilo") {
    return colorSet.green ?? colorSet.success ?? colorSet.primary;
  }

  if (nivel === "apertado") {
    return colorSet.yellowDark;
  }

  return colorSet.dangerBorder ?? colorSet.yellowDark;
}

function obterFundoDoAlcance(
  nivel: ReturnType<typeof avaliarAlcance>["nivel"],
  colorSet: MapColorTokens,
) {
  if (nivel === "tranquilo") {
    return colorSet.successSoft ?? colorSet.primarySoft;
  }

  if (nivel === "apertado") {
    return colorSet.warningLight ?? colorSet.yellow;
  }

  return colorSet.dangerSoft ?? colorSet.warningLight ?? colorSet.yellow;
}

function obterRotuloDoAlcance(nivel: ReturnType<typeof avaliarAlcance>["nivel"]) {
  if (nivel === "tranquilo") {
    return "Confortável";
  }

  if (nivel === "apertado") {
    return "Limitada";
  }

  return "Insuficiente";
}

function obterIconeDoAlcance(nivel: ReturnType<typeof avaliarAlcance>["nivel"]) {
  if (nivel === "foraDeAlcance") {
    return BatteryWarning;
  }

  if (nivel === "apertado") {
    return BatteryLow;
  }

  return BatteryFull;
}

const getStationConnectors = (station: Station) => {
  return [
    ...readArray(station, "connectors"),
    ...readArray(station, "connectorTypes"),
  ]
    .map((connector) => {
      if (typeof connector === "string") {
        return connector.toLowerCase();
      }

      const type = readString(connector, "type").toLowerCase();
      const label = readString(connector, "label").toLowerCase();

      return `${type} ${label}`.trim();
    })
    .filter(Boolean);
};

const getStationAmenities = (station: Station) => {
  return readArray(station, "amenities")
    .map((amenity) => {
      if (typeof amenity === "string") {
        return amenity.toLowerCase();
      }

      return readString(
        amenity,
        "value",
        readString(amenity, "id", readString(amenity, "label")),
      ).toLowerCase();
    })
    .filter(Boolean);
};

const stationIsOpenNow = (station: Station) => {
  const status = getRawStationStatus(station);

  return status === "available" || status === "busy";
};

const stationHasAvailableCharger = (station: Station) => {
  const connectors = readArray(station, "connectors");

  return connectors.some((connector) => {
    if (!isRecord(connector)) {
      return false;
    }

    return readNumber(connector, "availableChargers") > 0;
  });
};


const calcularPontuacaoDosFiltrosRapidos = (
  station: Station,
  filtrosRapidos: FiltrosRapidos,
) => {
  let pontuacao = 0;

  if (filtrosRapidos.openNow && stationHasAvailableCharger(station)) {
    pontuacao += 80;
  }

  if (filtrosRapidos.ccs2) {
    const hasCcs2 = getStationConnectors(station).some((connector) =>
      connector.includes("ccs2"),
    );

    if (hasCcs2) {
      pontuacao += 60;
    }
  }

  if (filtrosRapidos.fast) {
    pontuacao += getStationPowerNumber(station);
  }

  if (filtrosRapidos.restroom) {
    const hasRestroom = getStationAmenities(station).includes("restroom");

    if (hasRestroom) {
      pontuacao += 50;
    }
  }

  return pontuacao;
};

const ordenarPorFiltrosRapidos = (
  estacoes: { station: Station; index: number }[],
  filtrosRapidos: FiltrosRapidos,
) => {
  if (!hasFiltrosRapidosAtivos(filtrosRapidos)) {
    return estacoes;
  }

  return [...estacoes].sort((a, b) => {
    const pontuacaoA = calcularPontuacaoDosFiltrosRapidos(
      a.station,
      filtrosRapidos,
    );
    const pontuacaoB = calcularPontuacaoDosFiltrosRapidos(
      b.station,
      filtrosRapidos,
    );

    if (pontuacaoA !== pontuacaoB) {
      return pontuacaoB - pontuacaoA;
    }

    return (
      (a.station.distanceKm ?? a.index) - (b.station.distanceKm ?? b.index)
    );
  });
};

const TABLET_BREAKPOINT = 700;
const MAX_CONTENT_WIDTH = 560;

export default function HomeMapScreen() {
  const { styles, colors, isDarkMode } = useTelaComPreferencias(
    baseStyles,
    baseColors,
  );
  const { userPreferences, updateBatteryPercent } = useAppPreferences();
  const batteryPercent = userPreferences.batteryPercent;
  const vehicleRangeKm = userPreferences.vehicleRangeKm;
  const [seletorBateriaAberto, setSeletorBateriaAberto] = useState(false);
  const { width: larguraJanela, height: alturaJanela } =
    useWindowDimensions();
  const isTelaLarga = larguraJanela >= TABLET_BREAKPOINT;
  const margemHorizontalConteudo = isTelaLarga
    ? Math.max(16, (larguraJanela - MAX_CONTENT_WIDTH) / 2)
    : 20;
  const margemHorizontalSheet = isTelaLarga
    ? Math.max(16, (larguraJanela - MAX_CONTENT_WIDTH) / 2)
    : 16;
  const alturaMaximaListaPontos = Math.max(
    180,
    Math.min(320, alturaJanela * 0.32),
  );
  const routeParams = useLocalSearchParams();
  const filtersParam = routeParams.filters;
  const queryParam = routeParams.query;
  const mapRef = useRef<MapView | null>(null);
  const currentMapRegionRef = useRef<Region | null>(null);
  const sheetTranslateY = useRef(new Animated.Value(0)).current;
  const quickFiltersProgress = useRef(new Animated.Value(0)).current;
  const quickFiltersHintTranslateY = useRef(new Animated.Value(0)).current;
  const sheetHintTranslateY = useRef(new Animated.Value(0)).current;
  const sheetPositionRef = useRef(0);
  const [localizacaoUsuario, setLocalizacaoUsuario] =
    useState<UserLocation | null>(LOCALIZACAO_DEMO_FIAP);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [rastrearAlteracoesDosMarcadores, setRastrearAlteracoesDosMarcadores] =
    useState(true);
  const [iconesDeMarcadorPorCor, setIconesDeMarcadorPorCor] = useState<
    Record<string, string>
  >({});
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);
  const [painelTotalmenteOculto, setPainelTotalmenteOculto] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(0);
  const [mapAreaHeight, setMapAreaHeight] = useState(0);
  const [atalhosRapidosAbertos, setAtalhosRapidosAbertos] = useState(false);
  const [hasInteractedWithQuickFilters, setHasInteractedWithQuickFilters] =
    useState(false);
  const [hasInteractedWithSheet, setHasInteractedWithSheet] = useState(false);
  const [filtrosRapidos, setFiltrosRapidos] = useState<FiltrosRapidos>(
    filtrosRapidosIniciais,
  );
  const [searchTerm, setSearchTerm] = useState(() =>
    getRouteParamAsString(queryParam),
  );
  const [isOpeningDetails, setIsOpeningDetails] = useState(false);
  const [mapFeedbackMessage, setMapFeedbackMessage] = useState<string | null>(
    null,
  );
  const [controleMapaAtivo, setControleMapaAtivo] =
    useState<ControleMapaAtivo>(null);

  const mapFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const routeSearchTerm = useMemo(() => {
    return getRouteParamAsString(queryParam);
  }, [queryParam]);

  const logoFluiDoTema = useMemo(() => {
    return criarLogoFluiXml(
      isDarkMode ? "#F3E9FF" : colors.primary,
      isDarkMode ? "#D8C7FF" : "#9B35F5",
    );
  }, [colors.primary, isDarkMode]);

  const usarMapaEscuro = Platform.OS === "android" && isDarkMode;

  const alturaAtalhosRapidos = quickFiltersProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, QUICK_FILTERS_CONTENT_HEIGHT],
  });

  const sheetCollapsedTranslateY = useMemo(() => {
    return Math.max(sheetHeight - SHEET_VISIBLE_HANDLE, 0);
  }, [sheetHeight]);

  useEffect(() => {
    setSearchTerm(routeSearchTerm);
  }, [routeSearchTerm]);


  const animarAtalhosRapidos = useCallback(
    (shouldOpen: boolean) => {
      const nextProgress = shouldOpen ? 1 : 0;

      quickFiltersProgress.stopAnimation();
      setAtalhosRapidosAbertos(shouldOpen);

      Animated.timing(quickFiltersProgress, {
        toValue: nextProgress,
        duration: 220,
        useNativeDriver: false,
      }).start();
    },
    [quickFiltersProgress],
  );

  useEffect(() => {
    if (hasInteractedWithQuickFilters) {
      quickFiltersHintTranslateY.stopAnimation();
      quickFiltersHintTranslateY.setValue(0);
      return;
    }

    const hintOffset = atalhosRapidosAbertos
      ? -HANDLE_HINT_DISTANCE
      : HANDLE_HINT_DISTANCE;
    const hintAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(quickFiltersHintTranslateY, {
          toValue: hintOffset,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.timing(quickFiltersHintTranslateY, {
          toValue: 0,
          duration: 520,
          useNativeDriver: true,
        }),
        Animated.delay(1300),
      ]),
    );

    hintAnimation.start();

    return () => {
      hintAnimation.stop();
      quickFiltersHintTranslateY.setValue(0);
    };
  }, [
    atalhosRapidosAbertos,
    hasInteractedWithQuickFilters,
    quickFiltersHintTranslateY,
  ]);

  useEffect(() => {
    if (hasInteractedWithSheet) {
      sheetHintTranslateY.stopAnimation();
      sheetHintTranslateY.setValue(0);
      return;
    }

    const hintOffset = isSheetCollapsed
      ? -HANDLE_HINT_DISTANCE
      : HANDLE_HINT_DISTANCE;
    const hintAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(sheetHintTranslateY, {
          toValue: hintOffset,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.timing(sheetHintTranslateY, {
          toValue: 0,
          duration: 520,
          useNativeDriver: true,
        }),
        Animated.delay(1400),
      ]),
    );

    hintAnimation.start();

    return () => {
      hintAnimation.stop();
      sheetHintTranslateY.setValue(0);
    };
  }, [hasInteractedWithSheet, isSheetCollapsed, sheetHintTranslateY]);

  const appliedFilters = useMemo(() => {
    return parseRouteFilters(filtersParam);
  }, [filtersParam]);

  const filtrosDoMapa = useMemo(() => {
    return combinarFiltrosRapidos(appliedFilters, filtrosRapidos);
  }, [appliedFilters, filtrosRapidos]);

  const hasFiltersApplied = useMemo(() => {
    return (
      hasActiveFilters(filtrosDoMapa) || hasFiltrosRapidosAtivos(filtrosRapidos)
    );
  }, [filtrosDoMapa, filtrosRapidos]);

  const filterChips = useMemo(() => {
    return [
      {
        id: "openNow" as const,
        label: "Aberto agora",
        icon: Clock3,
        active: filtrosRapidos.openNow,
      },
      {
        id: "ccs2" as const,
        label: "CCS2",
        icon: Plug,
        active: filtrosRapidos.ccs2,
      },
      {
        id: "fast" as const,
        label: "Rápido",
        icon: Zap,
        active: filtrosRapidos.fast,
      },
      {
        id: "restroom" as const,
        label: "Banheiro",
        icon: Toilet,
        active: filtrosRapidos.restroom,
      },
    ];
  }, [filtrosRapidos]);

  const visibleStations = useMemo(() => {
    const filtradas = filtrarEstacoes({
      estacoes: chargingStations,
      filtros: filtrosDoMapa,
      termoBusca: searchTerm,
    });

    return ordenarPorFiltrosRapidos(
      filtradas.map((station) => ({
        station,
        index: chargingStations.indexOf(station),
      })),
      filtrosRapidos,
    );
  }, [filtrosDoMapa, filtrosRapidos, searchTerm]);

  useEffect(() => {
    setRastrearAlteracoesDosMarcadores(true);

    const timeoutId = setTimeout(() => {
      setRastrearAlteracoesDosMarcadores(false);
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [visibleStations.length]);

  const coresDosMarcadores = useMemo(() => {
    const cores = new Set<string>();

    visibleStations.forEach((item) => {
      cores.add(getStationMarkerColor(item.station, colors));
    });

    return Array.from(cores);
  }, [colors, visibleStations]);

  const iconeLocalizacaoUsuarioUri =
    iconesDeMarcadorPorCor[USER_LOCATION_ICON_KEY];

  const registrarIconeDeMarcador = useCallback((cor: string, uri: string) => {
    setIconesDeMarcadorPorCor((atual) => {
      if (atual[cor] === uri) {
        return atual;
      }

      return { ...atual, [cor]: uri };
    });
  }, []);

  const estacoesRecomendadas = useMemo(() => {
    return visibleStations.filter((item) => {
      return (
        getRawStationStatus(item.station) === "available" &&
        stationHasAvailableCharger(item.station)
      );
    });
  }, [visibleStations]);

  const points = useMemo(() => {
    return estacoesRecomendadas.map((item, cardIndex) => {
      const label = pointLabels[cardIndex];
      const cardId = label?.id ?? `station-${cardIndex}`;

      return {
        id: cardId,
        stationId: getStationId(item.station, item.index),
        criterioLabel: label?.title ?? "Recomendado",
        criterioIcon: label?.icon ?? Zap,
        nomeEstacao: getStationName(item.station),
        address: getStationAddress(item.station),
        status: getStationStatus(item.station),
        statusColor: getStationMarkerColor(item.station, colors),
        rating: getStationRating(item.station),
        power: getStationPower(item.station),
        alcance: avaliarAlcance(
          getStationDistanceNumber(item.station, item.index),
          vehicleRangeKm,
          batteryPercent,
        ),
      };
    });
  }, [batteryPercent, colors, estacoesRecomendadas, vehicleRangeKm]);

  const hasNoResults = estacoesRecomendadas.length === 0;
  const hasSearchTerm = searchTerm.trim().length > 0;

  const fracaoDeDeslocamentoVertical = useMemo(() => {
    if (mapAreaHeight <= 0) {
      return 0.08;
    }

    if (painelTotalmenteOculto) {
      return 0;
    }

    const alturaObstruida = isSheetCollapsed
      ? SHEET_VISIBLE_HANDLE
      : sheetHeight;

    return limitarValor(alturaObstruida / 2 / mapAreaHeight, 0, 0.4);
  }, [isSheetCollapsed, mapAreaHeight, painelTotalmenteOculto, sheetHeight]);

  const fracaoDeDeslocamentoVerticalRef = useRef(fracaoDeDeslocamentoVertical);
  fracaoDeDeslocamentoVerticalRef.current = fracaoDeDeslocamentoVertical;

  const mapRegion = useMemo(() => {
    const firstVisibleStation =
      visibleStations[0]?.station ?? chargingStations[0];

    if ((hasFiltersApplied || hasSearchTerm) && firstVisibleStation) {
      return criarRegiaoDoMapa(firstVisibleStation, true);
    }

    if (localizacaoUsuario) {
      return criarRegiaoComFocoVisivel(
        localizacaoUsuario.latitude,
        localizacaoUsuario.longitude,
        true,
        fracaoDeDeslocamentoVerticalRef.current,
      );
    }

    return criarRegiaoDoMapa(firstVisibleStation, false);
    // fracaoDeDeslocamentoVertical é lido via ref de propósito: ela só
    // reflete o layout (sheet/mapArea) se estabilizando, e recalcular a
    // região a cada ajuste fazia o mapa reanimar várias vezes seguidas
    // logo na abertura, deixando o carregamento visivelmente mais lento.
  }, [hasFiltersApplied, hasSearchTerm, localizacaoUsuario, visibleStations]);

  const isPrimeiraRegiaoRef = useRef(true);

  useEffect(() => {
    currentMapRegionRef.current = mapRegion;

    if (isPrimeiraRegiaoRef.current) {
      isPrimeiraRegiaoRef.current = false;
      return;
    }

    mapRef.current?.animateToRegion(mapRegion, 450);
  }, [mapRegion]);

  const ajusteInicialDeCentralizacaoRef = useRef(false);

  useEffect(() => {
    if (ajusteInicialDeCentralizacaoRef.current) {
      return;
    }

    if (mapAreaHeight <= 0 || sheetHeight <= 0) {
      return;
    }

    if (hasFiltersApplied || hasSearchTerm || !localizacaoUsuario) {
      return;
    }

    ajusteInicialDeCentralizacaoRef.current = true;

    const regiaoCentralizada = criarRegiaoComFocoVisivel(
      localizacaoUsuario.latitude,
      localizacaoUsuario.longitude,
      true,
      fracaoDeDeslocamentoVertical,
    );

    currentMapRegionRef.current = regiaoCentralizada;
    mapRef.current?.animateToRegion(regiaoCentralizada, 400);
  }, [
    fracaoDeDeslocamentoVertical,
    hasFiltersApplied,
    hasSearchTerm,
    localizacaoUsuario,
    mapAreaHeight,
    sheetHeight,
  ]);

  const alterarZoomMapa = (direction: "aproximar" | "afastar") => {
    const currentRegion = currentMapRegionRef.current ?? mapRegion;
    const zoomFactor = direction === "aproximar" ? 0.58 : 1.55;

    const nextRegion = {
      ...currentRegion,
      latitudeDelta: limitarValor(
        currentRegion.latitudeDelta * zoomFactor,
        0.004,
        0.08,
      ),
      longitudeDelta: limitarValor(
        currentRegion.longitudeDelta * zoomFactor,
        0.004,
        0.08,
      ),
    };

    currentMapRegionRef.current = nextRegion;
    mapRef.current?.animateToRegion(nextRegion, 240);
  };

  const sheetTitle = hasNoResults
    ? "Nenhum ponto disponível"
    : "Melhores escolhas";

  const IconeBateriaAtual = obterIconeDeBateriaAtual(batteryPercent);
  const corBateriaAtual = obterCorDeBateriaAtual(batteryPercent, colors);
  const autonomiaAtualKm = Math.round((vehicleRangeKm * batteryPercent) / 100);

  const selecionarNivelDeBateria = (percentual: number) => {
    setSeletorBateriaAberto(false);
    void updateBatteryPercent(percentual);
  };

  const moverPainelDePontosPara = useCallback(
    (destino: number) => {
      sheetPositionRef.current = destino;

      Animated.spring(sheetTranslateY, {
        toValue: destino,
        useNativeDriver: true,
        friction: 8,
        tension: 58,
      }).start();
    },
    [sheetTranslateY],
  );

  const alternarModalDePontos = useCallback(
    (shouldCollapse: boolean) => {
      setPainelTotalmenteOculto(false);
      setIsSheetCollapsed(shouldCollapse);
      moverPainelDePontosPara(shouldCollapse ? sheetCollapsedTranslateY : 0);
    },
    [moverPainelDePontosPara, sheetCollapsedTranslateY],
  );

  const ocultarPainelDePontosCompletamente = useCallback(() => {
    setPainelTotalmenteOculto(true);
    moverPainelDePontosPara(sheetHeight + SHEET_OCULTO_MARGEM_EXTRA);
  }, [moverPainelDePontosPara, sheetHeight]);

  useEffect(() => {
    if (sheetHeight <= 0) {
      return;
    }

    if (painelTotalmenteOculto) {
      const destinoOculto = sheetHeight + SHEET_OCULTO_MARGEM_EXTRA;
      sheetTranslateY.setValue(destinoOculto);
      sheetPositionRef.current = destinoOculto;
      return;
    }

    if (isSheetCollapsed) {
      sheetTranslateY.setValue(sheetCollapsedTranslateY);
      sheetPositionRef.current = sheetCollapsedTranslateY;
    }
  }, [
    isSheetCollapsed,
    painelTotalmenteOculto,
    sheetCollapsedTranslateY,
    sheetHeight,
    sheetTranslateY,
  ]);

  const openStationDetails = (stationId: string) => {
    if (isOpeningDetails) {
      return;
    }

    const route = {
      pathname: "/point-details",
      params: { stationId },
    } as Href;

    setIsOpeningDetails(true);

    setTimeout(() => {
      setIsOpeningDetails(false);
      router.push(route);
    }, 280);
  };

  const abrirBusca = () => {
    router.push("/search" as Href);
  };

  const alternarFiltroRapido = (filterId: FiltroRapidoId) => {
    setFiltrosRapidos((filtrosAtuais) => ({
      ...filtrosAtuais,
      [filterId]: !filtrosAtuais[filterId],
    }));
  };

  const alternarAtalhosRapidos = () => {
    setHasInteractedWithQuickFilters(true);
    animarAtalhosRapidos(!atalhosRapidosAbertos);
  };

  const renderizarChevronDeControle = (apontaParaCima: boolean) => {
    return (
      <SvgXml
        xml={apontaParaCima ? chevronControleCimaXml : chevronControleBaixoXml}
        width={28}
        height={12}
      />
    );
  };

  const renderizarPuxadorDeAtalhos = () => {
    return (
      <PressableScale
        accessibilityRole="button"
        accessibilityLabel={
          atalhosRapidosAbertos
            ? "Recolher atalhos de filtro"
            : "Mostrar atalhos de filtro"
        }
        accessibilityHint="Toque para abrir ou recolher os filtros rápidos do mapa."
        accessibilityState={{ expanded: atalhosRapidosAbertos }}
        hitSlop={{ top: 8, right: 32, bottom: 8, left: 32 }}
        pressedScale={0.9}
        style={styles.quickFiltersHandleArea}
        onPress={alternarAtalhosRapidos}
      >
        <Animated.View
          style={{ transform: [{ translateY: quickFiltersHintTranslateY }] }}
        >
          <View style={styles.quickFiltersChevronButton}>
            {renderizarChevronDeControle(atalhosRapidosAbertos)}
          </View>
        </Animated.View>
      </PressableScale>
    );
  };

  const openProfile = () => {
    router.push("/profile" as Href);
  };

  const showLocationFeedback = (message: string) => {
    if (mapFeedbackTimeoutRef.current) {
      clearTimeout(mapFeedbackTimeoutRef.current);
    }

    setMapFeedbackMessage(message);

    mapFeedbackTimeoutRef.current = setTimeout(() => {
      setMapFeedbackMessage(null);
    }, FEEDBACK_DURATION);
  };

  const centralizarLocalizacaoUsuario = () => {
    if (isLocatingUser) {
      return;
    }

    setIsLocatingUser(true);

    const nextLocation = LOCALIZACAO_DEMO_FIAP;

    setLocalizacaoUsuario(nextLocation);

    mapRef.current?.animateToRegion(
      criarRegiaoComFocoVisivel(
        nextLocation.latitude,
        nextLocation.longitude,
        true,
        fracaoDeDeslocamentoVertical,
      ),
      500,
    );

    showLocationFeedback("Localização centralizada na FIAP");

    if (isSheetCollapsed || painelTotalmenteOculto) {
      alternarModalDePontos(false);
    }

    setTimeout(() => {
      setIsLocatingUser(false);
    }, 450);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <ScreenTransition style={styles.screen}>
        <View
          style={[
            styles.topArea,
            { paddingHorizontal: margemHorizontalConteudo },
          ]}
        >
          <View style={styles.header}>
            <SvgXml xml={logoFluiDoTema} width={76} height={36} />

            <PressableScale
              accessibilityRole="button"
              accessibilityLabel={`Bateria do veículo: ${batteryPercent} por cento, cerca de ${autonomiaAtualKm} quilômetros de autonomia`}
              accessibilityHint="Toque para ajustar o nível de bateria e ver o alcance nos pontos."
              style={[
                styles.batteryPill,
                { borderColor: corBateriaAtual + "55" },
              ]}
              onPress={() => setSeletorBateriaAberto(true)}
            >
              <View
                style={[
                  styles.batteryPillIconWrap,
                  { backgroundColor: corBateriaAtual + "1F" },
                ]}
              >
                <IconeBateriaAtual size={14} color={corBateriaAtual} strokeWidth={2.6} />
              </View>
              <Text style={styles.batteryPillText}>{batteryPercent}%</Text>
            </PressableScale>

            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Abrir perfil"
              style={styles.profileButton}
              onPress={openProfile}
            >
              <Image
                source={imagemPerfilUsuario}
                style={styles.profileImage}
                resizeMode="cover"
              />
            </PressableScale>
          </View>

          <View style={styles.searchBar}>
            <Search size={21} color={colors.textMuted} strokeWidth={2} />

            <TextInput
              accessibilityLabel="Buscar no mapa"
              accessibilityHint="Digite endereço, bairro ou nome do ponto de recarga."
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Buscar endereço, bairro ou ponto"
              placeholderTextColor={colors.textMuted}
              style={styles.searchText}
              returnKeyType="search"
            />

            <View style={styles.searchDivider} />

            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Abrir busca e filtros"
              style={styles.filterButton}
              onPress={abrirBusca}
            >
              <SlidersHorizontal
                size={21}
                color={colors.primary}
                strokeWidth={2}
              />
            </PressableScale>
          </View>

          <View style={styles.quickFiltersArea}>
            {atalhosRapidosAbertos ? null : renderizarPuxadorDeAtalhos()}

            <Animated.View
              pointerEvents={atalhosRapidosAbertos ? "auto" : "none"}
              style={[
                styles.quickFiltersAnimatedContent,
                {
                  height: alturaAtalhosRapidos,
                  opacity: quickFiltersProgress,
                },
              ]}
            >
              <ScrollView
                horizontal
                scrollEnabled={atalhosRapidosAbertos}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContent}
              >
                {filterChips.map((filter) => {
                  const Icon = filter.icon;

                  return (
                    <PressableScale
                      key={filter.id}
                      accessibilityRole="button"
                      accessibilityLabel={`${filter.label}${filter.active ? ", filtro ativo" : ""}`}
                      accessibilityHint="Filtra os pontos do mapa em tempo real."
                      accessibilityState={{ selected: filter.active }}
                      pressedScale={0.96}
                      style={[
                        styles.chip,
                        filter.active ? styles.chipActive : null,
                      ]}
                      onPress={() => alternarFiltroRapido(filter.id)}
                    >
                      <Icon
                        size={17}
                        color={filter.active ? colors.white : colors.primary}
                        strokeWidth={2}
                      />

                      <Text
                        style={[
                          styles.chipText,
                          filter.active ? styles.chipTextActive : null,
                        ]}
                      >
                        {filter.label}
                      </Text>
                    </PressableScale>
                  );
                })}
              </ScrollView>
            </Animated.View>

            {atalhosRapidosAbertos ? renderizarPuxadorDeAtalhos() : null}
          </View>
        </View>

        <View
          style={styles.mapArea}
          onLayout={(event) => {
            setMapAreaHeight(event.nativeEvent.layout.height);
          }}
        >
          {coresDosMarcadores
            .filter((cor) => !iconesDeMarcadorPorCor[cor])
            .map((cor) => (
              <GeradorDeIconeDeMarcador
                key={cor}
                markerKey={cor}
                tamanhoCanvas={MARKER_ICON_CANVAS_SIZE}
                onPronto={registrarIconeDeMarcador}
              >
                <ConteudoIconeEstacao cor={cor} />
              </GeradorDeIconeDeMarcador>
            ))}

          {localizacaoUsuario && !iconesDeMarcadorPorCor[USER_LOCATION_ICON_KEY] ? (
            <GeradorDeIconeDeMarcador
              markerKey={USER_LOCATION_ICON_KEY}
              tamanhoCanvas={USER_LOCATION_ICON_CANVAS_SIZE}
              onPronto={registrarIconeDeMarcador}
            >
              <ConteudoIconeLocalizacaoUsuario cor={colors.primary} />
            </GeradorDeIconeDeMarcador>
          ) : null}

          <MapView
            ref={mapRef}
            style={styles.realMap}
            provider={PROVIDER_GOOGLE}
            initialRegion={mapRegion}
            showsUserLocation={false}
            showsMyLocationButton={false}
            showsCompass={false}
            toolbarEnabled={false}
            loadingEnabled
            customMapStyle={usarMapaEscuro ? estiloEscuroDoMapa : []}
            onRegionChangeComplete={(region) => {
              currentMapRegionRef.current = region;
            }}
            accessibilityLabel="Mapa com pontos de recarga próximos"
          >
            {localizacaoUsuario ? (
              <Marker
                coordinate={{
                  latitude: localizacaoUsuario.latitude,
                  longitude: localizacaoUsuario.longitude,
                }}
                title="Você na FIAP"
                description="Localização simulada para demonstração."
                anchor={{ x: 0.5, y: 0.5 }}
                icon={
                  iconeLocalizacaoUsuarioUri
                    ? { uri: iconeLocalizacaoUsuarioUri }
                    : undefined
                }
                tracksViewChanges={
                  iconeLocalizacaoUsuarioUri
                    ? false
                    : rastrearAlteracoesDosMarcadores
                }
              >
                {iconeLocalizacaoUsuarioUri ? null : (
                  <View collapsable={false} style={styles.userLocationMarker}>
                    <View style={styles.userLocationPulse} />
                    <View style={styles.userLocationDot} />
                  </View>
                )}
              </Marker>
            ) : null}

            {visibleStations.map((item) => {
              const stationId = getStationId(item.station, item.index);
              const markerColor = getStationMarkerColor(item.station, colors);
              const markerContentColor = "#FCFEFA";
              const markerIconUri = iconesDeMarcadorPorCor[markerColor];

              return (
                <Marker
                  key={stationId}
                  coordinate={{
                    latitude: item.station.latitude,
                    longitude: item.station.longitude,
                  }}
                  title={getStationName(item.station)}
                  description={`${getStationStatus(item.station)} • ${getStationPower(item.station)}`}
                  onPress={() => openStationDetails(stationId)}
                  anchor={{ x: 0.5, y: 0.5 }}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={`Abrir ficha de ${getStationNameById(stationId)}`}
                  accessibilityHint="Mostra detalhes, disponibilidade e comodidades do ponto."
                  icon={markerIconUri ? { uri: markerIconUri } : undefined}
                  tracksViewChanges={
                    markerIconUri ? false : rastrearAlteracoesDosMarcadores
                  }
                >
                  {markerIconUri ? null : (
                    <View
                      collapsable={false}
                      style={[
                        styles.realMapMarker,
                        {
                          backgroundColor: markerColor,
                          borderColor: markerContentColor,
                        },
                      ]}
                    >
                      <Plug
                        size={19}
                        color={markerContentColor}
                        strokeWidth={2.4}
                      />
                    </View>
                  )}
                </Marker>
              );
            })}
          </MapView>

          <View
            pointerEvents="none"
            style={[
              styles.mapTintOverlay,
              usarMapaEscuro ? styles.mapTintOverlayDark : null,
            ]}
          />

          <View pointerEvents="box-none" style={styles.fixedMapControls}>
            <View style={styles.zoomPill}>
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel="Aumentar zoom do mapa"
                accessibilityHint="Aproxima a visualização do mapa."
                pressedScale={0.92}
                style={[
                  styles.zoomPillButton,
                  controleMapaAtivo === "aproximar"
                    ? styles.zoomPillButtonActive
                    : null,
                ]}
                onPressIn={() => setControleMapaAtivo("aproximar")}
                onPressOut={() => setControleMapaAtivo(null)}
                onPress={() => alterarZoomMapa("aproximar")}
              >
                <Text style={styles.mapControlText}>+</Text>
              </PressableScale>

              <View style={styles.zoomPillDivider} />

              <PressableScale
                accessibilityRole="button"
                accessibilityLabel="Diminuir zoom do mapa"
                accessibilityHint="Afasta a visualização do mapa."
                pressedScale={0.92}
                style={[
                  styles.zoomPillButton,
                  controleMapaAtivo === "afastar"
                    ? styles.zoomPillButtonActive
                    : null,
                ]}
                onPressIn={() => setControleMapaAtivo("afastar")}
                onPressOut={() => setControleMapaAtivo(null)}
                onPress={() => alterarZoomMapa("afastar")}
              >
                <Text style={styles.mapControlText}>−</Text>
              </PressableScale>
            </View>

            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Centralizar localização na FIAP"
              accessibilityHint="Centraliza o mapa em uma localização próxima à FIAP."
              accessibilityState={{ busy: isLocatingUser }}
              pressedScale={0.94}
              style={[
                styles.mapControlButton,
                controleMapaAtivo === "centralizar"
                  ? styles.mapControlButtonActive
                  : null,
                isLocatingUser ? styles.mapControlButtonLoading : null,
              ]}
              onPressIn={() => setControleMapaAtivo("centralizar")}
              onPressOut={() => setControleMapaAtivo(null)}
              onPress={centralizarLocalizacaoUsuario}
              disabled={isLocatingUser}
            >
              <Crosshair size={25} color={colors.primary} strokeWidth={2.2} />
            </PressableScale>
          </View>

          <Animated.View
            style={[
              styles.bottomSheet,
              {
                left: margemHorizontalSheet,
                right: margemHorizontalSheet,
                transform: [{ translateY: sheetTranslateY }],
              },
            ]}
            onLayout={(event) => {
              setSheetHeight(event.nativeEvent.layout.height);
            }}
          >
            <PressableScale
              accessibilityRole="button"
              accessibilityLabel="Minimizar melhores escolhas para ver o mapa inteiro"
              accessibilityHint="Esconde completamente o painel, deixando só um atalho para trazê-lo de volta."
              hitSlop={{ top: 10, right: 44, bottom: 10, left: 44 }}
              pressedScale={0.94}
              style={styles.sheetHandleArea}
              onPress={() => {
                setHasInteractedWithSheet(true);
                ocultarPainelDePontosCompletamente();
              }}
            >
              <Animated.View
                style={{ transform: [{ translateY: sheetHintTranslateY }] }}
              >
                <View style={styles.sheetChevronButton}>
                  {renderizarChevronDeControle(isSheetCollapsed)}
                </View>
              </Animated.View>
            </PressableScale>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{sheetTitle}</Text>
            </View>

            {hasNoResults ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyTitle}>
                  Não encontramos pontos com esses critérios.
                </Text>

                <Text style={styles.emptyText}>
                  Tente limpar alguns filtros ou buscar por outro endereço.
                </Text>

                <PressableScale
                  accessibilityRole="button"
                  accessibilityLabel="Ajustar busca"
                  style={styles.emptyButton}
                  onPress={abrirBusca}
                >
                  <Text style={styles.emptyButtonText}>Ajustar busca</Text>
                </PressableScale>
              </View>
            ) : (
              <ScrollView
                style={[
                  styles.pointsScroll,
                  { maxHeight: alturaMaximaListaPontos },
                ]}
                contentContainerStyle={styles.pointsScrollContent}
                showsVerticalScrollIndicator={points.length > 3}
                nestedScrollEnabled
              >
                {points.map((point) => {
                  const CriterioIcon = point.criterioIcon;
                  const IconeAlcance = obterIconeDoAlcance(point.alcance.nivel);
                  const corAlcance = obterCorDoAlcance(
                    point.alcance.nivel,
                    colors,
                  );
                  const corFundoAlcance = obterFundoDoAlcance(
                    point.alcance.nivel,
                    colors,
                  );
                  const textoAlcance = obterRotuloDoAlcance(point.alcance.nivel);
                  const legendaAlcance =
                    point.alcance.nivel === "foraDeAlcance"
                      ? `Fora do alcance atual, faltariam ${point.alcance.kmFaltantes} km`
                      : `Chegada estimada com ${point.alcance.bateriaAoChegarPercent}% de bateria`;

                  return (
                    <PressableScale
                      key={`${point.id}-${point.stationId}`}
                      accessibilityRole="button"
                      accessibilityLabel={`${point.nomeEstacao}. ${point.criterioLabel}. ${point.address}. ${point.status}. Nota ${point.rating}. ${point.power}. ${legendaAlcance}.`}
                      accessibilityHint="Abre a ficha detalhada do ponto de recarga."
                      style={styles.pointCard}
                      onPress={() => openStationDetails(point.stationId)}
                    >
                      <View style={styles.pointCardTopRow}>
                        <View style={styles.pointBadge}>
                          <CriterioIcon
                            size={12}
                            color={colors.primary}
                            strokeWidth={2.4}
                          />
                          <Text style={styles.pointBadgeText}>
                            {point.criterioLabel}
                          </Text>
                        </View>

                        <ChevronRight
                          size={18}
                          color={colors.textLight}
                          strokeWidth={2.2}
                        />
                      </View>

                      <Text style={styles.pointStationName}>
                        {point.nomeEstacao}
                      </Text>
                      <Text style={styles.pointAddress}>{point.address}</Text>

                      <View style={styles.pointInlineMetaRow}>
                        <View style={styles.metaRow}>
                          <View
                            style={[
                              styles.statusDot,
                              { backgroundColor: point.statusColor },
                            ]}
                          />
                          <Text style={styles.metaText}>{point.status}</Text>
                        </View>

                        <View style={styles.metaRow}>
                          <Star
                            size={12}
                            color={colors.yellowDark}
                            fill={colors.yellowDark}
                            strokeWidth={2}
                          />
                          <Text style={styles.metaText}>{point.rating}</Text>
                        </View>

                        <View style={styles.metaRow}>
                          <Zap
                            size={12}
                            color={colors.textLight}
                            fill={colors.textLight}
                            strokeWidth={2}
                          />
                          <Text style={styles.metaText}>{point.power}</Text>
                        </View>
                      </View>

                      <View
                        style={[
                          styles.pointAutonomiaChip,
                          { backgroundColor: corFundoAlcance },
                        ]}
                      >
                        <IconeAlcance
                          size={13}
                          color={corAlcance}
                          strokeWidth={2.4}
                        />

                        <Text
                          style={[
                            styles.pointAutonomiaChipText,
                            { color: corAlcance },
                          ]}
                        >
                          {textoAlcance}
                        </Text>
                      </View>
                    </PressableScale>
                  );
                })}
              </ScrollView>
            )}
          </Animated.View>

          {painelTotalmenteOculto ? (
            <View
              pointerEvents="box-none"
              style={styles.restaurarPainelWrapper}
            >
              <PressableScale
                accessibilityRole="button"
                accessibilityLabel="Mostrar melhores escolhas"
                accessibilityHint="Traz de volta a lista de pontos recomendados."
                pressedScale={0.94}
                style={styles.restaurarPainelPill}
                onPress={() => alternarModalDePontos(false)}
              >
                <Maximize2 size={16} color={colors.primary} strokeWidth={2.3} />
                <Text style={styles.restaurarPainelPillText}>
                  Melhores escolhas
                </Text>
              </PressableScale>
            </View>
          ) : null}
        </View>
        <LoadingOverlay
          visible={isOpeningDetails}
          message="Abrindo detalhes..."
        />

        {mapFeedbackMessage ? (
          <View pointerEvents="none" style={styles.feedbackToastOverlay}>
            <View style={styles.feedbackToastCard}>
              <Crosshair size={18} color={colors.primary} strokeWidth={2.4} />
              <Text style={styles.feedbackToastText}>{mapFeedbackMessage}</Text>
            </View>
          </View>
        ) : null}

        {seletorBateriaAberto ? (
          <View style={styles.batterySheetOverlay}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar seletor de bateria"
              style={styles.batterySheetBackdrop}
              onPress={() => setSeletorBateriaAberto(false)}
            />

            <View style={styles.batterySheetCard}>
              <View style={styles.batterySheetHandle} />

              <View style={styles.batterySheetHeaderRow}>
                <View
                  style={[
                    styles.batterySheetPreviewIcon,
                    { backgroundColor: corBateriaAtual + "1F" },
                  ]}
                >
                  <IconeBateriaAtual
                    size={26}
                    color={corBateriaAtual}
                    strokeWidth={2.4}
                  />
                </View>

                <View style={styles.batterySheetHeaderText}>
                  <Text style={styles.batterySheetTitle}>
                    Bateria do veículo
                  </Text>
                  <Text style={styles.batterySheetSubtitle}>
                    ≈{autonomiaAtualKm} km de autonomia agora
                  </Text>
                </View>
              </View>

              <View style={styles.batterySheetOptionsRow}>
                {NIVEIS_DE_BATERIA_VEICULO.map((percentual) => {
                  const OpcaoIcone = obterIconeDeBateriaAtual(percentual);
                  const corOpcao = obterCorDeBateriaAtual(percentual, colors);
                  const selecionado = percentual === batteryPercent;
                  const kmDaOpcao = Math.round(
                    (vehicleRangeKm * percentual) / 100,
                  );

                  return (
                    <PressableScale
                      key={percentual}
                      accessibilityRole="button"
                      accessibilityLabel={`Definir bateria em ${percentual} por cento, cerca de ${kmDaOpcao} quilômetros`}
                      accessibilityState={{ selected: selecionado }}
                      pressedScale={0.92}
                      style={[
                        styles.batterySheetOption,
                        { borderColor: corOpcao },
                        selecionado
                          ? {
                              backgroundColor: corOpcao,
                              borderColor: corOpcao,
                            }
                          : null,
                      ]}
                      onPress={() => selecionarNivelDeBateria(percentual)}
                    >
                      <OpcaoIcone
                        size={18}
                        color={selecionado ? colors.white : corOpcao}
                        strokeWidth={2.4}
                      />

                      <Text
                        style={[
                          styles.batterySheetOptionText,
                          selecionado
                            ? styles.batterySheetOptionTextActive
                            : { color: corOpcao },
                        ]}
                      >
                        {percentual}%
                      </Text>
                    </PressableScale>
                  );
                })}
              </View>
            </View>
          </View>
        ) : null}
      </ScreenTransition>
    </SafeAreaView>
  );
}
