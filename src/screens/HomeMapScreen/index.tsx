import React from "react";
import { Pressable, ScrollView, Text, View, type ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import styles from "./styles";

type Recommendation = {
  id: string;
  icon: keyof typeof Feather.glyphMap;
  title: string;
  address: string;
  status: string;
  meta: string;
  power: string;
  rating?: string;
  amenity?: string;
};

const recommendations: Recommendation[] = [
  {
    id: "1",
    icon: "navigation",
    title: "Mais próximo",
    address: "Rua dos Pinheiros, 732",
    status: "Aberto agora",
    meta: "2 min • 450 m",
    power: "150 kW",
  },
  {
    id: "2",
    icon: "star",
    title: "Melhor avaliado",
    address: "Av. Paulista, 1842",
    status: "Aberto agora",
    meta: "",
    power: "120 kW",
    rating: "4,8",
  },
  {
    id: "3",
    icon: "home",
    title: "Mais confortável",
    address: "Al. Gabriel Monteiro, 1200",
    status: "Aberto agora",
    meta: "",
    power: "150 kW",
    amenity: "Banheiro",
  },
];

type MapPin = {
  id: string;
  top: ViewStyle["top"];
  left: ViewStyle["left"];
  active: boolean;
};

const mapPins: MapPin[] = [
  { id: "1", top: "12%", left: "44%", active: true },
  { id: "2", top: "23%", left: "20%", active: true },
  { id: "3", top: "26%", left: "76%", active: true },
  { id: "4", top: "49%", left: "60%", active: true },
  { id: "5", top: "68%", left: "29%", active: true },
  { id: "6", top: "67%", left: "70%", active: true },
  { id: "7", top: "45%", left: "20%", active: false },
  { id: "8", top: "20%", left: "62%", active: false },
];

export default function HomeMapScreen() {
  function handleOpenFilters() {
    // navigation.navigate("Filters");
  }

  function handleOpenPointDetails() {
    // navigation.navigate("PointDetails");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>Flui</Text>

          <Pressable style={styles.profileButton}>
            <Feather name="user" size={22} color="#36109A" />
          </Pressable>
        </View>

        <View style={styles.searchBar}>
          <Feather name="search" size={22} color="#1B145C" />

          <Text style={styles.searchPlaceholder}>Buscar endereço ou lugar</Text>

          <View style={styles.searchDivider} />

          <Pressable onPress={handleOpenFilters} hitSlop={10}>
            <Feather name="sliders" size={22} color="#36109A" />
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersRow}
        >
          <Pressable style={[styles.filterChip, styles.filterChipActive]}>
            <Feather name="clock" size={18} color="#FFFFFF" />
            <Text style={styles.filterChipActiveText}>Aberto agora</Text>
          </Pressable>

          <Pressable style={styles.filterChip}>
            <MaterialCommunityIcons
              name="gas-station-outline"
              size={18}
              color="#1B145C"
            />
            <Text style={styles.filterChipText}>CCS2</Text>
          </Pressable>

          <Pressable style={styles.filterChip}>
            <Feather name="zap" size={18} color="#1B145C" />
            <Text style={styles.filterChipText}>Rápido</Text>
          </Pressable>

          <Pressable style={styles.filterChip}>
            <MaterialCommunityIcons
              name="human-male-female"
              size={18}
              color="#1B145C"
            />
            <Text style={styles.filterChipText}>Com banheiro</Text>
          </Pressable>
        </ScrollView>

        <View style={styles.mapCard}>
          <View style={styles.mapBackground}>
            <View style={[styles.mapRoad, styles.mapRoadOne]} />
            <View style={[styles.mapRoad, styles.mapRoadTwo]} />
            <View style={[styles.mapRoad, styles.mapRoadThree]} />
            <View style={[styles.mapRoad, styles.mapRoadFour]} />
            <View style={[styles.mapRoad, styles.mapRoadFive]} />

            <View style={[styles.mapPark, styles.mapParkOne]} />
            <View style={[styles.mapPark, styles.mapParkTwo]} />
            <View style={[styles.mapRiver]} />

            {mapPins.map((pin) => (
              <View
                key={pin.id}
                style={[
                  styles.mapPin,
                  pin.active ? styles.mapPinActive : styles.mapPinInactive,
                  {
                    top: pin.top,
                    left: pin.left,
                  },
                ]}
              >
                <View style={styles.mapPinIcon}>
                  {pin.active ? (
                    <Feather name="zap" size={18} color="#FFFFFF" />
                  ) : (
                    <MaterialCommunityIcons
                      name="gas-station-outline"
                      size={18}
                      color="#36109A"
                    />
                  )}
                </View>
              </View>
            ))}

            <View style={styles.userLocationHalo}>
              <View style={styles.userLocationDot} />
            </View>

            <View style={styles.mapActions}>
              <Pressable style={styles.mapActionButton}>
                <Feather name="crosshair" size={22} color="#1B145C" />
              </Pressable>

              <Pressable style={styles.mapActionButton}>
                <Feather name="navigation" size={22} color="#1B145C" />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.recommendationsCard}>
          <View style={styles.recommendationsHeader}>
            <Text style={styles.recommendationsTitle}>
              Melhores pontos perto de você
            </Text>

            <View style={styles.starBadge}>
              <Feather name="star" size={22} color="#F4B322" />
            </View>
          </View>

          <View style={styles.recommendationsList}>
            {recommendations.map((item) => (
              <Pressable
                key={item.id}
                style={styles.recommendationItem}
                onPress={handleOpenPointDetails}
              >
                <View style={styles.recommendationIcon}>
                  <Feather name={item.icon} size={22} color="#36109A" />
                </View>

                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>{item.title}</Text>
                  <Text style={styles.recommendationAddress}>
                    {item.address}
                  </Text>

                  <View style={styles.statusRow}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>{item.status}</Text>
                  </View>
                </View>

                <View style={styles.recommendationMeta}>
                  {item.meta ? (
                    <Text style={styles.metaText}>{item.meta}</Text>
                  ) : null}

                  {item.rating ? (
                    <View style={styles.inlineMeta}>
                      <Feather name="star" size={15} color="#F4B322" />
                      <Text style={styles.metaText}>{item.rating}</Text>
                    </View>
                  ) : null}

                  {item.amenity ? (
                    <View style={styles.inlineMeta}>
                      <MaterialCommunityIcons
                        name="human-male-female"
                        size={15}
                        color="#1B145C"
                      />
                      <Text style={styles.metaText}>{item.amenity}</Text>
                    </View>
                  ) : null}

                  <View style={styles.inlineMeta}>
                    <Feather name="zap" size={14} color="#1B145C" />
                    <Text style={styles.metaText}>{item.power}</Text>
                  </View>
                </View>

                <Feather name="chevron-right" size={24} color="#36109A" />
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.tabBar}>
          <Pressable style={styles.tabItem}>
            <View style={styles.activeIndicator} />
            <Ionicons name="map-outline" size={27} color="#36109A" />
            <Text style={styles.tabTextActive}>Mapa</Text>
          </Pressable>

          <Pressable style={styles.tabItem}>
            <Ionicons name="heart-outline" size={27} color="#5F6678" />
            <Text style={styles.tabText}>Favoritos</Text>
          </Pressable>

          <Pressable style={styles.tabItem}>
            <MaterialCommunityIcons
              name="lightning-bolt-circle"
              size={27}
              color="#5F6678"
            />
            <Text style={styles.tabText}>Atividades</Text>
          </Pressable>

          <Pressable style={styles.tabItem}>
            <Ionicons name="ellipsis-horizontal" size={27} color="#5F6678" />
            <Text style={styles.tabText}>Mais</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
