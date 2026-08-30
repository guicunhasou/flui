import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, type Href } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  AlarmClock,
  ArrowLeft,
  BatteryCharging,
  Car,
  ChevronRight,
  Clock3,
  Coffee,
  MapPin,
  Plug,
  RotateCcw,
  Search,
  ShieldCheck,
  Star,
  Toilet,
  Umbrella,
  Utensils,
  Wifi,
  X,
  Zap,
} from "lucide-react-native";

import { chargingStations } from "../../data/chargingStations";
import {
  amenityOptions,
  connectorOptions,
  defaultFilters,
} from "../../data/filterOptions";
import {
  Amenity,
  ConnectorType,
  StationFilters,
  StationStatus,
} from "../../types";
import { styles as baseStyles } from "./styles";
import { LoadingOverlay, ScreenTransition } from "../../components";
import { colors as baseColors } from "../../theme/colors";
import { useTelaComPreferencias } from "../../hooks/useTelaComPreferencias";
import { filtrarEstacoes } from "../../utils/filtrarEstacoes";
import { triggerImpact, type PressableVisualState } from "../../utils/interaction";

type IconeFiltro = typeof Search;

type ChipProps = {
  styles: typeof baseStyles;
  colors: typeof baseColors;
  label: string;
  Icone?: IconeFiltro;
  selected: boolean;
  onPress: () => void;
  size?: "small" | "medium" | "large";
};

const initialFilters: StationFilters = {
  ...defaultFilters,
  power: {
    ...defaultFilters.power,
  },
  distance: {
    ...defaultFilters.distance,
  },
  rating: {
    ...defaultFilters.rating,
  },
};

const visibleConnectorOptions = connectorOptions
  .filter((option) => ["ccs2", "chademo", "type2", "gbt"].includes(option.value))
  .map((option) => ({
    ...option,
    label: option.value === "type2" ? "Tipo 2" : option.label,
  }));

const visibleAmenityOptions = amenityOptions
  .filter((option) =>
    [
      "restroom",
      "coffee",
      "restaurant",
      "parking",
      "coveredArea",
      "wifi",
    ].includes(option.value),
  )
  .map((option) => {
    const labels: Record<string, string> = {
      restroom: "Banheiro",
      coffee: "Café",
      restaurant: "Restaurante",
      parking: "Estacionamento",
      coveredArea: "Área coberta",
      wifi: "Wi-Fi",
    };

    return {
      ...option,
      label: labels[option.value] ?? option.label,
    };
  });

const powerOptions = [22, 50, 100, 150, 250];
const ratingOptions = [4, 4.5];
const distanceOptions = [0.5, 1, 5];
const sugestoesRapidas = [
  "Paulista",
  "Vila Mariana",
  "Higienópolis",
  "Jardins",
  "Liberdade",
  "Cambuci",
];

function toggleArrayValue<TValue extends string>(
  currentValues: TValue[],
  selectedValue: TValue,
) {
  const alreadySelected = currentValues.includes(selectedValue);

  if (alreadySelected) {
    return currentValues.filter((value) => value !== selectedValue);
  }

  return [...currentValues, selectedValue];
}

function getConnectorIcone(_value: ConnectorType) {
  return Plug;
}

function getAmenityIcone(value: Amenity) {
  const icones: Record<Amenity, IconeFiltro> = {
    restaurant: Utensils,
    coffee: Coffee,
    restroom: Toilet,
    parking: Car,
    coveredArea: Umbrella,
    market: MapPin,
    wifi: Wifi,
    security: ShieldCheck,
  };

  return icones[value];
}

function formatDistanceLabel(distance: number) {
  if (distance < 1) {
    return `${distance * 1000} m`;
  }

  return `${distance} km`;
}

function Chip({
  styles,
  colors,
  label,
  Icone,
  selected,
  onPress,
  size = "medium",
}: ChipProps) {
  const corIcone = selected ? colors.white : colors.primaryDark;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}${selected ? ", selecionado" : ""}`}
      accessibilityHint="Toque para ajustar este critério de busca."
      accessibilityState={{ selected }}
      style={({ pressed, hovered }: PressableVisualState) => [
        styles.chip,
        styles[`${size}Chip`],
        selected ? styles.selectedChip : null,
        hovered && !pressed ? styles.hoverFeedback : null,
        pressed ? styles.pressedChip : null,
      ]}
      onPress={() => {
        triggerImpact();
        onPress();
      }}
    >
      {Icone ? (
        <Icone
          color={corIcone}
          size={19}
          strokeWidth={2.3}
          style={styles.chipIconSvg}
        />
      ) : null}

      <Text
        style={[styles.chipText, selected ? styles.selectedChipText : null]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function FiltersScreen() {
  const { styles, colors, isDarkMode } = useTelaComPreferencias(
    baseStyles,
    baseColors,
  );
  const [filters, setFilters] = useState<StationFilters>(initialFilters);
  const [termoBusca, setTermoBusca] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const pontosEncontrados = filtrarEstacoes({
    estacoes: chargingStations,
    filtros: filters,
    termoBusca,
  });
  const textoBotaoMapa =
    pontosEncontrados.length === 1
      ? "Ver 1 ponto no mapa"
      : `Ver ${pontosEncontrados.length} pontos no mapa`;

  function handleToggleConnector(connectorType: ConnectorType) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      connectorTypes: toggleArrayValue(
        currentFilters.connectorTypes,
        connectorType,
      ),
    }));
  }

  function handleSelectPower(minKw: number) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      power: {
        minKw: currentFilters.power.minKw === minKw ? 0 : minKw,
      },
    }));
  }

  function handleToggleOpenNow() {
    setFilters((currentFilters) => ({
      ...currentFilters,
      onlyOpenNow: !currentFilters.onlyOpenNow,
    }));
  }

  function handleToggleOpen24h() {
    setFilters((currentFilters) => ({
      ...currentFilters,
      onlyOpen24h: !currentFilters.onlyOpen24h,
    }));
  }

  function handleToggleAvailableChargers() {
    const availableStatus: StationStatus = "available";

    setFilters((currentFilters) => ({
      ...currentFilters,
      statuses: toggleArrayValue(currentFilters.statuses, availableStatus),
    }));
  }

  function handleToggleAmenity(amenity: Amenity) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      amenities: toggleArrayValue(currentFilters.amenities, amenity),
    }));
  }

  function handleSelectRating(minRating: number) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      rating: {
        minRating,
      },
    }));
  }

  function handleSelectDistance(maxKm: number) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      distance: {
        maxKm,
      },
    }));
  }

  function handleClearFilters() {
    setFilters(defaultFilters);
    setTermoBusca("");
  }

  function selecionarSugestao(sugestao: string) {
    setTermoBusca(sugestao);
  }

  function abrirMapaComBusca() {
    const route = {
      pathname: "/map",
      params: {
        filters: JSON.stringify(filters),
        query: termoBusca.trim(),
      },
    } as Href;

    setIsApplying(true);

    setTimeout(() => {
      setIsApplying(false);
      router.replace(route);
    }, 420);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <ScreenTransition style={styles.content}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar ao mapa"
            style={({ pressed, hovered }: PressableVisualState) => [
              styles.backButton,
              hovered && !pressed ? styles.hoverFeedback : null,
              pressed ? styles.buttonPressed : null,
            ]}
            onPress={() => router.replace("/map" as Href)}
          >
            <ArrowLeft color={colors.primaryDark} size={22} strokeWidth={2.3} />
          </Pressable>

          <Text style={styles.headerTitle}>Busca e filtros</Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.searchCard}>
            <View style={styles.searchInputBox}>
              <Search
                color={colors.primaryDark}
                size={21}
                strokeWidth={2.4}
                style={styles.searchIconSvg}
              />
              <TextInput
                accessibilityLabel="Campo de busca de pontos de recarga"
                accessibilityHint="Digite bairro, estação, potência ou tipo de conector."
                value={termoBusca}
                onChangeText={setTermoBusca}
                placeholder="Buscar por bairro, estação ou conector"
                placeholderTextColor={colors.textMuted}
                returnKeyType="search"
                style={styles.searchInput}
              />

              {termoBusca.length > 0 ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Limpar campo de busca"
                  style={({ pressed, hovered }: PressableVisualState) => [
                    styles.searchClearButton,
                    hovered && !pressed ? styles.hoverFeedback : null,
                    pressed ? styles.pressedChip : null,
                  ]}
                  onPress={() => setTermoBusca("")}
                >
                  <X color={colors.primaryDark} size={17} strokeWidth={2.6} />
                </Pressable>
              ) : null}
            </View>

            <Text style={styles.quickSearchLabel}>Sugestões rápidas</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickSearchRow}
            >
              {sugestoesRapidas.map((sugestao) => (
                <Pressable
                  key={sugestao}
                  accessibilityRole="button"
                  accessibilityLabel={`Buscar por ${sugestao}`}
                  accessibilityState={{ selected: termoBusca === sugestao }}
                  style={({ pressed, hovered }: PressableVisualState) => [
                    styles.quickSearchChip,
                    termoBusca === sugestao
                      ? styles.quickSearchChipSelected
                      : null,
                    hovered && !pressed ? styles.hoverFeedback : null,
                    pressed ? styles.pressedChip : null,
                  ]}
                  onPress={() => {
                    triggerImpact();
                    selecionarSugestao(sugestao);
                  }}
                >
                  <Text
                    style={[
                      styles.quickSearchChipText,
                      termoBusca === sugestao
                        ? styles.quickSearchChipTextSelected
                        : null,
                    ]}
                  >
                    {sugestao}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filterCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBox}>
                <Plug color={colors.primaryDark} size={18} strokeWidth={2.4} />
              </View>
              <Text style={styles.sectionTitle}>Tipo de conector</Text>
            </View>

            <View style={styles.chipRow}>
              {visibleConnectorOptions.map((option) => (
                <Chip
                  styles={styles}
                  colors={colors}
                  key={option.value}
                  label={option.label}
                  Icone={getConnectorIcone(option.value)}
                  selected={filters.connectorTypes.includes(option.value)}
                  onPress={() => handleToggleConnector(option.value)}
                />
              ))}
            </View>
          </View>

          <View style={styles.filterCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBox}>
                <Zap color={colors.primaryDark} size={18} strokeWidth={2.4} />
              </View>
              <Text style={styles.sectionTitle}>Potência mínima</Text>
            </View>

            <View style={styles.chipRow}>
              {powerOptions.map((power) => (
                <Chip
                  styles={styles}
                  colors={colors}
                  key={power}
                  label={`${power} kW`}
                  Icone={Zap}
                  selected={filters.power.minKw === power}
                  onPress={() => handleSelectPower(power)}
                  size="small"
                />
              ))}
            </View>
          </View>

          <View style={styles.filterCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBox}>
                <Clock3 color={colors.primaryDark} size={18} strokeWidth={2.4} />
              </View>
              <Text style={styles.sectionTitle}>Disponibilidade</Text>
            </View>

            <View style={styles.chipRow}>
              <Chip
                styles={styles}
                colors={colors}
                label="Aberto agora"
                Icone={Clock3}
                selected={filters.onlyOpenNow}
                onPress={handleToggleOpenNow}
                size="large"
              />

              <Chip
                styles={styles}
                colors={colors}
                label="Carregadores livres"
                Icone={BatteryCharging}
                selected={filters.statuses.includes("available")}
                onPress={handleToggleAvailableChargers}
                size="large"
              />

              <Chip
                styles={styles}
                colors={colors}
                label="Aberto 24h"
                Icone={AlarmClock}
                selected={filters.onlyOpen24h}
                onPress={handleToggleOpen24h}
                size="large"
              />
            </View>
          </View>

          <View style={styles.filterCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBox}>
                <Coffee color={colors.primaryDark} size={18} strokeWidth={2.4} />
              </View>
              <Text style={styles.sectionTitle}>Comodidades</Text>
            </View>

            <View style={styles.chipRow}>
              {visibleAmenityOptions.map((option) => (
                <Chip
                  styles={styles}
                  colors={colors}
                  key={option.value}
                  label={option.label}
                  Icone={getAmenityIcone(option.value)}
                  selected={filters.amenities.includes(option.value)}
                  onPress={() => handleToggleAmenity(option.value)}
                />
              ))}
            </View>
          </View>

          <View style={styles.filterCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBox}>
                <Star color={colors.primaryDark} size={18} strokeWidth={2.4} />
              </View>
              <Text style={styles.sectionTitle}>Avaliação mínima</Text>
            </View>

            <View style={styles.chipRow}>
              {ratingOptions.map((rating) => (
                <Chip
                  styles={styles}
                  colors={colors}
                  key={rating}
                  label={`${rating.toFixed(1).replace(".", ",")}+`}
                  Icone={Star}
                  selected={filters.rating.minRating === rating}
                  onPress={() => handleSelectRating(rating)}
                  size="medium"
                />
              ))}
            </View>
          </View>

          <View style={styles.filterCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconBox}>
                <MapPin color={colors.primaryDark} size={18} strokeWidth={2.4} />
              </View>
              <Text style={styles.sectionTitle}>Raio de busca</Text>
            </View>

            <View style={styles.chipRow}>
              {distanceOptions.map((distance) => (
                <Chip
                  styles={styles}
                  colors={colors}
                  key={distance}
                  label={formatDistanceLabel(distance)}
                  Icone={MapPin}
                  selected={filters.distance.maxKm === distance}
                  onPress={() => handleSelectDistance(distance)}
                  size="small"
                />
              ))}
            </View>
          </View>

        </ScrollView>

        <SafeAreaView edges={["bottom"]} style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Limpar busca e filtros"
            style={({ pressed, hovered }: PressableVisualState) => [
              styles.clearButton,
              hovered && !pressed ? styles.hoverFeedback : null,
              pressed ? styles.buttonPressed : null,
            ]}
            onPress={() => {
              triggerImpact();
              handleClearFilters();
            }}
          >
            <RotateCcw
              color={colors.primaryDark}
              size={18}
              strokeWidth={2.4}
              style={styles.clearButtonIconSvg}
            />
            <Text style={styles.clearButtonText}>Limpar busca</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver pontos encontrados no mapa"
            accessibilityState={{ disabled: isApplying }}
            style={({ pressed, hovered }: PressableVisualState) => [
              styles.applyButton,
              hovered && !pressed ? styles.hoverFeedback : null,
              pressed ? styles.primaryButtonPressed : null,
            ]}
            disabled={isApplying}
            onPress={() => {
              triggerImpact();
              abrirMapaComBusca();
            }}
          >
            <Text style={styles.applyButtonText}>{textoBotaoMapa}</Text>
            <ChevronRight color={colors.white} size={20} strokeWidth={2.5} />
          </Pressable>
        </SafeAreaView>
        <LoadingOverlay visible={isApplying} message="Buscando pontos..." />
      </ScreenTransition>
    </SafeAreaView>
  );
}
