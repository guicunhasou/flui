import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";

export type MapCoordinate = {
  latitude: number;
  longitude: number;
};

export type Region = MapCoordinate & {
  latitudeDelta: number;
  longitudeDelta: number;
};

export type MapSurfaceHandle = {
  animateToRegion: (region: Region, duration?: number) => void;
};

export type MapSurfaceProps = {
  accessibilityLabel?: string;
  children?: ReactNode;
  customMapStyle?: readonly unknown[];
  initialRegion: Region;
  loadingEnabled?: boolean;
  onMapReady?: () => void;
  onRegionChangeComplete?: (region: Region) => void;
  provider?: unknown;
  showsCompass?: boolean;
  showsMyLocationButton?: boolean;
  showsUserLocation?: boolean;
  style?: StyleProp<ViewStyle>;
  toolbarEnabled?: boolean;
};

export type MarkerProps = {
  accessibilityLabel?: string;
  anchor?: { x: number; y: number };
  children?: ReactNode;
  coordinate: MapCoordinate;
  description?: string;
  onPress?: () => void;
  title?: string;
  tracksViewChanges?: boolean;
};
