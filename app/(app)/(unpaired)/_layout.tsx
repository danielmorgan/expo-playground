import { Stack } from "expo-router";

export default function UnpairedLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="scan"
        options={{ headerShown: true, headerTitle: "Scan QR Code" }}
      />
      <Stack.Screen
        name="pair"
        options={{ headerShown: true, headerTitle: "Pair" }}
      />
    </Stack>
  );
}
