import React, { createContext, forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
import GoogleMapSurface, { Marker as GoogleMarker } from "./GoogleMapSurface.web";
import { Image, Text, View, type ImageSourcePropType, type ViewProps } from "react-native";
export type Region = { latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number };
export type MapViewHandle = { animateToRegion: (region: Region, duration?: number) => void };
type Bounds = { getNorth: () => number; getSouth: () => number; getEast: () => number; getWest: () => number };
type WebMap = { fitBounds: (bounds: number[][], options?: object) => void; on: (name: string, callback: () => void) => void; getBounds: () => Bounds; getCenter: () => { lat: number; lng: number }; remove: () => void; invalidateSize: () => void; attributionControl: { setPosition: (position: string) => void } };
type WebMarker = { addTo: (map: WebMap) => WebMarker; setLatLng: (point: number[]) => void; remove: () => void; getElement: () => HTMLElement | undefined };
type Leaflet = { map: (element: HTMLElement, options: object) => WebMap; tileLayer: (url: string, options: object) => { addTo: (map: WebMap) => void; on: (event: string, callback: () => void) => void }; divIcon: (options: object) => unknown; marker: (point: number[], options: object) => WebMarker };
declare global { interface Window { L?: Leaflet } }
const MapContext = createContext<{ map: WebMap; leaflet: Leaflet } | null>(null);
let leafletPromise: Promise<Leaflet> | null = null;
function loadLeaflet() {
  if (window.L) return Promise.resolve(window.L);
  return leafletPromise ??= new Promise<Leaflet>((resolve, reject) => {
    if (!document.getElementById("flui-map-css")) { const css = document.createElement("link"); css.id = "flui-map-css"; css.rel = "stylesheet"; css.href = "/vendor/leaflet.css"; document.head.appendChild(css); }
    const script = document.createElement("script"); script.src = "/vendor/leaflet.js"; script.async = true;
    const fail = () => {
      clearTimeout(timer);
      script.remove();
      leafletPromise = null;
      reject(new Error("Mapa indisponível"));
    };
    const timer = setTimeout(fail, 10000);
    script.onload = () => {
      if (!window.L) { fail(); return; }
      clearTimeout(timer);
      resolve(window.L);
    };
    script.onerror = fail;
    document.head.appendChild(script);
  });
}
function boundsFor(region: Region) { return [[region.latitude - region.latitudeDelta / 2, region.longitude - region.longitudeDelta / 2], [region.latitude + region.latitudeDelta / 2, region.longitude + region.longitudeDelta / 2]]; }
type Props = ViewProps & { initialRegion: Region; children?: React.ReactNode; provider?: string; showsUserLocation?: boolean; showsMyLocationButton?: boolean; showsCompass?: boolean; toolbarEnabled?: boolean; loadingEnabled?: boolean; customMapStyle?: unknown[]; onMapReady?: () => void; onRegionChangeComplete?: (region: Region) => void };
export const PROVIDER_GOOGLE = "google";
// A chave Web deve ter restrição de domínio e acesso apenas à Maps JavaScript API.
const useGoogleMaps = Boolean(process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_WEB?.trim());
const MapSurface = forwardRef<MapViewHandle, Props>(function MapSurface({ initialRegion, children, onMapReady, onRegionChangeComplete, style, accessibilityLabel }, ref) {
  const element = useRef<HTMLDivElement>(null), mapRef = useRef<WebMap | null>(null);
  const initial = useRef(initialRegion), callbacks = useRef({ onMapReady, onRegionChangeComplete }); callbacks.current = { onMapReady, onRegionChangeComplete };
  const [context, setContext] = useState<{ map: WebMap; leaflet: Leaflet } | null>(null);
  const [notice, setNotice] = useState("Carregando mapa web…");
  useImperativeHandle(ref, () => ({ animateToRegion(region, duration = 0) { initial.current = region; mapRef.current?.fitBounds(boundsFor(region), { animate: duration > 0, duration: duration / 1000, padding: [0, 0] }); } }), []);
  useEffect(() => {
    let alive = true; let observer: ResizeObserver | undefined;
    void loadLeaflet().then(leaflet => {
      if (!alive || !element.current) return;
      const map = leaflet.map(element.current, { zoomControl: false, scrollWheelZoom: true, attributionControl: true }); mapRef.current = map;
      map.attributionControl.setPosition("topleft");
      const tiles = leaflet.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors' });
      let missingTiles = false;
      tiles.on("loading", () => { missingTiles = false; });
      tiles.on("tileerror", () => {
        missingTiles = true;
        if (alive) setNotice("Base cartográfica indisponível · estações de simulação");
      });
      tiles.on("load", () => {
        if (alive && !missingTiles) setNotice("Mapa web · estações de simulação");
      });
      tiles.addTo(map); map.fitBounds(boundsFor(initial.current), { animate: false });
      map.on("moveend", () => { const center = map.getCenter(), bounds = map.getBounds(); callbacks.current.onRegionChangeComplete?.({ latitude: center.lat, longitude: center.lng, latitudeDelta: bounds.getNorth() - bounds.getSouth(), longitudeDelta: bounds.getEast() - bounds.getWest() }); });
      observer = new ResizeObserver(() => map.invalidateSize()); observer.observe(element.current);
      setContext({ map, leaflet }); callbacks.current.onMapReady?.();
    }).catch(() => { if (alive) setNotice("Mapa indisponível. Use a lista para buscar e abrir as estações."); });
    return () => { alive = false; observer?.disconnect(); mapRef.current?.remove(); mapRef.current = null; };
  }, []);
  return <View style={[{ overflow: "hidden", backgroundColor: "#E9EFEA" }, style]} accessibilityLabel={accessibilityLabel}>
    {React.createElement("div", { ref: element, style: { position: "absolute", inset: 0, zIndex: 0, isolation: "isolate" }, "aria-label": "Mapa geográfico OpenStreetMap com estações de simulação" })}
    <MapContext.Provider value={context}>{children}</MapContext.Provider>
    <View pointerEvents="none" style={{ position: "absolute", top: 24, left: 6, maxWidth: "65%", padding: 4, borderRadius: 6, backgroundColor: "#FFFFFFE8", zIndex: 1 }}><Text accessibilityLiveRegion="polite" style={{ fontSize: 10, color: "#33443F" }}>{notice}</Text></View>
  </View>;
});
type MarkerProps = { children?: React.ReactNode; coordinate: { latitude: number; longitude: number }; title?: string; description?: string; onPress?: () => void; accessible?: boolean; accessibilityRole?: "button"; accessibilityLabel?: string; accessibilityHint?: string; anchor?: { x: number; y: number }; icon?: ImageSourcePropType; tracksViewChanges?: boolean };
function OpenStreetMapMarker({ children, coordinate, title, onPress, accessibilityLabel, icon }: MarkerProps) {
  const context = useContext(MapContext), marker = useRef<WebMarker | null>(null), press = useRef(onPress); press.current = onPress;
  const interactive = Boolean(onPress);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!context) return;
    const content = document.createElement("div"); content.style.width = "44px"; content.style.height = "44px";
    const item = context.leaflet.marker([coordinate.latitude, coordinate.longitude], { icon: context.leaflet.divIcon({ html: content, className: "flui-station-marker", iconSize: [44, 44], iconAnchor: [22, 38] }), keyboard: false, title }).addTo(context.map);
    const node = item.getElement();
    if (node) { node.setAttribute("role", onPress ? "button" : "img"); node.setAttribute("aria-label", accessibilityLabel ?? title ?? "Origem de simulação"); node.tabIndex = onPress ? 0 : -1; node.onclick = event => { event.stopPropagation(); press.current?.(); }; node.onkeydown = event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); press.current?.(); } }; }
    marker.current = item; setContainer(content);
    return () => { item.remove(); marker.current = null; };
    // Coordenadas são atualizadas sem recriar o marcador ou perder seu foco.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context, title, accessibilityLabel, interactive]);
  useEffect(() => { marker.current?.setLatLng([coordinate.latitude, coordinate.longitude]); }, [coordinate.latitude, coordinate.longitude]);
  return container ? createPortal(children ?? (icon ? <Image source={icon} style={{ width: 40, height: 40 }} resizeMode="contain" /> : null), container) : null;
}
export const Marker = useGoogleMaps ? GoogleMarker : OpenStreetMapMarker;
export default useGoogleMaps ? GoogleMapSurface : MapSurface;
