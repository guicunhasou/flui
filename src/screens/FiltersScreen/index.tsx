import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router, type Href } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

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
import { styles } from "./styles";
import { LoadingOverlay, ScreenTransition } from "../../components";
import { colors } from "../../theme/colors";

type ChipProps = {
  label: string;
  icon?: string;
  selected: boolean;
  onPress: () => void;
  size?: "small" | "medium" | "large";
};

const initialFilters: StationFilters = {
  connectorTypes: ["ccs2"],
  statuses: [],
  amenities: ["restroom", "parking"],
  power: {
    minKw: 150,
  },
  distance: {
    maxKm: 1,
  },
  rating: {
    minRating: 4.5,
  },
  onlyOpenNow: true,
};

const visibleConnectorOptions = connectorOptions
  .filter((option) => ["ccs2", "chademo", "type2"].includes(option.value))
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

const powerOptions = [50, 100, 150, 250];
const ratingOptions = [4, 4.5];
const distanceOptions = [0.5, 1, 5];
const sugestoesRapidas = [
  "Shopping",
  "Recife Antigo",
  "Boa Viagem",
  "Carga rápida",
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

function getConnectorIcon(value: ConnectorType) {
  const icons: Record<ConnectorType, string> = {
    ccs2: "▯",
    type2: "◉",
    chademo: "◌",
    gbt: "▣",
  };

  return icons[value];
}

function getAmenityIcon(value: Amenity) {
  const icons: Record<Amenity, string> = {
    restaurant: "♨",
    coffee: "☕",
    restroom: "♙",
    parking: "P",
    coveredArea: "⌂",
    market: "□",
    wifi: "⌁",
    security: "◇",
  };

  return icons[value];
}

function formatDistanceLabel(distance: number) {
  if (distance < 1) {
    return `Até ${distance * 1000} m`;
  }

  return `${distance} km`;
}

function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function buscarPontos(termo: string) {
  const termoNormalizado = normalizarTexto(termo);

  if (!termoNormalizado) {
    return chargingStations.slice(0, 3);
  }

  return chargingStations.filter((ponto) => {
    const textoDoPonto = normalizarTexto(
      [
        ponto.name,
        ponto.address,
        ponto.neighborhood,
        ponto.city,
        ponto.state,
        `${ponto.powerKw} kW`,
        ponto.connectors.map((connector) => connector.label).join(" "),
      ].join(" "),
    );

    return textoDoPonto.includes(termoNormalizado);
  });
}

function montarTextoDeStatus(status: StationStatus) {
  if (status === "available") {
    return "Disponível agora";
  }

  if (status === "busy") {
    return "Alta procura";
  }

  if (status === "maintenance") {
    return "Em manutenção";
  }

  return "Indisponível";
}

function Chip({ label, icon, selected, onPress, size = "medium" }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}${selected ? ", selecionado" : ""}`}
      accessibilityHint="Toque para ajustar este critério de busca."
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.chip,
        styles[`${size}Chip`],
        selected ? styles.selectedChip : null,
        pressed ? styles.pressedChip : null,
      ]}
      onPress={onPress}
    >
      {icon ? (
        <Text
          style={[styles.chipIcon, selected ? styles.selectedChipText : null]}
        >
          {icon}
        </Text>
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
  const [filters, setFilters] = useState<StationFilters>(initialFilters);
  const [termoBusca, setTermoBusca] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const pontosEncontrados = buscarPontos(termoBusca);
  const textoContagem =
    pontosEncontrados.length === 1
      ? "1 ponto"
      : `${pontosEncontrados.length} pontos`;

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
        minKw,
      },
    }));
  }

  function handleToggleOpenNow() {
    setFilters((currentFilters) => ({
      ...currentFilters,
      onlyOpenNow: !currentFilters.onlyOpenNow,
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
      },
    } as Href;

    setIsApplying(true);

    setTimeout(() => {
      setIsApplying(false);
      router.replace(route);
    }, 420);
  }

  function abrirFichaDoPonto(stationId: string) {
    const route = {
      pathname: "/point-details",
      params: { stationId },
    } as Href;

    router.push(route);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenTransition style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <Text style={styles.eyebrow}>Busca</Text>
            <Text style={styles.title}>Busca e filtros</Text>
            <Text style={styles.subtitle}>
              Encontre pontos por conector, potência, distância e conforto.
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Fechar busca e voltar ao mapa"
            style={styles.closeButton}
            onPress={() => router.replace("/map" as Href)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.searchCard}>
            <View style={styles.searchInputBox}>
              <Text style={styles.searchIcon}>⌕</Text>
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
                  style={styles.searchClearButton}
                  onPress={() => setTermoBusca("")}
                >
                  <Text style={styles.searchClearText}>×</Text>
                </Pressable>
              ) : null}
            </View>

            <Text style={styles.quickSearchLabel}>Sugestões rápidas</Text>
            <View style={styles.quickSearchRow}>
              {sugestoesRapidas.map((sugestao) => (
                <Pressable
                  key={sugestao}
                  accessibilityRole="button"
                  accessibilityLabel={`Buscar por ${sugestao}`}
                  accessibilityState={{ selected: termoBusca === sugestao }}
                  style={({ pressed }) => [
                    styles.quickSearchChip,
                    termoBusca === sugestao
                      ? styles.quickSearchChipSelected
                      : null,
                    pressed ? styles.pressedChip : null,
                  ]}
                  onPress={() => selecionarSugestao(sugestao)}
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
            </View>
          </View>

          <View style={styles.filterCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>⌁</Text>
              <Text style={styles.sectionTitle}>Tipo de conector</Text>
            </View>

            <View style={styles.chipRow}>
              {visibleConnectorOptions.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  icon={getConnectorIcon(option.value)}
                  selected={filters.connectorTypes.includes(option.value)}
                  onPress={() => handleToggleConnector(option.value)}
                />
              ))}
            </View>
          </View>

          <View style={styles.filterCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>⚡</Text>
              <Text style={styles.sectionTitle}>Potência mínima</Text>
            </View>

            <View style={styles.chipRow}>
              {powerOptions.map((power) => (
                <Chip
                  key={power}
                  label={`${power} kW`}
                  selected={filters.power.minKw === power}
                  onPress={() => handleSelectPower(power)}
                  size="small"
                />
              ))}
            </View>
          </View>

          <View style={styles.filterCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>◷</Text>
              <Text style={styles.sectionTitle}>Disponibilidade</Text>
            </View>

            <View style={styles.chipRow}>
              <Chip
                label="Aberto agora"
                icon="◷"
                selected={filters.onlyOpenNow}
                onPress={handleToggleOpenNow}
                size="large"
              />

              <Chip
                label="Carregadores livres"
                icon="▯"
                selected={filters.statuses.includes("available")}
                onPress={handleToggleAvailableChargers}
                size="large"
              />
            </View>
          </View>

          <View style={styles.filterCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>♙</Text>
              <Text style={styles.sectionTitle}>Comodidades</Text>
            </View>

            <View style={styles.chipRow}>
              {visibleAmenityOptions.map((option) => (
                <Chip
                  key={option.value}
                  label={option.label}
                  icon={getAmenityIcon(option.value)}
                  selected={filters.amenities.includes(option.value)}
                  onPress={() => handleToggleAmenity(option.value)}
                />
              ))}
            </View>
          </View>

          <View style={styles.filterCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>☆</Text>
              <Text style={styles.sectionTitle}>Avaliação mínima</Text>
            </View>

            <View style={styles.chipRow}>
              {ratingOptions.map((rating) => (
                <Chip
                  key={rating}
                  label={`${rating.toFixed(1).replace(".", ",")}+`}
                  selected={filters.rating.minRating === rating}
                  onPress={() => handleSelectRating(rating)}
                  size="large"
                />
              ))}
            </View>
          </View>

          <View style={styles.filterCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>⌖</Text>
              <Text style={styles.sectionTitle}>Distância</Text>
            </View>

            <View style={styles.chipRow}>
              {distanceOptions.map((distance) => (
                <Chip
                  key={distance}
                  label={formatDistanceLabel(distance)}
                  selected={filters.distance.maxKm === distance}
                  onPress={() => handleSelectDistance(distance)}
                />
              ))}
            </View>
          </View>

          <View style={styles.resultsCard}>
            <View style={styles.resultsHeader}>
              <View>
                <Text style={styles.resultsEyebrow}>Resultados simulados</Text>
                <Text style={styles.resultsTitle}>Pontos recomendados</Text>
              </View>

              <Text style={styles.resultsCount}>{textoContagem}</Text>
            </View>

            {pontosEncontrados.length > 0 ? (
              pontosEncontrados.map((ponto) => (
                <Pressable
                  key={ponto.id}
                  accessibilityRole="button"
                  accessibilityLabel={`${ponto.name}. ${ponto.neighborhood}, ${ponto.distanceKm} km, ${ponto.powerKw} kW. ${montarTextoDeStatus(ponto.status)}.`}
                  accessibilityHint="Abre a ficha detalhada deste ponto de recarga."
                  style={({ pressed }) => [
                    styles.resultItem,
                    pressed ? styles.resultItemPressed : null,
                  ]}
                  onPress={() => abrirFichaDoPonto(ponto.id)}
                >
                  <View style={styles.resultIconBox}>
                    <Text style={styles.resultIcon}>⚡</Text>
                  </View>

                  <View style={styles.resultContent}>
                    <Text style={styles.resultName}>{ponto.name}</Text>
                    <Text style={styles.resultAddress}>
                      {ponto.neighborhood} · {ponto.distanceKm} km · {ponto.powerKw} kW
                    </Text>
                    <Text style={styles.resultStatus}>
                      {montarTextoDeStatus(ponto.status)}
                    </Text>
                  </View>

                  <Text style={styles.resultArrow}>›</Text>
                </Pressable>
              ))
            ) : (
              <View style={styles.emptyResultsCard}>
                <Text style={styles.emptyResultsTitle}>Nenhum ponto encontrado</Text>
                <Text style={styles.emptyResultsText}>
                  Tente buscar por bairro, shopping, potência ou tipo de
                  conector.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        <SafeAreaView edges={["bottom"]} style={styles.footer}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Limpar busca e filtros"
            style={({ pressed }) => [
              styles.clearButton,
              pressed ? styles.buttonPressed : null,
            ]}
            onPress={handleClearFilters}
          >
            <Text style={styles.clearButtonIcon}>⟳</Text>
            <Text style={styles.clearButtonText}>Limpar busca</Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ver pontos encontrados no mapa"
            accessibilityState={{ disabled: isApplying }}
            style={({ pressed }) => [
              styles.applyButton,
              pressed ? styles.primaryButtonPressed : null,
            ]}
            disabled={isApplying}
            onPress={abrirMapaComBusca}
          >
            <Text style={styles.applyButtonText}>Ver no mapa</Text>
          </Pressable>
        </SafeAreaView>
        <LoadingOverlay visible={isApplying} message="Buscando pontos..." />
      </ScreenTransition>
    </SafeAreaView>
  );
}
