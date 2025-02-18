import { FlatList, StyleSheet, View } from "react-native";
import data from "@/assets/data.json";
import ProductItem from "../../components/ProductItem";

export default function Products() {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <ProductItem item={item} showQuantity={false} />
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
