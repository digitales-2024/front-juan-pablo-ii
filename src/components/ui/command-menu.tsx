import React from "react";
import { useSearch } from "@/context/search-context";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { sidebarData } from "../layout/data/sidebar-data";
import { ScrollArea } from "./scroll-area";
import { ArrowBigRightDash } from "lucide-react";
import { redirect } from "next/navigation";

export function CommandMenu() {
	const { open, setOpen } = useSearch();

	const runCommand = React.useCallback(
		(command: () => unknown) => {
			setOpen(false);
			command();
		},
		[setOpen]
	);

	return (
		<CommandDialog modal open={open} onOpenChange={setOpen}>
			<CommandInput placeholder="Type a command or search..." />
			<CommandList>
				<ScrollArea type="hover" className="h-72 pr-1">
					<CommandEmpty>No results found.</CommandEmpty>
					{sidebarData.navGroups.map((group) => (
						<CommandGroup key={group.title} heading={group.title}>
							{group.items.map((navItem, i) => {
								if (navItem.url)
									return (
										<CommandItem
											key={`${navItem.url}-${i}`}
											value={navItem.title}
											onSelect={() => {
												runCommand(() =>
													redirect(
														navItem.url as string
													)
												);
											}}
										>
											<div className="mr-2 flex h-4 w-4 items-center justify-center">
												<ArrowBigRightDash className="size-2 text-muted-foreground/80" />
											</div>
											{navItem.title}
										</CommandItem>
									);

								return navItem.items?.map((subItem, i) => (
									<CommandItem
										key={`${subItem.url}-${i}`}
										value={subItem.title}
										onSelect={() => {
											runCommand(() =>
												redirect(subItem.url as string)
											);
										}}
									>
										<div className="mr-2 flex h-4 w-4 items-center justify-center">
											<ArrowBigRightDash className="size-2 text-muted-foreground/80" />
										</div>
										{subItem.title}
									</CommandItem>
								));
							})}
						</CommandGroup>
					))}
				</ScrollArea>
			</CommandList>
		</CommandDialog>
	);
}
