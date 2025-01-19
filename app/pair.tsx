// pair.tsx
import { useDeviceCode } from "@/hooks/useDeviceCode";
import { usePairing } from "@/hooks/usePairing";
import { router, useNavigation } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Pair() {
  const navigation = useNavigation();
  navigation.setOptions({
    title: "Pairing",
  });

  const { code: remoteCode } = useLocalSearchParams<{ code: string }>();
  const { deviceCode: localCode } = useDeviceCode();
  const { initializePair, loading, error } = usePairing();

  const handlePress = async () => {
    if (remoteCode && localCode) {
      await initializePair(remoteCode, localCode);
      router.dismissTo("/");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>Pairing with:</Text>

      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <TextInput
          style={styles.textInput}
          value={remoteCode}
          spellCheck={false}
        />
      </View>

      <View style={{ flexDirection: "row", marginTop: 16 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={handlePress}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : (
            <Text style={styles.buttonText}>Pair</Text>
          )}
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "flex-start",
    justifyContent: "center",
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
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  textInput: {
    flex: 1,
    textAlign: "center",
    fontSize: 40,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: "#ffffee",
    borderStyle: "solid",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    marginTop: 10,
  },
});
