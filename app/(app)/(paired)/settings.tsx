import { useDeviceCode } from "@/hooks/useDeviceCode";
import { usePairing } from "@/hooks/usePairing";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface SettingsProps {
}

export default function Settings({}: SettingsProps) {
  const { unpair, loading } = usePairing();
  const handlePress = async () => {
    await unpair();
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
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
  container: {
    flex: 1,
    padding: 20,
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
