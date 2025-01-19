import { Text, View } from "react-native";

export interface SettingsProps {
  prop: string;
}

export default function Settings({ prop }: SettingsProps) {
  return (
    <View>
      <Text>Settings</Text>
    </View>
  );
}
