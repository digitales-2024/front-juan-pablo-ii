import { serverFetch } from "@/utils/serverFetch";

export function loginAction(email: string, password: string) {
    return serverFetch<{ redirect: string }>(
        "/auth/login",
        {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
}
