import React from "react";
import { Image, ImageBackground, type ImageProps, type ImageBackgroundProps } from "react-native";
import { useOfflineImageSource } from "./OfflineAssetsContext";

export function OfflineImage({ source, ...props }: ImageProps) {
  return <Image {...props} source={useOfflineImageSource(source)} />;
}
export function OfflineImageBackground({ source, ...props }: ImageBackgroundProps) {
  return <ImageBackground {...props} source={useOfflineImageSource(source)} />;
}
