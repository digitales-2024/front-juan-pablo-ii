import { Card } from '@/components/ui/card';
import { UserAuthForm } from './_components/user-auth-form';
import { LogoJP } from '@/assets/images/LogoJP';

export default function SignIn2() {
  return (
    <div className="container relative grid h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Columna izquierda */}
      <div className="relative hidden h-full flex-col bg-muted p-10 text-gray-600 dark:border-r lg:flex">
        <div className="relative z-20 flex flex-col items-center justify-center text-lg font-medium h-full">
          <LogoJP className='h-32'/>
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Esta plataforma me ha ayudado a gestionar de manera más eficiente todos 
              los procesos administrativos de mi empresa.&rdquo;
            </p>
            <footer className="text-sm">Chupetin Trujillo</footer>
          </blockquote>
        </div>
      </div>

      {/* Columna derecha - Formulario */}
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card className="p-6">
            <div className="flex flex-col space-y-2 text-left">
              <h1 className="text-2xl font-semibold tracking-tight">
                Iniciar Sesión
              </h1>
              <p className="text-sm text-muted-foreground">
                Ingresa tus credenciales para acceder a tu cuenta
              </p>
            </div>
            <UserAuthForm />
          </Card>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Al iniciar sesión, aceptas nuestros{' '}
            <a 
              href="/terms" 
              className="underline underline-offset-4 hover:text-primary"
            >
              Términos de servicio
            </a>{' '}
            y{' '}
            <a 
              href="/privacy" 
              className="underline underline-offset-4 hover:text-primary"
            >
              Política de privacidad
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}