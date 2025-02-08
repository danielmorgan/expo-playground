import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { usePairing } from "@/hooks/usePairing";
import { router } from "expo-router";

export default function Index() {
  const { currentPair, unpair, loading } = usePairing();

  const handlePress = async () => {
    await unpair();
    router.replace("/(unpaired)");
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
      <Text style={styles.title}>Paired with:</Text>
      <Text style={styles.title}>{currentPair}</Text>

      <View style={{ flexDirection: "row", marginTop: 16 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={handlePress}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Unpair</Text>
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
