import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Product } from "@/store/interfaces";

interface ProductItemProps {
  item: Product & { quantity?: number };
  showQuantity?: boolean;
  addProduct: (item: Product) => void;
  reduceProduct: (item: Product) => void;
}

export default function ProductItem({
  item,
  showQuantity,
  addProduct,
  reduceProduct,
}: ProductItemProps) {
  return (
    <View style={styles.cartItemContainer}>
      <View style={styles.cartItemDetail}>
        <Image src={item.image} style={styles.cartItemImage} />
        <View style={styles.cartItemText}>
          <Text style={styles.cartItemName}>{item.title}</Text>
          <Text>${item.price}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => reduceProduct(item)}>
          <Ionicons
            name={item.quantity === 1 ? "trash-bin" : "remove-circle"}
            size={20}
            color={item.quantity === 1 ? "red" : "#000"}
          />
        </TouchableOpacity>
        {showQuantity && <Text>{item.quantity}</Text>}
        <TouchableOpacity onPress={() => addProduct(item)}>
          <Ionicons name="add-circle" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },
  cartItemDetail: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 10,
  },
  cartItemText: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  cartItemImage: {
    width: 60,
    height: 60,
    objectFit: "cover",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
