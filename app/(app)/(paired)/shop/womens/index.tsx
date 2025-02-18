import { FlatList, StyleSheet, View } from "react-native";
import data from "@/assets/data.json";
import ProductItem from "@/components/ProductItem";
import { useAtom } from "jotai";
import { addToCartAtom, removeFromCartAtom } from "@/store/jotai/cartStore";

export default function WomensClothing() {
  const [, add] = useAtom(addToCartAtom);
  const [, remove] = useAtom(removeFromCartAtom);

  return (
    <View style={styles.container}>
      <FlatList
        data={data.filter((item) => item.category === "women's clothing")}
        renderItem={({ item }) => (
          <ProductItem
            item={item}
            showQuantity={false}
            addProduct={add}
            reduceProduct={remove}
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
