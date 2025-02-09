import { PresenceBadge } from "@/components/PresenceBadge";
import { PairPresenceProvider } from "@/ctx/PairPresenceContext";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function PairedLayout() {
  return (
    <PairPresenceProvider>
      <View style={{ flex: 1 }}>
        <View style={{ alignItems: "flex-end", paddingTop: 20, paddingHorizontal: 20 }}>
          <PresenceBadge />
        </View>

        <Tabs screenOptions={{ headerShown: false }}>
          <Tabs.Screen name="index" options={{ title: "Home" }} />
          <Tabs.Screen name="settings" options={{ title: "Settings" }} />
        </Tabs>
      </View>
    </PairPresenceProvider >
  );
}
