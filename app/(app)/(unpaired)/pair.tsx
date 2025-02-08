import { useDeviceCode } from "@/hooks/useDeviceCode";
import { usePairing } from "@/ctx/PairingContext";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const { code: remoteCode } = useLocalSearchParams<{ code: string }>();
  const [inputCode, setInputCode] = useState<string>(remoteCode || "");
  const { deviceCode: localCode } = useDeviceCode();
  const { initializePair, error, loading } = usePairing();
  const buttonDisabled = useMemo(
    () => !inputCode || !localCode,
    [inputCode, localCode]
  );

  const handlePress = async () => {
    if (inputCode && localCode) {
      await initializePair(inputCode, localCode);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>Pairing with:</Text>

      <View style={{ flexDirection: "row", marginTop: 8 }}>
        <TextInput
          style={styles.textInput}
          value={inputCode}
          spellCheck={false}
          onChange={(e) => setInputCode(e.nativeEvent.text)}
        />
      </View>

      <View style={{ flexDirection: "row", marginTop: 16 }}>
        <TouchableOpacity
          style={styles.button}
          onPress={handlePress}
          disabled={buttonDisabled || loading}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : buttonDisabled ? (
            <Text style={[{ color: "#ccc" }, styles.buttonText]}>Pair</Text>
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
