import { jwtDecode, JwtPayload } from "jwt-decode";

// Decodifica el token jwt y devuelve el objeto decodificado
export function decodeToken(token: string): JwtPayload {
    // Decodificar el token
    const decodedToken = jwtDecode(token);

    return decodedToken;
}
