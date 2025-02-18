import { FlatList, StyleSheet, View } from "react-native";
import data from "@/assets/data.json";
import ProductItem from "@/components/ProductItem";
import useCartStore from "@/store/zustand/cartStore";

export default function MensClothing() {
  const { addProduct, reduceProduct } = useCartStore();

  return (
    <View style={styles.container}>
      <FlatList
        data={data.filter((item) => item.category === "men's clothing")}
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
