import React, {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  Image,
  Text,
  View,
  type ImageSourcePropType,
  type ViewProps,
} from "react-native";

type Point = { lat: number; lng: number };
type LatLng = { lat: () => number; lng: () => number };
type Bounds = { getNorthEast: () => LatLng; getSouthWest: () => LatLng };
type Listener = { remove: () => void };
type GoogleMap = {
  fitBounds: (bounds: Bounds, padding?: number) => void;
  getBounds: () => Bounds | undefined;
  getCenter: () => LatLng | undefined;
  setOptions: (options: { styles?: unknown[] }) => void;
  addListener: (event: string, handler: () => void) => Listener;
};
type Projection = { fromLatLngToDivPixel: (point: LatLng) => { x: number; y: number } | null };
type GoogleOverlay = {
  setMap: (map: GoogleMap | null) => void;
  getProjection: () => Projection | null;
  getPanes: () => { overlayMouseTarget: HTMLElement } | null;
  onAdd: () => void;
  draw: () => void;
  onRemove: () => void;
};
type MapsApi = {
  Map: new (element: HTMLElement, options: Record<string, unknown>) => GoogleMap;
  LatLng: new (lat: number, lng: number) => LatLng;
  LatLngBounds: new (southwest: Point, northeast: Point) => Bounds;
  OverlayView: new () => GoogleOverlay;
};
type GoogleBrowser = Window & {
  google?: { maps?: MapsApi };
  __fluiGoogleMapsReady?: () => void;
};

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_WEB;
let mapsPromise: Promise<MapsApi> | null = null;

function loadGoogleMaps(): Promise<MapsApi> {
  const browser = window as GoogleBrowser;
  if (browser.google?.maps?.Map) return Promise.resolve(browser.google.maps);
  if (mapsPromise) return mapsPromise;

  mapsPromise = new Promise<MapsApi>((resolve, reject) => {
    if (!apiKey?.trim()) {
      reject(new Error("Chave Web não configurada"));
      return;
    }

    const script = document.createElement("script");
    script.id = "flui-google-maps-script";
    script.async = true;
    const params = new URLSearchParams({
      key: apiKey.trim(),
      v: "weekly",
      loading: "async",
      callback: "__fluiGoogleMapsReady",
    });
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    const timeout = window.setTimeout(() => fail(), 12000);
    const cleanup = () => {
      window.clearTimeout(timeout);
      delete browser.__fluiGoogleMapsReady;
      script.onerror = null;
    };
    const fail = () => {
      cleanup();
      script.remove();
      mapsPromise = null;
      reject(new Error("Não foi possível carregar Google Maps"));
    };
    browser.__fluiGoogleMapsReady = () => {
      if (!browser.google?.maps?.Map || !browser.google.maps.OverlayView) {
        fail();
        return;
      }
      cleanup();
      resolve(browser.google.maps);
    };
    script.onerror = fail;
    document.head.appendChild(script);
  });
  return mapsPromise;
}

export type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};
export type MapViewHandle = { animateToRegion: (region: Region, duration?: number) => void };

type Props = ViewProps & {
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

type Context = { map: GoogleMap; maps: MapsApi };
const MapContext = createContext<Context | null>(null);

function regionToBounds(region: Region, maps: MapsApi): Bounds {
  return new maps.LatLngBounds(
    { lat: region.latitude - region.latitudeDelta / 2, lng: region.longitude - region.longitudeDelta / 2 },
    { lat: region.latitude + region.latitudeDelta / 2, lng: region.longitude + region.longitudeDelta / 2 },
  );
}

const GoogleMapSurface = forwardRef<MapViewHandle, Props>(function GoogleMapSurface(
  { initialRegion, children, onMapReady, onRegionChangeComplete, customMapStyle, accessibilityLabel, style },
  ref,
) {
  const element = useRef<HTMLDivElement>(null);
  const instance = useRef<Context | null>(null);
  const initial = useRef(initialRegion);
  const stylesRef = useRef(customMapStyle);
  stylesRef.current = customMapStyle;
  const stylesSignature = JSON.stringify(customMapStyle ?? []);
  const callbacks = useRef({ onMapReady, onRegionChangeComplete });
  callbacks.current = { onMapReady, onRegionChangeComplete };
  const [context, setContext] = useState<Context | null>(null);
  const [notice, setNotice] = useState("Carregando Google Maps…");

  useImperativeHandle(ref, () => ({
    animateToRegion(region) {
      initial.current = region;
      if (instance.current) {
        instance.current.map.fitBounds(regionToBounds(region, instance.current.maps), 0);
      }
    },
  }), []);

  useEffect(() => {
    let active = true;
    const listeners: Listener[] = [];
    void loadGoogleMaps().then((maps) => {
      if (!active || !element.current) return;
      const map = new maps.Map(element.current, {
        center: { lat: initial.current.latitude, lng: initial.current.longitude },
        zoom: 12,
        disableDefaultUI: true,
        clickableIcons: false,
        gestureHandling: "greedy",
        styles: stylesRef.current ?? [],
      });
      instance.current = { map, maps };
      setContext({ map, maps });
      listeners.push(map.addListener("idle", () => {
        const center = map.getCenter();
        const bounds = map.getBounds();
        if (!center || !bounds) return;
        const north = bounds.getNorthEast(), south = bounds.getSouthWest();
        callbacks.current.onRegionChangeComplete?.({
          latitude: center.lat(),
          longitude: center.lng(),
          latitudeDelta: north.lat() - south.lat(),
          longitudeDelta: Math.abs(north.lng() - south.lng()),
        });
      }));
      listeners.push(map.addListener("tilesloaded", () => {
        if (active) setNotice("Google Maps · estações demonstrativas");
      }));
      map.fitBounds(regionToBounds(initial.current, maps), 0);
      callbacks.current.onMapReady?.();
    }).catch(() => {
      if (active) setNotice("Google Maps indisponível. Verifique a chave Web e o faturamento no Google Cloud.");
    });
    return () => {
      active = false;
      listeners.forEach((listener) => listener.remove());
      instance.current = null;
    };
    // O mapa é criado uma única vez. As alterações posteriores dos callbacks usam ref.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    instance.current?.map.setOptions({ styles: stylesRef.current ?? [] });
  }, [stylesSignature]);

  return (
    <View style={[{ overflow: "hidden", backgroundColor: "#E9EFEA" }, style]} accessibilityLabel={accessibilityLabel}>
      {React.createElement("div", {
        ref: element,
        style: { position: "absolute", inset: 0, zIndex: 0 },
        "aria-label": "Google Maps com estações demonstrativas",
      })}
      <MapContext.Provider value={context}>{children}</MapContext.Provider>
      <View pointerEvents="none" style={{ position: "absolute", top: 24, left: 6, maxWidth: "65%", padding: 4, borderRadius: 6, backgroundColor: "#FFFFFFE8", zIndex: 1 }}>
        <Text accessibilityLiveRegion="polite" style={{ fontSize: 10, color: "#33443F" }}>{notice}</Text>
      </View>
    </View>
  );
});

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
  icon?: ImageSourcePropType;
  tracksViewChanges?: boolean;
};

export function Marker({ children, coordinate, title, onPress, accessibilityLabel, accessibilityHint, anchor, icon }: MarkerProps) {
  const context = useContext(MapContext);
  const overlay = useRef<GoogleOverlay | null>(null);
  const coordinates = useRef(coordinate);
  coordinates.current = coordinate;
  const anchorRef = useRef(anchor);
  anchorRef.current = anchor;
  const press = useRef(onPress);
  press.current = onPress;
  const interactive = Boolean(onPress);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!context) return;
    const node = document.createElement("div");
    node.style.position = "absolute";
    node.style.width = "44px";
    node.style.height = "44px";
    node.setAttribute("role", interactive ? "button" : "img");
    node.setAttribute("aria-label", accessibilityLabel ?? title ?? "Ponto no mapa");
    if (accessibilityHint) node.setAttribute("title", accessibilityHint);
    node.tabIndex = interactive ? 0 : -1;
    node.onclick = event => { event.stopPropagation(); press.current?.(); };
    node.onkeydown = event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault(); event.stopPropagation(); press.current?.();
      }
    };
    const view = new context.maps.OverlayView();
    view.onAdd = () => { view.getPanes()?.overlayMouseTarget.appendChild(node); };
    view.draw = () => {
      const point = view.getProjection()?.fromLatLngToDivPixel(
        new context.maps.LatLng(coordinates.current.latitude, coordinates.current.longitude),
      );
      if (!point) return;
      const origin = anchorRef.current ?? { x: 0.5, y: 0.87 };
      node.style.left = `${point.x - 44 * origin.x}px`;
      node.style.top = `${point.y - 44 * origin.y}px`;
    };
    view.onRemove = () => { node.remove(); };
    view.setMap(context.map);
    overlay.current = view;
    setContainer(node);
    return () => { view.setMap(null); overlay.current = null; };
    // As coordenadas mudam sem remover o marcador e o foco.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, title, accessibilityLabel, accessibilityHint, interactive]);

  useEffect(() => { overlay.current?.draw(); }, [coordinate.latitude, coordinate.longitude, anchor?.x, anchor?.y]);
  return container ? createPortal(children ?? (icon ? <Image source={icon} style={{ width: 40, height: 40 }} resizeMode="contain" /> : null), container) : null;
}

export default GoogleMapSurface;
