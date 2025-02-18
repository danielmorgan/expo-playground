import { Button, FlatList, StyleSheet, Text } from "react-native";
import useCartStore from "@/store/redux/cartStore";
import { SafeAreaView } from "react-native-safe-area-context";
import ProductItem from "@/components/ProductItem";

export default function CartModal() {
  const { products, total, clearCart, addProduct, reduceProduct } =
    useCartStore();

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <ProductItem
            item={item}
            showQuantity={true}
            addProduct={addProduct}
            reduceProduct={reduceProduct}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        style={{ paddingTop: 16 }}
        ListFooterComponent={<Text>Total: ${total().toFixed(2)}</Text>}
      />

      <Button title="Clear Cart" onPress={clearCart} />
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
