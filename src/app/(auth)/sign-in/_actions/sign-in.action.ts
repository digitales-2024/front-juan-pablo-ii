'use server';

import { z } from 'zod';
import { http } from '@/utils/clientFetch';
import { AuthResponse, LoginAuthDto, Profile, UserResponse } from '../_interfaces/auth.interface';
import { cookies } from 'next/headers';

const SignInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña debe tener al menos 1 carácter'),
});

export async function signIn(data: LoginAuthDto) {
  try {
    const validation = SignInSchema.safeParse(data);
    
    if (!validation.success) {
      return { 
        validationErrors: validation.error.flatten().fieldErrors 
      };
    }

    const { data: responseData, headers } = await http.post<UserResponse>('/auth/login', data);
    
    if (!responseData?.id) {
      return { error: 'Credenciales inválidas' };
    }

    const cookieStore = await cookies();
    const setCookieHeaders = headers?.['set-cookie'] || [];
    
   

    // Primero eliminamos las cookies existentes
    cookieStore.delete('logged_in');
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    // Establecemos las nuevas cookies
    if (Array.isArray(setCookieHeaders)) {
      setCookieHeaders.forEach(cookie => {

        // Extraemos el nombre y valor de la cookie
        const [nameValue] = cookie.split(';');
        const [name, value] = nameValue.split('=');

        // Establecemos la cookie
        cookieStore.set(name, value, {
          httpOnly: cookie.includes('HttpOnly'),
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
        });
      });
    }

    // Verificamos las cookies establecidas
    const allCookies = cookieStore.getAll();

    const profile: Profile = {
      id: responseData.id,
      name: responseData.name,
      email: responseData.email,
      phone: responseData.phone,
      roles: responseData.roles || [],
      isSuperAdmin: responseData.isSuperAdmin,
      isActive: true,
      mustChangePassword: false,
      lastLogin: new Date().toISOString()
    };

    return { data: profile };
  } catch (error: any) {
    return { 
      error: error?.message || 'Error al iniciar sesión'
    };
  }
}
