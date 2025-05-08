"use client";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import { NavGroup } from "@/components/layout/NavGroup";
import { NavUser } from "@/components/layout/NavUser";
import { getFilteredSidebarData } from "./data/sidebar-data";
import Link from "next/link";
import { LogoJP } from "@/assets/images/LogoJP";
import { ScrollArea } from "../ui/scroll-area";
import { useAuth } from "@/app/(auth)/sign-in/_hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    // Obtener el usuario actual del estado global
    const { user } = useAuth();
    const router = useRouter();
    
    // Obtener los datos filtrados según el rol
    const filteredSidebarData = getFilteredSidebarData(user);
    
    // Efecto para redirigir a los médicos a la sección de registros médicos
    useEffect(() => {
        // Si el usuario es médico, redirigirlo a registros médicos
        if (user?.roles?.some(role => role.name === "MEDICO")) {
            // Verificamos la ruta actual para evitar redirecciones innecesarias
            if (window.location.pathname !== "/apoointment-medical") {
                router.push("/apoointment-medical");
            }
        }
    }, [user, router]);
    
    return (
        <Sidebar collapsible="icon" variant="floating" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg">
                            <Link href="/">
                                <LogoJP className="size-28" />
                                <span className="sr-only">
                                    Juan Pablo II - Clínica Estética
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <ScrollArea>
                    {filteredSidebarData.navGroups.map((props) => (
                        <NavGroup key={props.title} {...props} />
                    ))}
                </ScrollArea>
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
