import { CustomErrorData } from "@/types/error";
import { translateError } from "@/utils/translateError";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import {
    fetchBaseQuery,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";

const baseQuery: BaseQueryFn = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    credentials: "include", // Enviar cookies HttpOnly en cada solicitud
});

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    // Si obtenemos un 401 Unauthorized, intentamos refrescar el token
    if (result.error && (result.error as FetchBaseQueryError).status === 401) {
        // Intentamos obtener un nuevo access_token usando el refresh_token
        const refreshResult = await baseQuery(
            { url: "/auth/refresh-token", method: "POST" },
            api,
            extraOptions,
        );
        if (refreshResult.data) {
            // Reintenta la solicitud original con el nuevo token
            result = await baseQuery(args, api, extraOptions);
        } else {
            // Si no se pudo refrescar el token (refresh token expirado), llamamos al endpoint de logout
            await baseQuery(
                { url: "/auth/logout", method: "POST" },
                api,
                extraOptions,
            );

            window.location.href = "/auth/login";
        }
    }

    // If the response has an error field, it must not be in the 2xx range.
    // Make those throw an error
    if (
        result.error &&
        typeof result.error === "object" &&
        "data" in result.error
    ) {
        const error = (result.error.data as CustomErrorData).message;
        const message = translateError(error as string);
        throw new Error(message);
    }
    if (result.error) {
        throw new Error(
            "Ocurrió un error inesperado, por favor intenta de nuevo",
        );
    }

    return result;
};

export default baseQueryWithReauth;
