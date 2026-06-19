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
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  type Region,
} from "react-native-maps";
import { SvgXml } from "react-native-svg";
import { router, type Href, useLocalSearchParams } from "expo-router";
import {
  ChevronRight,
  Clock,
  Coffee,
  Crosshair,
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
import {
  LoadingOverlay,
  PressableScale,
  ScreenTransition,
} from "../../components";
import baseStyles, { colors as baseColors } from "./styles";
import { useTelaComPreferencias } from "../../hooks/useTelaComPreferencias";

const FEEDBACK_DURATION = 1500;
const SHEET_VISIBLE_HANDLE = 30;
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
  { id: "open", title: "Aberto agora", icon: Clock },
];

type Station = (typeof chargingStations)[number];

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};
type MapColorTokens = typeof baseColors & {
  dangerBorder?: string;
  success?: string;
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
    filters.onlyOpenNow
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

const getStationDistance = (station: Station, index: number) => {
  const customLabel = readString(station, "distanceLabel");

  if (customLabel) {
    return customLabel;
  }

  const distance = getStationDistanceNumber(station, index);

  if (distance < 1) {
    return `2 min · ${Math.round(distance * 1000)} m`;
  }

  return `${distance.toFixed(1).replace(".", ",")} km`;
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
): Region => {
  const latitudeDelta = aproxima ? 0.014 : 0.026;
  const longitudeDelta = aproxima ? 0.014 : 0.026;

  return {
    latitude: latitude - latitudeDelta * 0.08,
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

const getComfortMeta = (station: Station) => {
  const amenities = getStationAmenities(station);
  const labels: Record<string, string> = {
    restaurant: "Restaurante",
    coffee: "Café",
    restroom: "Banheiro",
    parking: "Estacionamento",
    coveredarea: "Área coberta",
    market: "Mercado",
    wifi: "Wi-Fi",
    security: "Segurança",
  };

  const firstAmenity = amenities[0];

  if (!firstAmenity) {
    return "Conforto";
  }

  return labels[firstAmenity] ?? firstAmenity;
};

const criarMetaDoCard = (cardId: string, station: Station, index: number) => {
  if (cardId === "best") {
    return getStationRating(station);
  }

  if (cardId === "comfort") {
    return getComfortMeta(station);
  }

  if (cardId === "fast") {
    return getStationPower(station);
  }

  if (cardId === "open") {
    return getStationStatus(station);
  }

  return getStationDistance(station, index);
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

const stationMatchesSearch = (station: Station, query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  const searchableContent = [
    getStationName(station),
    getStationAddress(station),
    readString(station, "neighborhood"),
    readString(station, "city"),
    getStationConnectors(station).join(" "),
  ]
    .join(" ")
    .toLowerCase();

  return searchableContent.includes(normalizedQuery);
};

const stationMatchesFilters = (
  station: Station,
  index: number,
  filters: StationFilters,
) => {
  const connectors = getStationConnectors(station);
  const amenities = getStationAmenities(station);
  const stationStatus = getRawStationStatus(station);
  const stationPower = getStationPowerNumber(station);
  const stationRating = getStationRatingNumber(station);
  const stationDistance = getStationDistanceNumber(station, index);

  const matchesConnector =
    filters.connectorTypes.length === 0 ||
    filters.connectorTypes.some((connectorType) =>
      connectors.some((connector) =>
        connector.includes(connectorType.toLowerCase()),
      ),
    );

  const matchesStatus =
    filters.statuses.length === 0 ||
    filters.statuses.some((status) => stationStatus === status);

  const matchesAmenities =
    filters.amenities.length === 0 ||
    filters.amenities.every((amenity) =>
      amenities.includes(amenity.toLowerCase()),
    );

  const matchesPower = stationPower >= filters.power.minKw;
  const matchesDistance = stationDistance <= filters.distance.maxKm;
  const matchesRating = stationRating >= filters.rating.minRating;
  const matchesOpenNow =
    !filters.onlyOpenNow ||
    (stationIsOpenNow(station) && stationHasAvailableCharger(station));

  return (
    matchesConnector &&
    matchesStatus &&
    matchesAmenities &&
    matchesPower &&
    matchesDistance &&
    matchesRating &&
    matchesOpenNow
  );
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

export default function HomeMapScreen() {
  const { styles, colors, isDarkMode } = useTelaComPreferencias(
    baseStyles,
    baseColors,
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
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(0);
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
    return Math.max(sheetHeight - SHEET_VISIBLE_HANDLE, 280);
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
        icon: Clock,
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
    const estacoesFiltradas = chargingStations
      .map((station, index) => ({ station, index }))
      .filter((item) => stationMatchesSearch(item.station, searchTerm))
      .filter((item) =>
        stationMatchesFilters(item.station, item.index, filtrosDoMapa),
      );

    return ordenarPorFiltrosRapidos(estacoesFiltradas, filtrosRapidos);
  }, [filtrosDoMapa, filtrosRapidos, searchTerm]);

  const points = useMemo(() => {
    return visibleStations.map((item, cardIndex) => {
      const label = pointLabels[cardIndex];
      const cardId = label?.id ?? `station-${cardIndex}`;

      return {
        id: cardId,
        stationId: getStationId(item.station, item.index),
        title: label?.title ?? getStationName(item.station),
        address: getStationAddress(item.station),
        status: getStationStatus(item.station),
        statusColor: getStationMarkerColor(item.station, colors),
        meta: criarMetaDoCard(cardId, item.station, item.index),
        power: getStationPower(item.station),
        icon: label?.icon ?? Zap,
      };
    });
  }, [colors, visibleStations]);

  const hasNoResults = visibleStations.length === 0;
  const hasSearchTerm = searchTerm.trim().length > 0;

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
      );
    }

    return criarRegiaoDoMapa(firstVisibleStation, false);
  }, [hasFiltersApplied, hasSearchTerm, localizacaoUsuario, visibleStations]);

  useEffect(() => {
    currentMapRegionRef.current = mapRegion;
    mapRef.current?.animateToRegion(mapRegion, 450);
  }, [mapRegion]);

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
    ? "Nenhum ponto encontrado"
    : "Melhores escolhas";

  const alternarModalDePontos = useCallback(
    (shouldCollapse: boolean) => {
      const nextValue = shouldCollapse ? sheetCollapsedTranslateY : 0;

      setIsSheetCollapsed(shouldCollapse);
      sheetPositionRef.current = nextValue;

      Animated.spring(sheetTranslateY, {
        toValue: nextValue,
        useNativeDriver: true,
        friction: 8,
        tension: 58,
      }).start();
    },
    [sheetCollapsedTranslateY, sheetTranslateY],
  );

  useEffect(() => {
    if (isSheetCollapsed && sheetHeight > 0) {
      sheetTranslateY.setValue(sheetCollapsedTranslateY);
      sheetPositionRef.current = sheetCollapsedTranslateY;
    }
  }, [
    isSheetCollapsed,
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
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          atalhosRapidosAbertos
            ? "Recolher atalhos de filtro"
            : "Mostrar atalhos de filtro"
        }
        accessibilityHint="Toque para abrir ou recolher os filtros rápidos do mapa."
        accessibilityState={{ expanded: atalhosRapidosAbertos }}
        hitSlop={{ top: 8, right: 32, bottom: 8, left: 32 }}
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
      </Pressable>
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
      criarRegiaoComFocoVisivel(nextLocation.latitude, nextLocation.longitude),
      500,
    );

    showLocationFeedback("Localização centralizada na FIAP");

    setTimeout(() => {
      setIsLocatingUser(false);
    }, 450);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      <ScreenTransition style={styles.screen}>
        <View style={styles.topArea}>
          <View style={styles.header}>
            <SvgXml xml={logoFluiDoTema} width={76} height={36} />

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
                    <Pressable
                      key={filter.id}
                      accessibilityRole="button"
                      accessibilityLabel={`${filter.label}${filter.active ? ", filtro ativo" : ""}`}
                      accessibilityHint="Filtra os pontos do mapa em tempo real."
                      accessibilityState={{ selected: filter.active }}
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
                    </Pressable>
                  );
                })}
              </ScrollView>
            </Animated.View>

            {atalhosRapidosAbertos ? renderizarPuxadorDeAtalhos() : null}
          </View>
        </View>

        <View style={styles.mapArea}>
          <MapView
            ref={mapRef}
            style={styles.realMap}
            provider={PROVIDER_DEFAULT}
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
              >
                <View style={styles.userLocationMarker}>
                  <View style={styles.userLocationPulse} />
                  <View style={styles.userLocationDot} />
                </View>
              </Marker>
            ) : null}

            {visibleStations.map((item) => {
              const stationId = getStationId(item.station, item.index);
              const markerColor = getStationMarkerColor(item.station, colors);
              const markerContentColor = "#FCFEFA";

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
                  anchor={{ x: 0.5, y: 1 }}
                  tracksViewChanges={false}
                >
                  <View
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel={`Abrir ficha de ${getStationNameById(stationId)}`}
                    accessibilityHint="Mostra detalhes, disponibilidade e comodidades do ponto."
                    style={styles.realMapMarker}
                  >
                    <View
                      style={[
                        styles.realMapMarkerTail,
                        { borderTopColor: markerColor },
                      ]}
                    />

                    <View
                      style={[
                        styles.realMapMarkerBody,
                        {
                          backgroundColor: markerColor,
                          borderColor: markerContentColor,
                        },
                      ]}
                    >
                      <Zap
                        size={19}
                        color={markerContentColor}
                        fill={markerContentColor}
                        strokeWidth={2.2}
                      />
                    </View>
                  </View>
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
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Aumentar zoom do mapa"
                accessibilityHint="Aproxima a visualização do mapa."
                style={styles.zoomPillButton}
                onPress={() => alterarZoomMapa("aproximar")}
              >
                <Text style={styles.mapControlText}>+</Text>
              </Pressable>

              <View style={styles.zoomPillDivider} />

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Diminuir zoom do mapa"
                accessibilityHint="Afasta a visualização do mapa."
                style={styles.zoomPillButton}
                onPress={() => alterarZoomMapa("afastar")}
              >
                <Text style={styles.mapControlText}>−</Text>
              </Pressable>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Centralizar localização na FIAP"
              accessibilityHint="Centraliza o mapa em uma localização próxima à FIAP."
              accessibilityState={{ busy: isLocatingUser }}
              style={[
                styles.mapControlButton,
                isLocatingUser ? styles.mapControlButtonLoading : null,
              ]}
              onPress={centralizarLocalizacaoUsuario}
              disabled={isLocatingUser}
            >
              <Crosshair size={25} color={colors.primary} strokeWidth={2.2} />
            </Pressable>
          </View>

          <Animated.View
            style={[
              styles.bottomSheet,
              { transform: [{ translateY: sheetTranslateY }] },
            ]}
            onLayout={(event) => {
              setSheetHeight(event.nativeEvent.layout.height);
            }}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                isSheetCollapsed ? "Puxar pontos para cima" : "Ocultar pontos"
              }
              accessibilityHint="Toque para abrir ou recolher a lista de pontos."
              hitSlop={{ top: 10, right: 44, bottom: 10, left: 44 }}
              style={styles.sheetHandleArea}
              onPress={() => {
                setHasInteractedWithSheet(true);
                alternarModalDePontos(!isSheetCollapsed);
              }}
            >
              <Animated.View
                style={{ transform: [{ translateY: sheetHintTranslateY }] }}
              >
                <View style={styles.sheetChevronButton}>
                  {renderizarChevronDeControle(isSheetCollapsed)}
                </View>
              </Animated.View>
            </Pressable>
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
                style={styles.pointsScroll}
                contentContainerStyle={styles.pointsScrollContent}
                showsVerticalScrollIndicator={points.length > 3}
                nestedScrollEnabled
              >
                {points.map((point) => {
                  const Icon = point.icon;
                  const isRating = point.id === "best";
                  const isComfort = point.id === "comfort";

                  return (
                    <PressableScale
                      key={`${point.id}-${point.stationId}`}
                      accessibilityRole="button"
                      accessibilityLabel={`${point.title}. ${point.address}. ${point.status}. ${point.power}.`}
                      accessibilityHint="Abre a ficha detalhada do ponto de recarga."
                      style={styles.pointCard}
                      onPress={() => openStationDetails(point.stationId)}
                    >
                      <View style={styles.pointIconCircle}>
                        <Icon
                          size={22}
                          color={colors.primary}
                          fill={isRating ? colors.primarySoft : "none"}
                          strokeWidth={2}
                        />
                      </View>

                      <View style={styles.pointInfo}>
                        <Text style={styles.pointTitle}>{point.title}</Text>
                        <Text style={styles.pointAddress}>{point.address}</Text>

                        <View style={styles.statusRow}>
                          <View
                            style={[
                              styles.statusDot,
                              { backgroundColor: point.statusColor },
                            ]}
                          />
                          <Text style={styles.statusText}>{point.status}</Text>
                        </View>
                      </View>

                      <View style={styles.pointMeta}>
                        <View style={styles.metaRow}>
                          {isRating ? (
                            <Star
                              size={14}
                              color={colors.yellowDark}
                              fill={colors.yellowDark}
                              strokeWidth={2}
                            />
                          ) : null}

                          {isComfort ? (
                            <Coffee
                              size={14}
                              color={colors.primary}
                              strokeWidth={2}
                            />
                          ) : null}

                          <Text style={styles.metaText}>
                            {String(point.meta)}
                          </Text>
                        </View>

                        <View style={styles.metaRow}>
                          <Zap
                            size={13}
                            color={colors.primary}
                            fill={colors.primary}
                            strokeWidth={2}
                          />

                          <Text style={styles.metaText}>
                            {String(point.power)}
                          </Text>
                        </View>
                      </View>

                      <ChevronRight
                        size={24}
                        color={colors.primary}
                        strokeWidth={2.2}
                      />
                    </PressableScale>
                  );
                })}
              </ScrollView>
            )}
          </Animated.View>
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
      </ScreenTransition>
    </SafeAreaView>
  );
}
