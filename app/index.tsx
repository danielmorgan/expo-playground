import { ActivityIndicator, View } from "react-native";

export interface IndexProps {
  prop: string;
}

export default function Index({ prop }: IndexProps) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color="#000" />
    </View>
  );
}
