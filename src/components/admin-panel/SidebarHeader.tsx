import { LogoJuanPablo } from "@/assets/icons/LogoTrazo";
import ImageLogin from "@/assets/images/logo.webp";
import Image from "next/image";
import Link from "next/link";
interface SidebarHeaderProps {
    isOpen: boolean;
}

export const SidebarHeader = ({ isOpen }: SidebarHeaderProps) => {
    return (
        <Link href="/">
            <div
                className={` ${isOpen ? "open px-8 py-3" : "closed items-center justify-center py-2"} flex items-center justify-center`}
            >
                <div
                    className={`inline-flex items-center justify-center justify-items-center rounded p-2 ${isOpen ? "w-full" : ""}`}
                >
                    {isOpen ? (
                        <Image
                            src={ImageLogin}
                            alt="Imagen de fondo"
                            width={110}
                            height={22}
                            className="inset-0 object-cover"
                        />
                    ) : (
                        <LogoJuanPablo />
                    )}
                </div>
            </div>
        </Link>
    );
};
