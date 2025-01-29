"use client";
import {
  Column,
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
  Table as TableType,
} from "@tanstack/react-table";
import { CSSProperties, ReactElement, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Empty } from "@/components/common/Empty";

import { DataTablePagination } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";

interface DataTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  placeholder?: string;
  toolbarActions?: (table: TableType<TData>) => ReactElement | undefined;
  viewOptions?: boolean;
  getSubRows?: (row: TData) => TData[] | undefined;
  //TODO: Add type for columnVisibilityConfig keys
  columnVisibilityConfig?: Record<string, boolean>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  placeholder,
  toolbarActions,
  viewOptions,
  getSubRows,
  columnVisibilityConfig,
}: DataTableProps<TData, TValue>) {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    columnVisibilityConfig?columnVisibilityConfig:{}
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

  const getCommonPinningStyles = (column: Column<TData>): CSSProperties => {
    const isPinned = column.getIsPinned();

    return {
      left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
      right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
      position: isPinned ? "sticky" : "relative",
      width: column.getSize(),
      zIndex: isPinned ? 1 : 0,
      backgroundColor: "white",
    };
  };

  return (
    <div className="w-full space-y-2.5 overflow-auto p-1">
      <DataTableToolbar
        table={table}
        placeholder={placeholder}
        viewOptions={viewOptions}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        toolbarActions={toolbarActions ? toolbarActions(table) : undefined}
      />
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const { column } = header;
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        ...getCommonPinningStyles(column),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    const { column } = cell;

                    return (
                      <TableCell
                        key={cell.id}
                        className="text-slate-600"
                        style={{
                          ...getCommonPinningStyles(column),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
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
    </div>
  );
}
