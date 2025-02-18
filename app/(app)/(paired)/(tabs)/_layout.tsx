import { PairPresenceProvider } from "@/ctx/PairPresenceContext";
import { Link, Tabs } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import useCartStore from "@/store/cartStore";

const CartButton = () => {
  const { items } = useCartStore();

  return (
    <Link href="/(app)/(paired)/cart" asChild>
      <Pressable style={{ marginRight: 16, position: "relative" }}>
        <View style={styles.countContainer}>
          <Text style={styles.countText}>{Number(items()).toString()}</Text>
        </View>
        <Ionicons name="cart" size={24} />
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  countContainer: {
    position: "absolute",
    zIndex: 1,
    bottom: -5,
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "rgb(15 133 99)",
  },
});

export default function PairedTabsLayout() {
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
              headerRight: () => <CartButton />,
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
