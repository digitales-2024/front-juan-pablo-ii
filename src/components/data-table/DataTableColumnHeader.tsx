import { type Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
    extends React.HTMLAttributes<HTMLDivElement> {
    column: Column<TData, TValue>;
    title: string;
}

export function DataTableColumnHeader<TData, TValue>({
    column,
    title,
    className,
}: DataTableColumnHeaderProps<TData, TValue>) {
    if (!column.getCanSort() && !column.getCanHide()) {
        return <div className={cn(className)}>{title}</div>;
    }

    let button;
    if (column.getCanSort() && column.getIsSorted() === "desc") {
        button = <ArrowDown className="ml-2 size-4" aria-hidden="true" />;
    } else if (column.getIsSorted() === "asc") {
        button = <ArrowUp className="ml-2 size-4" aria-hidden="true" />;
    } else {
        button = <ChevronsUpDown className="ml-2 size-4" aria-hidden="true" />;
    }

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="-ml-3 h-8 data-[state=open]:bg-accent"
                    >
                        <span>{title}</span>
                        {button}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    {column.getCanSort() && (
                        <>
                            <DropdownMenuItem
                                aria-label="Sort ascending"
                                onClick={() => column.toggleSorting(false)}
                            >
                                <ArrowUp
                                    className="mr-2 size-3.5 text-muted-foreground/70"
                                    aria-hidden="true"
                                />
                                Asc
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                aria-label="Sort descending"
                                onClick={() => column.toggleSorting(true)}
                            >
                                <ArrowDown
                                    className="mr-2 size-3.5 text-muted-foreground/70"
                                    aria-hidden="true"
                                />
                                Desc
                            </DropdownMenuItem>
                        </>
                    )}
                    {column.getCanSort() && column.getCanHide() && (
                        <DropdownMenuSeparator />
                    )}
                    {column.getCanHide() && (
                        <DropdownMenuItem
                            aria-label="Hide column"
                            onClick={() => column.toggleVisibility(false)}
                        >
                            <EyeOff
                                className="mr-2 size-3.5 text-muted-foreground/70"
                                aria-hidden="true"
                            />
                            Hide
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
