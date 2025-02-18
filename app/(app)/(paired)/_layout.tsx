import { PairPresenceProvider } from "@/ctx/PairPresenceContext";
import { Tabs } from "expo-router";
import { View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function PairedTabsLayout() {
  return (
    <PairPresenceProvider>
      <View style={{ flex: 1 }}>
        <Tabs>
          <Tabs.Screen
            name="index"
            options={{
              title: "Power (Supabase realtime)",
              tabBarIcon: ({ color }) => (
                <FontAwesome size={24} name="bolt" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="shop/mens"
            options={{
              title: "Mens (Zustand)",
              tabBarIcon: ({ color }) => (
                <FontAwesome size={24} name="male" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="shop/womens"
            options={{
              title: "Womens (Jotai)",
              tabBarIcon: ({ color }) => (
                <FontAwesome size={24} name="female" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="counter"
            options={{
              title: "Counter (Redux)",
              tabBarIcon: ({ color }) => (
                <FontAwesome size={24} name="calculator" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: "Settings",
              tabBarIcon: ({ color }) => (
                <FontAwesome size={24} name="cog" color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </PairPresenceProvider>
  );
}
