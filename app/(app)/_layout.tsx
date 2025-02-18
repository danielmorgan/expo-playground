import { usePairing } from "@/ctx/PairingContext";
import { Stack, useRootNavigationState, useRouter } from "expo-router";
import { useEffect } from "react";

export default function AppLayout() {
  const router = useRouter();
  const { currentPair, loading } = usePairing();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigationState?.key) return;
    if (loading) return;

    if (!currentPair) {
      router.replace("/(app)/(unpaired)");
    } else {
      router.replace("/(app)/(paired)/(tabs)/products");
    }
  }, [currentPair, loading, rootNavigationState?.key, router]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(unpaired)" options={{ headerShown: false }} />
      <Stack.Screen name="(paired)" options={{ headerShown: false }} />
    </Stack>
  );
}
