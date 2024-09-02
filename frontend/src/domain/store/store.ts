import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import { coreApi } from "./api/api";
import { CookieStorage } from "./cookieStorage";

const persistConfig = {
  key: "flood_v1.0.0",
  storage: new CookieStorage({ secure: true }),
  blacklist: ["api", "client"],
};

export const rootReducer = combineReducers({
  [coreApi.reducerPath]: coreApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "client/setError",
          "client/cleanError",
        ],
      },
    }).concat(coreApi.middleware),
});

export const persistor = persistStore(store, {}, () => {});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
