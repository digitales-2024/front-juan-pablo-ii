"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "@/app/(auth)/sign-in/_actions/logout.action";
import { useAuth } from "@/app/(auth)/sign-in/_hooks/useAuth";

export function ProfileDropdown() {
	const { user, isHydrated, logout } = useAuth();
	
	// Solo esperamos la hidratación
	if (!isHydrated) {
		return (
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						className="relative h-8 w-8 rounded-full"
					>
						<Avatar className="h-8 w-8">
							<AvatarFallback>UN</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
			</DropdownMenu>
		);
	}
	
	const defaultUser = {
		name: "Usuario",
		email: "usuario@example.com"
	};
	const currentUser = user || defaultUser;

	const handleLogout = async () => {
		logout();
		const response = await logoutAction();
		if (response.success && response.redirect) {
			window.location.href = response.redirect;
		}
	};

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="relative h-8 w-8 rounded-full"
				>
					<Avatar className="h-8 w-8">
						<AvatarImage alt={currentUser.name} />
						<AvatarFallback>{currentUser.name?.substring(0, 2).toUpperCase() || "UN"}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{currentUser.name}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							{currentUser.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link href="/account">
							Perfil
							<DropdownMenuShortcut>
								<UserRound size={16} />
							</DropdownMenuShortcut>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleLogout}>
					Cerrar Sesión
					<DropdownMenuShortcut>
						<LogOut size={16} />
					</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
