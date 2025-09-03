import { Link } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Home() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20, color: 'orange' }}>Welcome 👋</Text>
      <Link href="/country-list" asChild>
        <Button title="Go to Country List" />
      </Link>
    </View>
  );
}
