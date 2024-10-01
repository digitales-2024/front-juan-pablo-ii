import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { authApi } from "./services/authApi";
import { adminApi } from "./services/adminApi";
import { usersApi } from "./services/usersApi";
import { rolesApi } from "./services/rolesApi";


export const store = configureStore({
reducer: {
[authApi.reducerPath]: authApi.reducer,
[adminApi.reducerPath]: adminApi.reducer,
[usersApi.reducerPath]: usersApi.reducer,
[rolesApi.reducerPath]: rolesApi.reducer,

},
middleware: (getDefaultMiddleware) =>
getDefaultMiddleware()
.concat(authApi.middleware)
.concat(adminApi.middleware)
.concat(usersApi.middleware)
.concat(rolesApi.middleware),

});
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;