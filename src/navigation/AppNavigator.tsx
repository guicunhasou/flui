import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeMapScreen from "../screens/HomeMapScreen";
//import PointDetailsScreen from "../screens/PointDetailsScreen";
//import FiltersScreen from "../screens/FiltersScreen";
//import ReviewScreen from "../screens/ReviewScreen";
//import FavoritesScreen from "../screens/FavoritesScreen";
//import ActivitiesScreen from "../screens/ActivitiesScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
      <Stack.Navigator
        initialRouteName="HomeMap"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="HomeMap" component={HomeMapScreen} />
{/*         <Stack.Screen name="PointDetails" component={PointDetailsScreen} />
        <Stack.Screen name="Filters" component={FiltersScreen} />
        <Stack.Screen name="Review" component={ReviewScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Activities" component={ActivitiesScreen} /> */}
      </Stack.Navigator>
  );
}