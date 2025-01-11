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
import { sidebarData } from "./data/sidebar-data";
import Link from "next/link";
import { LogoJP } from "@/assets/images/LogoJP";
import { ScrollArea } from "../ui/scroll-area";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
					{sidebarData.navGroups.map((props) => (
						<NavGroup key={props.title} {...props} />
					))}
				</ScrollArea>
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={sidebarData.user} />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
