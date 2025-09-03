import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type WikiSummary = {
  title: string;
  extract: string;
  thumbnail?: { source: string; width: number; height: number };
};

export default function CountryDetailScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();
  const [wikiSummary, setWikiSummary] = useState<WikiSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const styles = getStyles(theme);

  useEffect(() => {
    if (name) {
      fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          name
        )}`
      )
        .then((res) => res.json())
        .then((data) => {
          setWikiSummary(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [name]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Loading details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Theme Toggle */}
      <TouchableOpacity
        style={styles.toggleBtn}
        onPress={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <Text style={styles.toggleText}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </Text>
      </TouchableOpacity>

      {/* Country Details */}
      {wikiSummary && (
        <View style={{ marginTop: 16 }}>
          {wikiSummary.thumbnail?.source && (
            <Image
              source={{ uri: wikiSummary.thumbnail.source }}
              style={styles.image}
              resizeMode="contain"
            />
          )}
          <Text style={styles.title}>{wikiSummary.title}</Text>
          <Text style={styles.extract}>{wikiSummary.extract}</Text>
        </View>
      )}
    </ScrollView>
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
    backBtn: {
      padding: 8,
      marginBottom: 12,
    },
    backText: {
      fontSize: 16,
      color: theme === "dark" ? "#fff" : "#000",
    },
    toggleBtn: {
      padding: 8,
      borderRadius: 8,
      backgroundColor: theme === "dark" ? "#333" : "#ddd",
      alignSelf: "flex-end",
    },
    toggleText: {
      color: theme === "dark" ? "#fff" : "#000",
    },
    image: {
      width: "100%",
      height: 200,
      borderRadius: 8,
      marginBottom: 12,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 8,
      color: theme === "dark" ? "#fff" : "#000",
    },
    extract: {
      fontSize: 16,
      lineHeight: 22,
      color: theme === "dark" ? "#ddd" : "#333",
    },
  });
}
