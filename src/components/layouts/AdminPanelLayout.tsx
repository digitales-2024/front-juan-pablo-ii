"use client";

import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useStore } from "@/hooks/use-store";

import { cn } from "@/lib/utils";

import Footer from "../admin-panel/Footer";
import { Navbar } from "../admin-panel/Navbar";
import Sidebar from "../admin-panel/Sidebar";

export default function AdminPanelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const sidebar = useStore(useSidebarToggle, (state) => state);

    if (!sidebar) return null;

    return (
        <>
            <Sidebar />
            <main
                className={cn(
                    "min-h-[calc(100vh_-_57px)] bg-background transition-[margin-left] duration-300 ease-in-out",
                    sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72",
                )}
            >
                <Navbar />
                <div className="container px-4 pb-8 pt-8 sm:px-8">
                    {children}
                </div>
            </main>
            <footer
                className={cn(
                    "transition-[margin-left] duration-300 ease-in-out",
                    sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72",
                )}
            >
                <Footer />
            </footer>
        </>
    );
}
