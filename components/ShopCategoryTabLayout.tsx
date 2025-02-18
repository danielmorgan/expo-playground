import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Text, View } from "react-native";

export default function ShopCategoryTabLayout({
  cartCount,
}: {
  cartCount: number;
}) {
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
            <View>
              <FontAwesome size={24} name="shopping-cart" color={color} />
              <View
                style={{
                  position: "absolute",
                  right: -10,
                  top: 10,
                  borderRadius: 8,
                  width: 16,
                  height: 16,
                  backgroundColor: "#E0E9F2",
                  elevation: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 9,
                    fontWeight: "bold",
                    color: "midnightblue",
                  }}
                >
                  {cartCount}
                </Text>
              </View>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
