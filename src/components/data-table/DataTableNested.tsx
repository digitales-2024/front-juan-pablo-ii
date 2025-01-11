import {
    ColumnDef,
    ColumnFiltersState,
    ColumnPinningState,
    ExpandedState,
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import { ReactElement, useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Empty } from "../common/Empty";
import { DataTableFloatingBar } from "./advanced/DataTableFloatingBar";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";

interface DataTableProps<TData, TValue> {
    data: TData[];
    columns: ColumnDef<TData, TValue>[];
    placeholder?: string;
    toolbarActions?: ReactElement;
    viewOptions?: boolean;
    getSubRows?: (row: TData) => TData[] | undefined;
}

export function DataTableNested<TData, TValue>({
    columns,
    data,
    placeholder,
    toolbarActions,
    viewOptions,
    getSubRows,
}: DataTableProps<TData, TValue>) {
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {},
    );
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
        left: ["select"],
        right: ["actions"],
    });

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            globalFilter,
            columnPinning,
            expanded,
        },
        onExpandedChange: setExpanded,
        getSubRows,
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onColumnPinningChange: setColumnPinning,
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getExpandedRowModel: getExpandedRowModel(),
    });

    //const getCommonPinningStyles = (column: Column<TData>): CSSProperties => {
    //    const isPinned = column.getIsPinned();
    //
    //    return {
    //        left:
    //            isPinned === "left"
    //                ? `${column.getStart("left")}px`
    //                : undefined,
    //        right:
    //            isPinned === "right"
    //                ? `${column.getAfter("right")}px`
    //                : undefined,
    //        position: isPinned ? "sticky" : "relative",
    //        width: column.getSize(),
    //        zIndex: isPinned ? 1 : 0,
    //        backgroundColor: "white",
    //    };
    //};

    return (
        <div className="w-full space-y-2.5 overflow-auto p-1">
            <DataTableToolbar
                table={table}
                placeholder={placeholder}
                viewOptions={viewOptions}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                toolbarActions={toolbarActions}
            />
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    //const { column } = header;
                                    return (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            //style={{
                                            //    ...getCommonPinningStyles(
                                            //        column,
                                            //    ),
                                            //}}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    className="border-slate-100"
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        //const { column } = cell;

                                        return (
                                            <TableCell
                                                key={cell.id}
                                                className="p-0 text-slate-600"
                                                //style={{
                                                //    ...getCommonPinningStyles(
                                                //        column,
                                                //    ),
                                                //}}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    <Empty />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} />
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <DataTableFloatingBar table={table} />
            )}
        </div>
    );
}
