import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import data from "@/assets/data.json";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Products() {
  const renderItem: ListRenderItem<(typeof data)[0]> = ({ item }) => (
    <View style={styles.cartItemContainer}>
      <View style={styles.cartItemDetail}>
        <Image src={item.image} style={styles.cartItemImage} />
        <View>
          <Text style={styles.cartItemName}>{item.title}</Text>
          <Text>${item.price}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="remove" size={20} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Ionicons name="add" size={20} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
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
    gap: 10,
    marginBottom: 10,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cartItemImage: {
    width: 50,
    height: 50,
    objectFit: "cover",
  },
  buttonContainer: {
    flexDirection: "row",
  },
});
