import { router } from "expo-router";
import LoadingScreen from "../src/screens/LoadingScreen";

export default function LoadingRoute() {
  return <LoadingScreen loop={false} onFinish={() => router.replace("/map")} />;
}
