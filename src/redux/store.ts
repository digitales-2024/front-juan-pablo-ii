import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { adminApi } from "./services/adminApi";
import { authApi } from "./services/authApi";
import { businessApi } from "./services/businessApi";
import { clientsApi } from "./services/clientApi";
import { designProjectApi } from "./services/designProjectApi";
import { exchangeRateSunatApi } from "./services/exchangeRateSunatApi";
import { observationApi } from "./services/observationApi";
import { projectCharterApi } from "./services/projectCharterApi";
import { quotationsApi } from "./services/quotationApi";
import { resourceApi } from "./services/resourceApi";
import { rolesApi } from "./services/rolesApi";
import { spacesApi } from "./services/spaceApi";
import { usersApi } from "./services/usersApi";
import { zoningApi } from "./services/zoningApi";

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [businessApi.reducerPath]: businessApi.reducer,
        [designProjectApi.reducerPath]: designProjectApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [rolesApi.reducerPath]: rolesApi.reducer,
        [spacesApi.reducerPath]: spacesApi.reducer,
        [clientsApi.reducerPath]: clientsApi.reducer,
        [quotationsApi.reducerPath]: quotationsApi.reducer,
        [exchangeRateSunatApi.reducerPath]: exchangeRateSunatApi.reducer,
        [zoningApi.reducerPath]: zoningApi.reducer,
        [projectCharterApi.reducerPath]: projectCharterApi.reducer,
        [observationApi.reducerPath]: observationApi.reducer,
        [resourceApi.reducerPath]: resourceApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            // Configuración para evitar errores de "non-serializable value"
            serializableCheck: {
                // Ignorar las acciones que no son serializables, específicamente de classApi
                ignoredActions: [
                    "quotationsApi/executeMutation/fulfilled",
                    "quotationsApi/executeMutation/rejected",
                    "observationApi/executeMutation/fulfilled",
                    "observationApi/executeMutation/rejected",
                    "designProjectApi/executeMutation/fulfilled",
                    "designProjectApi/executeMutation/rejected",
                ],
                // Ignorar las rutas en el estado que contienen valores no serializables
                ignoredPaths: [
                    "quotationsApi.mutations",
                    "designProjectApi.mutations",
                    "observationApi.mutations",
                ],
            },
        })
            .concat(authApi.middleware)
            .concat(adminApi.middleware)
            .concat(businessApi.middleware)
            .concat(designProjectApi.middleware)
            .concat(rolesApi.middleware)
            .concat(usersApi.middleware)
            .concat(spacesApi.middleware)
            .concat(clientsApi.middleware)
            .concat(quotationsApi.middleware)
            .concat(exchangeRateSunatApi.middleware)
            .concat(zoningApi.middleware)
            .concat(projectCharterApi.middleware)
            .concat(observationApi.middleware)
            .concat(resourceApi.middleware),
});
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
