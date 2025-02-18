import { PairingProvider } from "@/ctx/PairingContext";
import store from "@/store/redux/store";
import { Slot } from "expo-router";
import { Provider } from "react-redux";
import "react-native-devsettings/withAsyncStorage";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PairingProvider>
        <Slot />
      </PairingProvider>
    </Provider>
  );
}
