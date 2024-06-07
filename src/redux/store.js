import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

import { userReducer } from "./reducers/userReducer";

const persistConfig = {
  storage: AsyncStorage,
  key: "root",
  blacklist: [], // add reducers that you don't wish to persist
  // whitelist: [], // enable this to disable persisting temporarily,
  stateReconciler: autoMergeLevel2,
};
const rootReducer = combineReducers({
  userReducer,
});

export const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
