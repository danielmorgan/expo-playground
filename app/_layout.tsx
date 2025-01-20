import { usePairing } from "@/hooks/usePairing";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function RootLayout() {
  const router = useRouter();
  const { currentPair, loading } = usePairing();

  useEffect(() => {
    console.log("redirecting", { currentPair, loading });
    if (!loading) {
      if (!currentPair) {
        router.replace("/(unpaired)");
      } else {
        router.replace("/(paired)");
      }
    }
  }, [currentPair, loading]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(unpaired)" options={{ headerShown: false }} />
      <Stack.Screen name="(paired)" options={{ headerShown: false }} />
    </Stack>
  );
}
