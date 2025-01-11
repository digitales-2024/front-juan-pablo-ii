'use server';
// src/app/(auth)/actions.ts

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginCredentials, AuthResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function loginAction(
  credentials: LoginCredentials
): Promise<AuthResponse> {
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

    if (!response.ok) {
      return {
        success: false,
        message: "Credenciales inválidas",
      };
    }

    const data = await response.json();
    console.log(data);
    

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
      redirect: "/dashboard",
    };
  } catch (error) {
    console.error('Error en login:', error);
    return {
      success: false,
      message: "Error en el servidor",
    };
  }
}

export async function logoutAction(): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error al cerrar sesión");
    }

    // Limpiar cookies
    const cookieStore = await cookies();
    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");
    cookieStore.delete("logged_in");

    return {
      success: true,
      redirect: "/sign-in",
    };
  } catch (error) {
    console.error('Error en logout:', error);
    return {
      success: false,
      message: "Error al cerrar sesión",
    };
  }
}

// export async function updatePasswordAction(
//   updatePasswordDto: UpdatePasswordCredentials
// ): Promise<AuthResponse> {
//   try {
//     const response = await fetch(`${API_URL}/auth/update-password`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(updatePasswordDto),
//       credentials: "include",
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       return {
//         success: false,
//         message: error.message || "Error al actualizar contraseña",
//       };
//     }

//     return {
//       success: true,
//       message: "Contraseña actualizada exitosamente",
//       redirect: "/dashboard",
//     };
//   } catch (error) {
//     console.error('Error actualizando contraseña:', error);
//     return {
//       success: false,
//       message: "Error en el servidor",
//     };
//   }
// }

export async function requireAuth() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token");

  if (!accessToken) {
    redirect("/sign-in");
  }

  try {
    const response = await fetch(`${API_URL}/auth/verify`, {
      headers: {
        Cookie: `access_token=${accessToken.value}`,
      },
    });

    if (!response.ok) {
      redirect("/sign-in");
    }

    return await response.json();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    redirect("/sign-in");
  }
}