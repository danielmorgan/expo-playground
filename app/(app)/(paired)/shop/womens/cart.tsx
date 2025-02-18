import { Button, FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductItem from "@/components/ProductItem";
import { useAtom, useAtomValue } from "jotai";
import {
  addToCartAtom,
  clearCartAtom,
  getCartItemsAtom,
  removeFromCartAtom,
  totalAtom,
} from "@/store/jotai/cartStore";

export default function CartModal() {
  const cartItems = useAtomValue(getCartItemsAtom);
  const total = useAtomValue(totalAtom);
  const [, add] = useAtom(addToCartAtom);
  const [, remove] = useAtom(removeFromCartAtom);
  const [, clear] = useAtom(clearCartAtom);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={({ item }) => (
          <ProductItem
            item={item}
            showQuantity={true}
            addProduct={add}
            reduceProduct={remove}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        style={{ paddingTop: 16 }}
        ListFooterComponent={<Text>Total: ${total.toFixed(2)}</Text>}
      />

      <Button title="Clear Cart" onPress={clear} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
