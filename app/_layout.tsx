import { usePairing } from "@/hooks/usePairing";
import { Stack, useFocusEffect, useRouter } from "expo-router";

export default function RootLayout() {
  const router = useRouter();
  const { currentPair, loading } = usePairing();

  useFocusEffect(() => {
    if (!loading) {
      if (!currentPair) {
        router.replace("/unpaired");
      } else {
        router.replace("/(paired)");
      }
    }
  });

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="unpaired" options={{ headerShown: false }} />
      <Stack.Screen name="scan" />
      <Stack.Screen name="pair" />
      <Stack.Screen name="(paired)" options={{ title: "Nudger" }} />
    </Stack>
  );
}
