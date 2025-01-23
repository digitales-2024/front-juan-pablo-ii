import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { useStore } from "@/hooks/use-store";
import React from "react";

import { cn } from "@/lib/utils";

import { Menu } from "./Menu";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarToggle } from "./SidebarToggle";

export default function Sidebar() {
    const sidebar = useStore(useSidebarToggle, (state) => state);

    if (!sidebar) return null;

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-20 h-screen -translate-x-full border-r transition-[width] duration-300 ease-in-out lg:translate-x-0",
                sidebar?.isOpen === false ? "w-[90px]" : "w-72",
            )}
        >
            <SidebarToggle
                isOpen={sidebar?.isOpen}
                setIsOpen={sidebar?.setIsOpen}
            />
            <div className="relative flex h-full flex-col overflow-y-auto p-3">
                <SidebarHeader isOpen={sidebar?.isOpen} />{" "}
                <Menu isOpen={sidebar?.isOpen} />
            </div>
        </aside>
    );
}
