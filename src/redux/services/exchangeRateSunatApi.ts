import { createApi } from "@reduxjs/toolkit/query/react";

import baseQueryWithReauth from "../baseQuery";

export const exchangeRateSunatApi = createApi({
    reducerPath: "exchangeRateSunatApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Change Sunat"],
    endpoints: (build) => ({
        // Obtener el exchange rate de la sunat
        getExchangeRateSunat: build.query<string, void>({
            query: () => ({
                url: "/change-sunat",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Change Sunat"],
        }),
    }),
});

export const { useGetExchangeRateSunatQuery } = exchangeRateSunatApi;
