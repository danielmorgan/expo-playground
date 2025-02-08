import { ActivityIndicator, View } from "react-native";

export interface IndexProps {
}

export default function Index({}: IndexProps) {
  console.log('/(app)/index');
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#0000cc" />
    </View>
  );
}
