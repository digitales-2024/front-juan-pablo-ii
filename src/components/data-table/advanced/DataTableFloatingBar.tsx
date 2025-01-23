import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { useEffect } from "react";

import { Kbd } from "@/components/common/Kbd";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface UsersTableFloatingBarProps<TData> {
    table: Table<TData>;
    customExcelExport?: (data: TData[]) => void;
}

export const DataTableFloatingBar = <TData,>({
    table,
}: UsersTableFloatingBarProps<TData>) => {
    const rows = table.getFilteredSelectedRowModel().rows;

    // Clear selection on Escape key press
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                table.toggleAllRowsSelected(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [table]);

    return (
        <div className="fixed inset-x-0 bottom-4 z-50 mx-auto w-fit px-4">
            <div className="w-full overflow-x-auto">
                <div className="mx-auto flex w-fit items-center gap-2 rounded-md border bg-card p-2 shadow-2xl">
                    <div className="flex h-7 items-center rounded-md border border-dashed pl-2.5 pr-1">
                        <span className="whitespace-nowrap text-xs">
                            {rows.length} seleccionado
                            {rows.length > 1 ? "s" : ""}
                        </span>
                        <Separator
                            orientation="vertical"
                            className="ml-2 mr-1"
                        />
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="size-5 hover:border"
                                        onClick={() =>
                                            table.toggleAllRowsSelected(false)
                                        }
                                    >
                                        <X
                                            className="size-3.5 shrink-0"
                                            aria-hidden="true"
                                        />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent className="flex items-center border bg-accent px-2 py-1 text-xs font-semibold text-foreground dark:bg-zinc-900">
                                    <p className="mr-2">Limpiar selección</p>
                                    <Kbd abbrTitle="Escape" variant="outline">
                                        Esc
                                    </Kbd>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <Separator
                        orientation="vertical"
                        className="hidden h-5 sm:block"
                    />
                </div>
            </div>
        </div>
    );
};
