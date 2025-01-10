'use server';

import { cookies } from "next/headers";
import { LoginResponse, LoginCredentials } from './types';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api/v1';

export async function loginAction(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const cookieStore = await cookies();
  
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include",
    });
    const data = await response.json();
    console.log('Response body:', data);
    if (!response.ok) {
      return {
        success: false,
        message: "Credenciales inválidas",
      };
    }

    // Procesar cookies de la respuesta
    const responseCookies = response.headers.getSetCookie();
    responseCookies.forEach((cookie) => {
      const [cookieString] = cookie.split(";");
      const [cookieName, cookieValue] = cookieString.split("=");
      cookieStore.set(cookieName, cookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    });

    return {
      success: true,
      redirect: "/",
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

export async function logoutAction(): Promise<LoginResponse> {
  const cookieStore = await cookies();
  
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: await getAuthHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error al cerrar sesión");
    }

    // Limpiar cookies
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    return {
      success: true,
      redirect: "/sign-in",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error al cerrar sesión",
    };
  }
}