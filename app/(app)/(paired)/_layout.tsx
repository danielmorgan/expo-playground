import { Stack } from "expo-router";

export default function PairedLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="cart"
        options={{
          title: "Cart",
          presentation: "modal",
          animation: "ios_from_right",
        }}
      />
    </Stack>
  );
}
