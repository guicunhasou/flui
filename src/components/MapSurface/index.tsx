import React, { forwardRef, useImperativeHandle, useRef } from "react";
import NativeMapView, {
  Marker,
  PROVIDER_GOOGLE,
  type MapViewProps,
  type Region,
} from "react-native-maps";

export { Marker, PROVIDER_GOOGLE };
export type { MapViewProps, Region };

export type MapViewHandle = {
  animateToRegion: (region: Region, duration?: number) => void;
};

const MapSurface = forwardRef<MapViewHandle, MapViewProps>(
  function MapSurface(props, ref) {
    const nativeMapRef = useRef<NativeMapView | null>(null);

    useImperativeHandle(ref, () => ({
      animateToRegion(region, duration) {
        nativeMapRef.current?.animateToRegion(region, duration);
      },
    }));

    return <NativeMapView ref={nativeMapRef} {...props} />;
  },
);

export default MapSurface;
