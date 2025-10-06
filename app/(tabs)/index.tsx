import { Redirect } from "expo-router";
import "../../globals.css";

export default function HomeScreen() {
  // Redirect to explore tab when accessing the home tab
  return <Redirect href="/(tabs)/explore" />;
}
