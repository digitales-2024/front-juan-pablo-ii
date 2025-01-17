
// export interface ExtendedUser extends Omit<Profile, 'roles'> {
//   name: string;
//   email: string;
//   phone?: string;
//   roles: Record<string, never>[];
//   isSuperAdmin: boolean;
//   isActive: boolean;
//   mustChangePassword: boolean;
//   lastLogin?: string;
// }

// export interface UserResponse {
//   name: string;
//   email: string;
//   phone?: string;
//   roles?: Array<{ name: string }>;
//   isSuperAdmin: boolean;
//   lastLogin?: Date;
// }

// // Helper para transformar el usuario
// export function toProfile(user: ExtendedUser): Profile {
//   return {
//     ...user,
//     roles: user.roles || [],
//     lastLogin: user.lastLogin || undefined
//   };
// }
