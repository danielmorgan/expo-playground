import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from "react-native-vision-camera";
import * as Linking from "expo-linking";

export default function Scan() {
  const device = useCameraDevice("back");
  const { hasPermission, requestPermission } = useCameraPermission();
  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      for (const code of codes) {
        if (code.value) {
          const parsed = Linking.parse(code.value);
          console.log(parsed);
          if (parsed.scheme == "com.ruledan.lovenudge") {
            Linking.openURL(code.value);
          }
        }
      }
    },
  });

  useEffect(() => {
    if (!hasPermission) requestPermission();
  }, [hasPermission]);

  if (!hasPermission) {
    <Text style={styles.text}>No Camera Permission.</Text>;
  }

  if (hasPermission && device != null) {
    return (
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        codeScanner={codeScanner}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
  },
});
