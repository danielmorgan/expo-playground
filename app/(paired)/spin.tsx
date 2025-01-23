import { StyleSheet, Text, View } from "react-native";

export interface SettingsProps {
  prop: string;
}

export default function Spin({ prop }: SettingsProps) {
  return (
    <View style={styles.container}>
      <Text>Spin</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
