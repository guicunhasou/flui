import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { router, type Href, useLocalSearchParams } from "expo-router";
import {
  ChevronRight,
  Clock,
  Crosshair,
  Navigation,
  Plug,
  Search,
  SlidersHorizontal,
  Star,
  Toilet,
  User,
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
import styles, { colors } from "./styles";

const mapaFlui = require("../../../assets/images/mapa.png");

const FEEDBACK_DURATION = 1500;

const logoFluiXml = `
<svg width="1115" height="516" viewBox="0 0 1115 516" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" d="M706 14L702 11L694 9L660 6L659 5H649L648 4H637L636 3L606 2L605 1H582L581 0H524L523 1H505L504 2H491L490 3L464 5L428 11L407 16L372 27L367 30L355 34L308 58L269 84L212 128L181 148L155 161L120 174L92 181L55 187L19 188L17 189L14 193V202L12 209L11 222L2 268L0 273V278L3 281H67L69 283L55 309L49 324L43 345L40 362V395L42 407L49 430L62 454L69 463L86 480L106 494L124 503L138 508L171 515L200 516L201 515H212L231 512L265 501L281 493L295 484L305 476L324 457L336 441L348 419L357 393L361 368L360 336L356 317L350 300L342 285V282L343 281H410L412 280L415 276L426 236L428 233L430 224L440 197V192L435 188H305L304 187L305 184L314 173L337 151L367 131L403 115L442 104L477 98L507 96L508 95H526L527 94H578L579 95H600L601 96L628 97L639 99H654L658 96L670 78L706 29L708 25V18L706 14ZM425 436L426 437V452L430 472L434 482L444 496L456 505L469 510L480 512L506 511L523 506L536 500L560 483L583 460L592 448L594 449V457L597 471L604 486L612 496L623 504L638 510L649 512H667L683 508L692 504L705 495L727 473L751 439L765 415L766 416L765 420V449L767 462L773 481L779 491L788 500L805 509L821 512H838L853 509L871 501L883 493L897 481L928 445L929 446V456L931 468L934 477L943 493L953 502L964 508L980 512H1000L1014 509L1034 500L1048 490L1066 473L1076 461L1088 444L1100 423L1115 387L1114 379L1111 376L1105 375L1102 377L1090 399L1076 421L1054 448L1043 458L1032 464H1025L1020 459L1018 453V443L1025 413L1048 350L1093 241V231L1085 223L1071 218L1050 215H1033L1032 216L1018 217L1009 220L1000 225L991 234L984 247L963 303L943 362L933 397L917 422L906 436L884 457L870 464H863L857 460L854 451L855 435L859 419L875 374L903 306L925 258L926 250L924 245L918 240L908 237L893 236L892 235H859L841 239L828 246L817 257L810 267L796 298L774 356L740 417L727 436L708 457L699 463L691 464L685 459L683 454V440L687 420L715 341L745 267L752 253V244L748 238L741 234L723 230L677 229L661 233L653 237L647 242L638 254L634 263L611 334L610 341L602 367L594 408L574 433L556 450L545 458L535 463L520 464L513 457L512 445L515 428L523 399L540 350L570 274L571 269L618 155L619 144L616 140L612 138H513L509 140L505 149L501 163L497 171L495 179L473 237L447 316L431 380L426 414L425 436ZM228 287L240 292L252 300L262 310L271 324L276 338L278 348L277 371L271 390L258 411L242 427L222 439L206 444L193 446L173 445L159 441L143 432L132 422L123 409L119 400L115 385V362L120 343L126 331L136 317L147 306L163 295L182 287L197 284H214L228 287Z" fill="#2B0055"/>
  <path d="M1064.4 192C1091.74 192 1113.9 169.838 1113.9 142.5C1113.9 115.162 1091.74 93 1064.4 93C1037.06 93 1014.9 115.162 1014.9 142.5C1014.9 169.838 1037.06 192 1064.4 192Z" fill="#9B35F5"/>
</svg>
`;

const markers = [
  { id: "1", type: "zap", top: "18%", left: "24%" },
  { id: "2", type: "zap", top: "13%", left: "55%" },
  { id: "3", type: "zap", top: "31%", left: "72%" },
  { id: "4", type: "zap", top: "48%", left: "42%" },
  { id: "5", type: "zap", top: "53%", left: "76%" },
  { id: "6", type: "plug", top: "38%", left: "26%" },
  { id: "7", type: "plug", top: "20%", left: "72%" },
] as const;

const pointLabels = [
  { id: "near", title: "Mais próximo", icon: Navigation },
  { id: "best", title: "Melhor avaliado", icon: Star },
  { id: "comfort", title: "Mais confortável", icon: Toilet },
];

type Station = (typeof chargingStations)[number];

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

const stationIsOpenNow = (station: Station) => {
  const status = getRawStationStatus(station);

  return status === "available" || status === "busy";
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
  const matchesOpenNow = !filters.onlyOpenNow || stationIsOpenNow(station);

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

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export default function HomeMapScreen() {
  const routeParams = useLocalSearchParams();
  const filtersParam = routeParams.filters;
  const pan = useRef(new Animated.ValueXY()).current;

  const lastMapPosition = useRef({ x: 0, y: 0 });
  const currentMapPosition = useRef({ x: 0, y: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpeningDetails, setIsOpeningDetails] = useState(false);
  const [mapFeedbackMessage, setMapFeedbackMessage] = useState<string | null>(
    null,
  );

  const mapFeedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const [mapViewport, setMapViewport] = useState({
    width: 390,
    height: 560,
  });

  const appliedFilters = useMemo(() => {
    return parseRouteFilters(filtersParam);
  }, [filtersParam]);

  const hasFiltersApplied = useMemo(() => {
    return hasActiveFilters(appliedFilters);
  }, [appliedFilters]);

  const filterChips = useMemo(() => {
    return [
      {
        label: "Aberto agora",
        icon: Clock,
        active: appliedFilters.onlyOpenNow,
      },
      {
        label: "CCS2",
        icon: Plug,
        active: appliedFilters.connectorTypes.includes("ccs2"),
      },
      {
        label: "Rápido",
        icon: Zap,
        active: appliedFilters.power.minKw >= 50,
      },
      {
        label: "Com banheiro",
        icon: Toilet,
        active: appliedFilters.amenities.includes("restroom"),
      },
    ];
  }, [appliedFilters]);

  const visibleStations = useMemo(() => {
    return chargingStations
      .map((station, index) => ({ station, index }))
      .filter((item) => stationMatchesSearch(item.station, searchTerm))
      .filter((item) =>
        stationMatchesFilters(item.station, item.index, appliedFilters),
      );
  }, [appliedFilters, searchTerm]);

  const points = useMemo(() => {
    return visibleStations.slice(0, 3).map((item, cardIndex) => {
      const label = pointLabels[cardIndex] ?? pointLabels[0];

      return {
        id: label.id,
        stationId: getStationId(item.station, item.index),
        title: label.title,
        address: getStationAddress(item.station),
        status: getStationStatus(item.station),
        meta:
          label.id === "best"
            ? getStationRating(item.station)
            : label.id === "comfort"
              ? getComfortMeta(item.station)
              : getStationDistance(item.station, item.index),
        power: getStationPower(item.station),
        icon: label.icon,
      };
    });
  }, [visibleStations]);

  const visibleMarkers = useMemo(() => {
    return visibleStations
      .slice(0, markers.length)
      .map((item, index) => {
        const marker = markers[index];

        if (!marker) {
          return null;
        }

        return {
          ...marker,
          stationId: getStationId(item.station, item.index),
        };
      })
      .filter((marker) => marker !== null);
  }, [visibleStations]);

  const hasNoResults = visibleStations.length === 0;
  const hasSearchTerm = searchTerm.trim().length > 0;

  const sheetTitle = hasNoResults
    ? "Nenhum ponto encontrado"
    : hasFiltersApplied || hasSearchTerm
      ? "Pontos encontrados"
      : "Melhores pontos perto de você";

  const mapSize = useMemo(() => {
    return Math.max(mapViewport.width * 2.15, mapViewport.height * 1.35);
  }, [mapViewport.height, mapViewport.width]);

  const mapLimits = useMemo(() => {
    return {
      minX: mapViewport.width - mapSize,
      maxX: 0,
      minY: mapViewport.height - mapSize,
      maxY: 0,
    };
  }, [mapSize, mapViewport.height, mapViewport.width]);

  useEffect(() => {
    const centeredPosition = {
      x: (mapViewport.width - mapSize) / 2,
      y: (mapViewport.height - mapSize) / 2,
    };

    pan.setValue(centeredPosition);
    lastMapPosition.current = centeredPosition;
    currentMapPosition.current = centeredPosition;
  }, [mapSize, mapViewport.height, mapViewport.width, pan]);

  useEffect(() => {
    return () => {
      if (mapFeedbackTimeoutRef.current) {
        clearTimeout(mapFeedbackTimeoutRef.current);
      }
    };
  }, []);

  const panResponder = useMemo(() => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dx) > 3 || Math.abs(gesture.dy) > 3;
      },
      onPanResponderMove: (_, gesture) => {
        const nextPosition = {
          x: clamp(
            lastMapPosition.current.x + gesture.dx,
            mapLimits.minX,
            mapLimits.maxX,
          ),
          y: clamp(
            lastMapPosition.current.y + gesture.dy,
            mapLimits.minY,
            mapLimits.maxY,
          ),
        };

        pan.setValue(nextPosition);
        currentMapPosition.current = nextPosition;
      },
      onPanResponderRelease: () => {
        lastMapPosition.current = currentMapPosition.current;
      },
      onPanResponderTerminate: () => {
        lastMapPosition.current = currentMapPosition.current;
      },
    });
  }, [mapLimits.maxX, mapLimits.maxY, mapLimits.minX, mapLimits.minY, pan]);

  const handleMapLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;

    setMapViewport((current) => {
      const sameWidth = Math.abs(current.width - width) < 1;
      const sameHeight = Math.abs(current.height - height) < 1;

      if (sameWidth && sameHeight) {
        return current;
      }

      return { width, height };
    });
  };

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

  const openFilters = () => {
    router.push("/filters" as Href);
  };

  const openProfile = () => {
    router.push("/profile" as Href);
  };

  const showLocationFeedback = () => {
    if (mapFeedbackTimeoutRef.current) {
      clearTimeout(mapFeedbackTimeoutRef.current);
    }

    setMapFeedbackMessage("Localização em breve");

    mapFeedbackTimeoutRef.current = setTimeout(() => {
      setMapFeedbackMessage(null);
    }, FEEDBACK_DURATION);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <ScreenTransition style={styles.screen}>
        <View style={styles.topArea}>
          <View style={styles.header}>
            <SvgXml xml={logoFluiXml} width={76} height={36} />

            <PressableScale style={styles.profileButton} onPress={openProfile}>
              <User size={22} color={colors.primary} strokeWidth={2} />
            </PressableScale>
          </View>

          <View style={styles.searchBar}>
            <Search size={21} color={colors.textMuted} strokeWidth={2} />

            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Buscar endereço ou lugar"
              placeholderTextColor={colors.textMuted}
              style={styles.searchText}
              returnKeyType="search"
            />

            <View style={styles.searchDivider} />

            <PressableScale style={styles.filterButton} onPress={openFilters}>
              <SlidersHorizontal
                size={21}
                color={colors.primary}
                strokeWidth={2}
              />
            </PressableScale>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContent}
          >
            {filterChips.map((filter) => {
              const Icon = filter.icon;

              return (
                <Pressable
                  key={filter.label}
                  style={[
                    styles.chip,
                    filter.active ? styles.chipActive : null,
                  ]}
                  onPress={openFilters}
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
        </View>

        <View
          style={styles.mapArea}
          onLayout={handleMapLayout}
          {...panResponder.panHandlers}
        >
          <Animated.View
            style={[
              styles.mapCanvas,
              {
                width: mapSize,
                height: mapSize,
                transform: pan.getTranslateTransform(),
              },
            ]}
          >
            <Image source={mapaFlui} style={styles.mapImage} />

            {visibleMarkers.map((marker) => {
              if (marker.type === "plug") {
                return (
                  <Pressable
                    key={marker.id}
                    onPress={() => openStationDetails(marker.stationId)}
                    style={[
                      styles.mapMarker,
                      styles.plugMarkerPosition,
                      { top: marker.top, left: marker.left },
                    ]}
                  >
                    <View style={styles.plugMarker}>
                      <Plug
                        size={18}
                        color={colors.primary}
                        strokeWidth={2.2}
                      />
                    </View>
                  </Pressable>
                );
              }

              return (
                <Pressable
                  key={marker.id}
                  onPress={() => openStationDetails(marker.stationId)}
                  style={[
                    styles.mapMarker,
                    { top: marker.top, left: marker.left },
                  ]}
                >
                  <View style={styles.pinBody}>
                    <Zap
                      size={20}
                      color={colors.white}
                      fill={colors.white}
                      strokeWidth={2.2}
                    />
                  </View>

                  <View style={styles.pinTip} />
                </Pressable>
              );
            })}

            <View style={styles.currentLocation}>
              <View style={styles.currentLocationHalo} />
              <View style={styles.currentLocationDot} />
            </View>
          </Animated.View>

          <View pointerEvents="box-none" style={styles.fixedMapControls}>
            <Pressable
              style={styles.mapControlButton}
              onPress={showLocationFeedback}
            >
              <Crosshair size={25} color={colors.primary} strokeWidth={2.2} />
            </Pressable>

            <Pressable
              style={styles.mapControlButton}
              onPress={showLocationFeedback}
            >
              <Navigation
                size={24}
                color={colors.primary}
                fill={colors.primarySoft}
                strokeWidth={2.2}
              />
            </Pressable>
          </View>

          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{sheetTitle}</Text>

              <View style={styles.starBadge}>
                <Star
                  size={20}
                  color={colors.yellowDark}
                  fill={colors.yellowDark}
                  strokeWidth={2}
                />
              </View>
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
                  style={styles.emptyButton}
                  onPress={openFilters}
                >
                  <Text style={styles.emptyButtonText}>Alterar filtros</Text>
                </PressableScale>
              </View>
            ) : (
              points.map((point) => {
                const Icon = point.icon;
                const isRating = point.id === "best";
                const isComfort = point.id === "comfort";

                return (
                  <PressableScale
                    key={`${point.id}-${point.stationId}`}
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
                        <View style={styles.statusDot} />
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
                          <Toilet
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
              })
            )}
          </View>
        </View>
        <LoadingOverlay
          visible={isOpeningDetails}
          message="Abrindo detalhes..."
        />
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
