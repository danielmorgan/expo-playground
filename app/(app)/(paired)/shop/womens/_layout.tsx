import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

export default function ShopCategoryTabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Catalog",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="list" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={24} name="shopping-cart" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
