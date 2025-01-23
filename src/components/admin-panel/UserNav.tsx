"use client";

import { useLogout } from "@/hooks/use-logout";
import { useProfile } from "@/hooks/use-profile";
import { getFirstLetter } from "@/utils/getFirstLetter";
import { LayoutGrid, LogOut, User } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
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
import ThemeToggle from "../ThemeTogle";

export const UserNav = () => {
    const { user } = useProfile();

    const { signOut } = useLogout();

    return (
        <>
            <DropdownMenu>
                <ThemeToggle />
                <TooltipProvider disableHoverableContent>
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger asChild>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="relative h-8 w-8 rounded-full"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="#" alt="Avatar" />
                                        <AvatarFallback className="bg-transparent">
                                            {getFirstLetter(user?.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">Perfil</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="truncate text-sm font-medium capitalize leading-none">
                                {user?.name}
                            </p>
                            <p className="truncate text-xs leading-none text-muted-foreground">
                                {user?.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem
                            className="hover:cursor-pointer"
                            asChild
                        >
                            <Link href="/" className="flex items-center">
                                <LayoutGrid className="mr-3 h-4 w-4 text-muted-foreground" />
                                Dashboard
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="hover:cursor-pointer"
                            asChild
                        >
                            <Link href="/account" className="flex items-center">
                                <User className="mr-3 h-4 w-4 text-muted-foreground" />
                                Mi cuenta
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="hover:cursor-pointer"
                        onClick={signOut}
                    >
                        <LogOut className="mr-3 h-4 w-4 text-muted-foreground" />
                        Cerrar sesión
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};
