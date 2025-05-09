import { Header } from "@/components/layout/Header";
import { Main } from "@/components/layout/Main";
import { ProfileDropdown } from "@/components/layout/ProfileDropdown";
import { Search } from "@/components/layout/Search";
import { AppSidebar } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function LayoutAdmin({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SidebarProvider defaultOpen={true}>
			<AppSidebar />
			<div
				className={cn(
					"max-w-full w-full ml-auto",
					"peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
					"peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
					"transition-[width] ease-linear duration-200",
					"h-svh flex flex-col",
					"group-data-[scroll-locked=1]/body:h-full",
					"group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh"
				)}
			>
				<Header>
					<Search />
					<div className="ml-auto flex items-center gap-4">
						<ProfileDropdown />
					</div>
				</Header>
				<Main>{children}</Main>
			</div>
		</SidebarProvider>
	);
}
