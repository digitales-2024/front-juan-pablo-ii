'use server';
// src/app/(auth)/actions.ts

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginCredentials, AuthResponse } from './types';

const API_URL = process.env.BACKEND_URL;
const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'refresh_token';

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
    console.log('Respuesta del login:', data);

    // Extraer tokens de las cookies de respuesta
    const responseCookies = response.headers.getSetCookie();
    const tokens = {
      accessToken: '',
      refreshToken: ''
    };

    responseCookies.forEach((cookie) => {
      const [cookieString] = cookie.split(";");
      const [cookieName, cookieValue] = cookieString.split("=");
      
      if (cookieName === ACCESS_TOKEN) tokens.accessToken = cookieValue;
      if (cookieName === REFRESH_TOKEN) tokens.refreshToken = cookieValue;
    });

    // Establecer las cookies manualmente
    cookieStore.set(ACCESS_TOKEN, tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    cookieStore.set(REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    cookieStore.set('logged_in', 'true', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    return {
      success: true,
      redirect: "/",
      tokens,
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        isActive: true,
        mustChangePassword: false,
        lastLogin: new Date().toISOString(),
        isSuperAdmin: data.isSuperAdmin,
        roles: data.roles
      }
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