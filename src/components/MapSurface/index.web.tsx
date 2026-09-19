import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { Pressable, StyleSheet, Text, View, type ViewProps } from "react-native";

export type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type MapViewHandle = {
  animateToRegion: (region: Region, duration?: number) => void;
};

type MapViewProps = ViewProps & {
  initialRegion: Region;
  children?: React.ReactNode;
  provider?: string;
  showsUserLocation?: boolean;
  showsMyLocationButton?: boolean;
  showsCompass?: boolean;
  toolbarEnabled?: boolean;
  loadingEnabled?: boolean;
  customMapStyle?: unknown[];
  onMapReady?: () => void;
  onRegionChangeComplete?: (region: Region) => void;
};

type MarkerProps = {
  children?: React.ReactNode;
  coordinate: { latitude: number; longitude: number };
  title?: string;
  description?: string;
  onPress?: () => void;
  accessible?: boolean;
  accessibilityRole?: "button";
  accessibilityLabel?: string;
  accessibilityHint?: string;
  anchor?: { x: number; y: number };
  icon?: unknown;
  tracksViewChanges?: boolean;
};

export const PROVIDER_GOOGLE = "google";

const MapSurface = forwardRef<MapViewHandle, MapViewProps>(
  function MapSurface(
    {
      initialRegion,
      children,
      onMapReady,
      onRegionChangeComplete,
      style,
      provider: _provider,
      showsUserLocation: _showsUserLocation,
      showsMyLocationButton: _showsMyLocationButton,
      showsCompass: _showsCompass,
      toolbarEnabled: _toolbarEnabled,
      loadingEnabled: _loadingEnabled,
      customMapStyle: _customMapStyle,
      ...viewProps
    },
    ref,
  ) {
    const [region, setRegion] = useState(initialRegion);

    useEffect(() => {
      onMapReady?.();
    }, [onMapReady]);

    useImperativeHandle(
      ref,
      () => ({
        animateToRegion(nextRegion) {
          setRegion(nextRegion);
          onRegionChangeComplete?.(nextRegion);
        },
      }),
      [onRegionChangeComplete],
    );

    return (
      <View {...viewProps} style={[styles.map, style]}>
        <View pointerEvents="none" style={styles.grid}>
          {[20, 40, 60, 80].map((position) => (
            <View
              key={`vertical-${position}`}
              style={[styles.verticalStreet, { left: `${position}%` }]}
            />
          ))}
          {[18, 36, 54, 72, 90].map((position) => (
            <View
              key={`horizontal-${position}`}
              style={[styles.horizontalStreet, { top: `${position}%` }]}
            />
          ))}
          <View style={styles.park} />
          <Text style={styles.mapLabel}>Prévia do mapa</Text>
          <Text style={styles.regionLabel}>
            {region.latitude.toFixed(3)}, {region.longitude.toFixed(3)}
          </Text>
        </View>
        {children}
      </View>
    );
  },
);

export const Marker = ({
  children,
  coordinate,
  onPress,
  title: _title,
  description: _description,
  accessible,
  accessibilityRole,
  accessibilityLabel,
  accessibilityHint,
  anchor: _anchor,
  icon: _icon,
  tracksViewChanges: _tracksViewChanges,
}: MarkerProps) => {
  const position = useMemo(() => {
    const latitudeSeed = Math.abs(Math.round(coordinate.latitude * 10000));
    const longitudeSeed = Math.abs(Math.round(coordinate.longitude * 10000));

    return {
      left: `${10 + (longitudeSeed % 78)}%` as `${number}%`,
      top: `${12 + (latitudeSeed % 70)}%` as `${number}%`,
    };
  }, [coordinate.latitude, coordinate.longitude]);

  return (
    <Pressable
      onPress={onPress}
      accessible={accessible}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      style={[styles.marker, position]}
    >
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  map: {
    overflow: "hidden",
    backgroundColor: "#E9EFEA",
  },
  grid: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#E9EFEA",
  },
  verticalStreet: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 8,
    backgroundColor: "#F9FBF8",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#D6DED8",
  },
  horizontalStreet: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 8,
    backgroundColor: "#F9FBF8",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#D6DED8",
  },
  park: {
    position: "absolute",
    right: "8%",
    top: "8%",
    width: "24%",
    height: "22%",
    borderRadius: 28,
    backgroundColor: "#CFE5D4",
  },
  mapLabel: {
    position: "absolute",
    left: 12,
    bottom: 30,
    color: "#3F554F",
    fontSize: 12,
    fontWeight: "700",
  },
  regionLabel: {
    position: "absolute",
    left: 12,
    bottom: 12,
    color: "#63756F",
    fontSize: 10,
  },
  marker: {
    position: "absolute",
    transform: [{ translateX: -20 }, { translateY: -20 }],
    zIndex: 2,
  },
});

export default MapSurface;
