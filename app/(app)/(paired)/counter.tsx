import { decrement, increment } from "@/store/redux/counterSlice";
import { Button, StyleSheet, Text, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";

export default function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Button title="-" onPress={() => dispatch(decrement())} />
        <Text style={{ fontSize: 16 }}>{count}</Text>
        <Button title="+" onPress={() => dispatch(increment())} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
