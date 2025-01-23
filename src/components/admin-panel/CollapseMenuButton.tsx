"use client";

import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, LucideIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../ui/collapsible";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";

type Submenu = {
    href: string;
    label: string;
    active: boolean;
    icon: LucideIcon;
};

interface CollapseMenuButtonProps {
    icon: LucideIcon;
    label: string;
    active: boolean;
    submenus: Submenu[];
    isOpen: boolean | undefined;
}

export const CollapseMenuButton = ({
    icon: Icon,
    label,
    active,
    submenus,
    isOpen,
}: CollapseMenuButtonProps) => {
    const isSubmenuActive = submenus.some((submenu) => submenu.active);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(isSubmenuActive);

    return isOpen ? (
        <Collapsible
            open={isCollapsed}
            onOpenChange={setIsCollapsed}
            className="w-full"
        >
            <CollapsibleTrigger
                className="mb-1 [&[data-state=open]>div>div>svg]:rotate-180"
                asChild
            >
                <Button
                    variant={active ? "secondary" : "ghost"}
                    className={cn(
                        "group/collapse-menu h-10 w-full justify-start border-l-4 border-transparent transition-colors duration-300 hover:border-primary",
                        active ? "border-l-4 border-primary" : "",
                    )}
                >
                    <div className="flex w-full items-center justify-between">
                        <div className="flex items-center">
                            <span className="mr-4">
                                <Icon
                                    size={18}
                                    className={cn(
                                        "transition-colors duration-200 group-hover/collapse-menu:stroke-primary",
                                        active ? "stroke-primary" : "",
                                    )}
                                />
                            </span>
                            <p
                                className={cn(
                                    "max-w-[150px] truncate",
                                    isOpen
                                        ? "translate-x-0 opacity-100"
                                        : "-translate-x-96 opacity-0",
                                    { "text-primary": active },
                                )}
                            >
                                {label}
                            </p>
                        </div>
                        <div
                            className={cn(
                                "whitespace-nowrap",
                                isOpen
                                    ? "translate-x-0 opacity-100"
                                    : "-translate-x-96 opacity-0",
                            )}
                        >
                            <ChevronDown
                                size={18}
                                className="transition-transform duration-200"
                            />
                        </div>
                    </div>
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden">
                {submenus.map(
                    ({ href, label, active, icon: SubmenuIcon }, index) => (
                        <Button
                            key={index}
                            variant={active ? "secondary" : "ghost"}
                            className="group/collapse-submenu mb-1 h-10 w-full justify-start text-secondary-foreground"
                            asChild
                        >
                            <Link href={href}>
                                <span className="ml-2 mr-4">
                                    <SubmenuIcon
                                        size={14}
                                        className={cn(
                                            "group-hover/collapse-submenu:stroke-primary",
                                            {
                                                "stroke-primary": active,
                                            },
                                        )}
                                    />
                                </span>
                                <p
                                    className={cn(
                                        "max-w-[170px] truncate font-normal",
                                        isOpen
                                            ? "translate-x-0 opacity-100"
                                            : "-translate-x-96 opacity-0",
                                        {
                                            "text-primary": active,
                                        },
                                    )}
                                >
                                    {label}
                                </p>
                            </Link>
                        </Button>
                    ),
                )}
            </CollapsibleContent>
        </Collapsible>
    ) : (
        <DropdownMenu>
            <TooltipProvider disableHoverableContent>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant={active ? "secondary" : "ghost"}
                                className={cn(
                                    "mb-1 h-10 w-full justify-start border-l-4 border-transparent transition-colors duration-300 hover:border-primary",
                                    active ? "border-primary" : "",
                                )}
                            >
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center">
                                        <span
                                            className={cn(
                                                isOpen === false ? "" : "mr-4",
                                                {
                                                    "text-primary": active,
                                                },
                                            )}
                                        >
                                            <Icon size={18} />
                                        </span>
                                        <p
                                            className={cn(
                                                "max-w-[200px] truncate",
                                                isOpen === false
                                                    ? "opacity-0"
                                                    : "opacity-100",
                                            )}
                                        >
                                            {label}
                                        </p>
                                    </div>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="start" alignOffset={2}>
                        {label}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent side="right" sideOffset={25} align="start">
                <DropdownMenuLabel className="max-w-[250px] truncate">
                    {label}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {submenus.map(
                    ({ href, label, active, icon: SubmenuIcon }, index) => (
                        <DropdownMenuItem key={index} asChild>
                            <Link className="cursor-pointer" href={href}>
                                <SubmenuIcon
                                    size={14}
                                    className={cn("mr-4", {
                                        "stroke-primary": active,
                                    })}
                                />
                                <p
                                    className={cn("max-w-[180px] truncate", {
                                        "text-primary": active,
                                    })}
                                >
                                    {label}
                                </p>
                            </Link>
                        </DropdownMenuItem>
                    ),
                )}
                <DropdownMenuArrow className="fill-border" />
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
