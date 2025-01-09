import ImagePlaceholder from "@/assets/images/imageLogin.jpg";
import ImageLogin from "@/assets/images/logoLogin.webp";
import Image from "next/image";

import { FormLogin } from "./_components/FormLogin";

export default function LogIn() {
    return (
        <div className="relative flex h-screen w-full">
            {/* Lado Izquierdo con Imagen de Fondo */}
            <div className="relative flex w-1/2 items-center justify-center">
                <Image
                    src={ImagePlaceholder}
                    alt="Imagen de fondo"
                    layout="fill"
                    objectFit="cover"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="relative z-10 text-center text-white">
                    <h1 className="text-5xl font-bold">Welcome Back!</h1>
                </div>
            </div>

            {/* Lado Derecho con Formulario */}
            <div className="flex w-1/2 flex-col items-center justify-start">
                <div className="flex flex-col items-center">
                    {/* Imagen del Logo de la Clínica */}
                    <Image
                        src={ImageLogin}
                        alt="Logo de la Clínica"
                        width={400} // Ajusta el ancho según sea necesario
                        height={400} // Ajusta la altura según sea necesario
                    />
                    <FormLogin />
                </div>
            </div>
        </div>
    );
}
