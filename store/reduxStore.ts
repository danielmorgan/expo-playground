import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./redux/counterSlice";
import devToolsEnhancer from "redux-devtools-expo-dev-plugin";

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
  devTools: false,
  enhancers: (getDefaultEnhancers) =>
    getDefaultEnhancers().concat(devToolsEnhancer({ trace: true })),
});
