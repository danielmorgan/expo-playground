import { PairPresenceProvider } from "@/ctx/PairPresenceContext";
import { Link, Tabs } from "expo-router";
import { Pressable, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function PairedLayout() {
  return (
    <PairPresenceProvider>
      <View style={{ flex: 1 }}>
        <Tabs>
          <Tabs.Screen
            name="index"
            options={{
              title: "Power",
              tabBarIcon: ({ color }) => (
                <FontAwesome size={24} name="bolt" color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="products"
            options={{
              title: "Products",
              tabBarIcon: ({ color }) => (
                <FontAwesome size={24} name="shopping-bag" color={color} />
              ),
              headerRight: () => (
                <Link href="/(app)/(paired)/cart" asChild>
                  <Pressable style={{ marginRight: 16 }}>
                    {({ pressed }) => (
                      <FontAwesome
                        name="shopping-cart"
                        size={24}
                        color={pressed ? "#999" : "#000"}
                      />
                    )}
                  </Pressable>
                </Link>
              ),
            }}
          />
          <Tabs.Screen
            name="cart"
            options={{
              title: "Cart",
              tabBarIcon: ({ color }) => (
                <FontAwesome size={24} name="shopping-cart" color={color} />
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
