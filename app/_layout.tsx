import { PairingProvider } from "@/ctx/PairingContext";
import store from "@/store/redux/store";
import { Slot } from "expo-router";
import { Provider } from "react-redux";
import { Provider as JotaiProvider } from "jotai";
import "react-native-devsettings/withAsyncStorage";

export default function RootLayout() {
  return (
    <JotaiProvider>
      <Provider store={store}>
        <PairingProvider>
          <Slot />
        </PairingProvider>
      </Provider>
    </JotaiProvider>
  );
}
