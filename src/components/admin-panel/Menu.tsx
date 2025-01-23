"use client";
import { useLogout } from "@/hooks/use-logout";
import { Ellipsis, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { getMenuList } from "@/lib/menu-list";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";
import { CollapseMenuButton } from "./CollapseMenuButton";

interface MenuProps {
    isOpen: boolean | undefined;
}

export const Menu = ({ isOpen }: MenuProps) => {
    const pathname = usePathname() ?? "";
    const menuList = getMenuList(pathname);

    const { signOut } = useLogout();

    return (
        <ScrollArea className="[&>div>div[style]]:!block">
            <nav className="h-full w-full">
                <ul className="flex min-h-[calc(100vh-48px-36px-16px-32px)] flex-col items-start space-y-1 px-2 lg:min-h-[calc(100vh-32px-40px-32px)]">
                    {menuList.map(({ groupLabel, menus }, index) => (
                        <li
                            className={cn("w-full", groupLabel ? "pt-5" : "")}
                            key={index}
                        >
                            {(isOpen && groupLabel) || isOpen === undefined ? (
                                <p className="max-w-[248px] truncate px-4 pb-2 text-sm text-muted-foreground">
                                    {groupLabel}
                                </p>
                            ) : !isOpen &&
                              isOpen !== undefined &&
                              groupLabel ? (
                                <TooltipProvider>
                                    <Tooltip delayDuration={100}>
                                        <TooltipTrigger className="w-full">
                                            <div className="flex w-full items-center justify-center">
                                                <Ellipsis className="h-5 w-5" />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            <p>{groupLabel}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ) : (
                                <p className="pb-2"></p>
                            )}
                            {menus.map(
                                (
                                    {
                                        href,
                                        label,
                                        icon: Icon,
                                        active,
                                        submenus,
                                    },
                                    index,
                                ) =>
                                    submenus.length === 0 ? (
                                        <div className="w-full" key={index}>
                                            <TooltipProvider
                                                disableHoverableContent
                                            >
                                                <Tooltip delayDuration={100}>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant={
                                                                active
                                                                    ? "secondary"
                                                                    : "ghost"
                                                            }
                                                            className={cn(
                                                                "group/btn-link mb-1 h-10 w-full justify-start border-l-4 border-transparent transition-colors duration-300 hover:border-primary",
                                                                {
                                                                    "border-primary text-primary":
                                                                        active,
                                                                },
                                                            )}
                                                            asChild
                                                        >
                                                            <Link href={href}>
                                                                <span
                                                                    className={cn(
                                                                        isOpen ===
                                                                            false
                                                                            ? ""
                                                                            : "mr-4",
                                                                    )}
                                                                >
                                                                    <Icon
                                                                        size={
                                                                            18
                                                                        }
                                                                        className={cn(
                                                                            "transition-colors duration-200 group-hover/btn-link:text-primary",
                                                                            {
                                                                                "text-primary":
                                                                                    active,
                                                                            },
                                                                        )}
                                                                    />
                                                                </span>
                                                                <p
                                                                    className={cn(
                                                                        "max-w-[200px] truncate",
                                                                        isOpen ===
                                                                            false
                                                                            ? "-translate-x-96 opacity-0"
                                                                            : "translate-x-0 opacity-100",
                                                                    )}
                                                                >
                                                                    {label}
                                                                </p>
                                                            </Link>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    {isOpen === false && (
                                                        <TooltipContent side="right">
                                                            {label}
                                                        </TooltipContent>
                                                    )}
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    ) : (
                                        <div className="w-full" key={index}>
                                            <CollapseMenuButton
                                                icon={Icon}
                                                label={label}
                                                active={active}
                                                submenus={submenus}
                                                isOpen={isOpen}
                                            />
                                        </div>
                                    ),
                            )}
                        </li>
                    ))}
                    <li className="flex w-full grow items-end">
                        <TooltipProvider disableHoverableContent>
                            <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={signOut}
                                        variant="outline"
                                        className="mt-5 h-10 w-full justify-center"
                                    >
                                        <span
                                            className={cn(
                                                isOpen === false ? "" : "mr-4",
                                            )}
                                        >
                                            <LogOut size={18} />
                                        </span>
                                        <p
                                            className={cn(
                                                "whitespace-nowrap",
                                                isOpen === false
                                                    ? "hidden opacity-0"
                                                    : "opacity-100",
                                            )}
                                        >
                                            Cerrar sesión
                                        </p>
                                    </Button>
                                </TooltipTrigger>
                                {isOpen === false && (
                                    <TooltipContent side="right">
                                        Cerrar sesión
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                    </li>
                </ul>
            </nav>
        </ScrollArea>
    );
};
