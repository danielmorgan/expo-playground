import { Link, useNavigation } from "expo-router";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCodeStyled from "react-native-qrcode-styled";
import { useDeviceCode } from "@/hooks/useDeviceCode";
import { useMemo } from "react";

export default function Unpaired() {
  const navigation = useNavigation();
  navigation.setOptions({
    title: "Set up Love Nudge",
  });

  const { deviceCode, isLoading, error } = useDeviceCode();
  const pairUrl = useMemo(
    () => `com.ruledan.lovenudge://pair?code=${deviceCode}`,
    [deviceCode]
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Failed to load device code: {error.message}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: 30,
        paddingHorizontal: 16,
      }}
    >
      <QRCodeStyled
        data={pairUrl}
        style={styles.svg}
        padding={25}
        pieceSize={8}
        pieceBorderRadius={4}
        isPiecesGlued
        gradient={{
          type: "linear",
          options: {
            start: [0, 0],
            end: [1, 1],
            colors: ["#da0c8b", "#ffac8b"],
            locations: [1, 0],
          },
        }}
        pieceScale={1.02}
      />

      <View style={styles.container}>
        <Text style={styles.title}>Your Device Code</Text>
        <View style={styles.codeContainer}>
          <Text style={styles.code}>{deviceCode}</Text>
        </View>
        <Text style={styles.subtitle}>
          This is your unique device identifier
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 16,
          marginTop: 16,
        }}
      >
        <TouchableOpacity style={styles.button}>
          <Link style={styles.buttonText} href={"/scan"}>
            📷 Scan
          </Link>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Link style={styles.buttonText} href={"/pair"}>
            Pair with code
          </Link>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  svg: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0px 10px 10px rgba(20, 0, 0, 0.15)",
  },
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  codeContainer: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 12,
  },
  code: {
    fontSize: 28,
    letterSpacing: 2,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    color: "#000000",
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
  },
  errorContainer: {
    padding: 16,
    backgroundColor: "#ffebee",
    borderRadius: 8,
    margin: 20,
  },
  errorText: {
    color: "#c62828",
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
});
