'use server';

import { cookies } from 'next/headers';

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    
    // Eliminamos las cookies existentes
    cookieStore.delete('logged_in');
    cookieStore.delete('access_token');
    cookieStore.delete('refresh_token');

    // Establecemos las cookies con fecha de expiración en el pasado
    cookieStore.set('logged_in', '', {
      expires: new Date(0),
      path: '/',
      sameSite: 'strict'
    });
    
    cookieStore.set('access_token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      sameSite: 'strict'
    });
    
    cookieStore.set('refresh_token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      sameSite: 'strict'
    });

    return { 
      success: true,
      redirect: '/sign-in'
    };
  } catch (error) {
    console.error('Error en logout:', error);
    return { 
      success: false,
      error: 'Error al cerrar sesión'
    };
  }
} 