import { Card } from "@/components/ui/card";
import { UserAuthForm } from "./_components/user-auth-form";
import { LogoJP } from "@/assets/images/LogoJP";
import Image from "next/image";
import fondoLogin from "@/assets/images/fondoLogin.webp";
import { Check, Hospital } from "lucide-react"; 

export default function SignIn2() {
  return (
    <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 lg:px-0 overflow-hidden">
      {/* Columna izquierda - Solo visible en desktop */}
      <div className="relative hidden h-full flex-col bg-muted text-gray-600 lg:flex">
        <div className="absolute inset-0 z-10 backdrop-blur-sm" />

        {/* Imagen de fondo relacionada con estética */}
        <div className="absolute inset-0 z-0">
          <Image
            src={fondoLogin}
            alt="Clínica Estética"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>

        {/* Sombra suave en el borde derecho */}
        <div className="absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white/40 to-transparent z-30"></div>

        {/* Logo y texto */}
        <div className="relative z-20 flex flex-col items-center justify-center h-full space-y-6">
          <LogoJP className="h-40 w-auto" />
        </div>
      </div>

      {/* Columna derecha - Formulario */}
      <div className="flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        {/* Sombra suave en el borde izquierdo */}
        <div className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-gray-300/20 to-transparent z-10 hidden lg:block"></div>
        
        <div className="mx-auto w-full max-w-sm sm:max-w-md px-4 relative z-20">
          {/* Logo para móvil */}
          <div className="flex justify-center mb-8 lg:hidden">
            <LogoJP className="h-24 w-auto" />
          </div>

          <Card className="p-6 shadow-xl border-0 sm:p-8 rounded-xl bg-white">
            <div className="flex flex-col space-y-2 text-center mb-6">
              <div className="mx-auto bg-primary/10 p-3 rounded-full mb-2">
                <Hospital className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-primary">
                Bienvenido
              </h1>
              <p className="text-sm text-muted-foreground">
                Inicie sesión para acceder al sistema
              </p>
            </div>

            <UserAuthForm />

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-muted-foreground">
                    Información de acceso
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Gestión clinica</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Panel administrativo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Panel medico</span>
                  </li>
               
                </ul>
              </div>
            </div>
          </Card>

          <div className="mt-6 text-center text-sm text-gray-500">
            © 2025 Juan Pablo II. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </div>
  );
}
