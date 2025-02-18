import { FlatList, StyleSheet, View } from "react-native";
import data from "@/assets/data.json";
import ProductItem from "@/components/ProductItem";

export default function MensClothing() {
  return (
    <View style={styles.container}>
      <FlatList
        data={data.filter((item) => item.category === "women's clothing")}
        renderItem={({ item }) => (
          <ProductItem
            item={item}
            showQuantity={true}
            addProduct={() => console.log("add1")}
            reduceProduct={() => console.log("reduce1")}
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
