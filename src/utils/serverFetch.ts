import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface FetchOptions extends RequestInit {
    skipAuth?: boolean;
}

/**
 * Represents a computation that may fail.
 *
 * If the computation is successful, the first item will contain
 * the result, and the second will be null.
 * If the computation is an error, the first item will be null,
 * and the second item will contain the error.
 *
 * Even though the type says the first item is not null,
 * it will be null if there is an error. This is done so
 * the result can be used more comfortably.
 *
 * @example
 * const [value, err] = computation()
 * if (err !== null) {
 *     // handle error
 * }
 */
type Result<Success, Error> = [Success, Error | null];

/**
 * Fetches a resource from the backend.
 */
export async function serverFetch<Success>(
    path: string,
    options: FetchOptions = {},
): Promise<Result<Success, Response | Error>> {
    const { ...fetchOptions } = options;
    const url = `${process.env.BACKEND_URL}${path}`;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;

    fetchOptions.headers = {
        ...fetchOptions.headers,
        Cookie: `refresh_token=${refreshToken}; access_token=${accessToken}`,
    };

    let response: Response;
    try {
        response = await fetch(url, fetchOptions);
    } catch (e) {
        // @ts-expect-error allowing null
        return [null, e as Error];
    }

    if (response.status === 401) {
        const isLoginRequest = path.includes("/auth/login");

        if (!isLoginRequest) {
            // Try token refresh
            let refreshResponse: Response;
            try {
                refreshResponse = await fetch(
                    process.env.BACKEND_URL + "/auth/refresh-token",
                    {
                        method: "POST",
                        headers: {
                            Cookie: `refresh_token=${refreshToken}; access_token=${accessToken}`,
                        },
                    },
                );
            } catch (e) {
                // @ts-expect-error allowing null
                return [null, e as Error];
            }

            if (refreshResponse.ok) {
                // Retry original request
                const newCookies = refreshResponse.headers.getSetCookie();
                fetchOptions.headers = {
                    ...fetchOptions.headers,
                    Cookie: newCookies.join(";"),
                };

                try {
                    response = await fetch(url, fetchOptions);
                } catch (e) {
                    // @ts-expect-error allowing null
                    return [null, e as Error];
                }
            } else {
                // Logout and redirect
                try {
                    await serverFetch(
                        process.env.BACKEND_URL + "/auth/logout",
                        {
                            method: "POST",
                        },
                    );
                } catch (e) {
                    // @ts-expect-error allowing null
                    return [null, e as Error];
                } finally {
                    redirect("/log-in");
                }
            }
        }
    }

    if (!response.ok) {
        console.error(`Failed to fetch ${path}:`, response.status);
        // @ts-expect-error allowing null
        return [null, response];
    }

    const result: Success = await response.json();
    return [result, null];
}