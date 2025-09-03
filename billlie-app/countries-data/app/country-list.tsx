import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Country = {
  cca3: string;
  name: { common: string; official: string };
  population: number;
  flags?: { png?: string };
  continents?: string[];
};

export default function CountryListScreen() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const router = useRouter();

  const styles = getStyles(theme);

  useEffect(() => {
    fetch(
      "https://restcountries.com/v3.1/all?fields=name,population,cca3,flags,continents"
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCountries(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Loading countries...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Theme Toggle */}
      <TouchableOpacity
        style={styles.toggleBtn}
        onPress={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <Text style={styles.toggleText}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </Text>
      </TouchableOpacity>

      {/* Search */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search country..."
        placeholderTextColor={theme === "dark" ? "#aaa" : "#666"}
        value={search}
        onChangeText={setSearch}
      />

      {/* Country List */}
      <FlatList
        data={countries.filter((c) =>
          c.name.common.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(item) => item.cca3}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/country-detail",
                params: { code: item.cca3, name: item.name.common },
              })
            }
          >
            {item.flags?.png && (
              <Image source={{ uri: item.flags.png }} style={styles.flag} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name.common}</Text>
              <Text style={styles.info}>
                Population: {item.population.toLocaleString()}
              </Text>
              <Text style={styles.info}>
                Continent: {item.continents?.join(", ") ?? "N/A"}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function getStyles(theme: "light" | "dark") {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme === "dark" ? "#121212" : "#f9f9f9",
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme === "dark" ? "#121212" : "#fff",
    },
    text: {
      color: theme === "dark" ? "#fff" : "#000",
    },
    toggleBtn: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: theme === "dark" ? "#333" : "#ddd",
      alignSelf: "flex-end",
      marginBottom: 12,
    },
    toggleText: {
      color: theme === "dark" ? "#fff" : "#000",
    },
    searchInput: {
      borderWidth: 1,
      borderColor: theme === "dark" ? "#444" : "#ccc",
      padding: 10,
      marginBottom: 16,
      borderRadius: 8,
      color: theme === "dark" ? "#fff" : "#000",
      backgroundColor: theme === "dark" ? "#222" : "#fff",
    },
    card: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      marginBottom: 10,
      backgroundColor: theme === "dark" ? "#1e1e1e" : "#fff",
      borderRadius: 8,
      elevation: 2,
    },
    flag: {
      width: 48,
      height: 32,
      marginRight: 12,
      borderRadius: 4,
    },
    name: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme === "dark" ? "#fff" : "#000",
    },
    info: {
      fontSize: 14,
      color: theme === "dark" ? "#bbb" : "#555",
    },
  });
}
