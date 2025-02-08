import { StyleSheet, Text, View } from "react-native";

export interface SettingsProps {
  prop: string;
}

export default function Settings({ prop }: SettingsProps) {
  return (
    <View style={styles.container}>
      <Text>Settings</Text>
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
