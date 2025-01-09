"use server";

import { cookies } from "next/headers";

interface LoginResponse {
  success: boolean;
  message?: string;
  redirect?: string;
}

export async function loginAction(
  email: string,
  password: string
): Promise<LoginResponse> {
  const cookieStore = await cookies();

  try {
    const response = await fetch("http://localhost:5000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
      credentials: "include", // Importante para manejar cookies
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Credenciales inválidas",
      };
    }

    // Extraer las cookies de la respuesta
    const responseCookies = response.headers.getSetCookie();

    // Procesar cada cookie y establecerla en el lado del servidor
    responseCookies.forEach((cookie) => {
      // Parsear la cookie para obtener nombre y valor
      const [cookieString] = cookie.split(";");
      const [cookieName, cookieValue] = cookieString.split("=");

      // Establecer cada cookie con las opciones adecuadas
      cookieStore.set(cookieName, cookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    });

    // Si el login es exitoso, redirigir a la página principal
    return {
      success: true,
      redirect: "/", // En lugar de redireccionar, devolvemos la URL
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error en el servidor",
    };
  }
}

export async function getAuthHeaders() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");
  const refreshToken = cookieStore.get("refresh_token");

  return {
    Authorization: `Bearer ${accessToken?.value}`,
    Cookie: `access_token=${accessToken?.value}; refresh_token=${refreshToken?.value}`,
  };
}
