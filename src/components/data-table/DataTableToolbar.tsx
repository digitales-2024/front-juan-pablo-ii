"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { cloneElement, Dispatch, ReactElement, SetStateAction } from "react";

import { Button } from "@/components/ui/button";

import { Input } from "../ui/input";
import { DataTableViewOptions } from "./DataTableViewOptions";

interface DataTableToolbarProps<TData>
    extends React.HTMLAttributes<HTMLDivElement> {
    table: Table<TData>;
    placeholder?: string;
    viewOptions?: boolean;
    globalFilter: string;
    setGlobalFilter: Dispatch<SetStateAction<string>>;
    toolbarActions?: ReactElement;
}

export function DataTableToolbar<TData>({
    table,
    placeholder = "Buscar...",
    viewOptions = true,
    toolbarActions,
}: DataTableToolbarProps<TData>) {
    const isFiltered = Boolean(table.getState().globalFilter);

    return (
        <div className="flex w-full flex-wrap-reverse justify-between gap-4">
            <div className="flex w-fit items-start space-x-2">
                <Input
                    placeholder={placeholder}
                    value={(table.getState().globalFilter as string) ?? ""}
                    onChange={(event) =>
                        table.setGlobalFilter(event.target.value)
                    }
                    className="w-full outline-none focus:outline-none sm:w-[250px]"
                />
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetGlobalFilter()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Limpiar
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex min-w-fit flex-1 flex-wrap items-center justify-end gap-2">
                {toolbarActions
                    ? cloneElement(toolbarActions, { table })
                    : null}
                {viewOptions && <DataTableViewOptions table={table} />}
            </div>
        </div>
    );
}
