import { BaseQueryFn } from "@reduxjs/toolkit/query";
import {
    fetchBaseQuery,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    credentials: "include", // Envía cookies HttpOnly en cada solicitud
});

export type QueryError = {
    name: string;
    message: string;
    stack: string;
};

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
    // Realiza la solicitud inicial
    let result = await baseQuery(args, api, extraOptions);

    // Verifica si el error es 401 (no autorizado)
    if (result.error && (result.error as FetchBaseQueryError).status === 401) {
        const originalRequest = args as { url: string };
        const isLoginRequest = originalRequest.url.includes("/auth/login");

        if (isLoginRequest) {
            return result;
        }

        // Intento de refresco de token con el endpoint /auth/refresh-token
        const refreshResult = await baseQuery(
            { url: "/auth/refresh-token", method: "POST" },
            api,
            extraOptions,
        );

        if (refreshResult.data) {
            // Si el refresco del token fue exitoso, se reintenta la solicitud original
            result = await baseQuery(args, api, extraOptions);
        } else {
            // Si el refresco del token falló, cierra sesión y redirige al login
            await baseQuery(
                { url: "/auth/logout", method: "POST" },
                api,
                extraOptions,
            );

            // Opcional: despacha una acción para actualizar el estado de autenticación en Redux
            // api.dispatch(logoutAction());

            // Redirecciona al usuario a la página de inicio de sesión
            window.location.href = "/log-in";
        }
    }

    return result;
};

export default baseQueryWithReauth;
