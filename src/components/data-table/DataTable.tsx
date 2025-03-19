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
  TableState,
  RowSelectionState,
  Updater,
} from "@tanstack/react-table";
import { CSSProperties, ReactElement, useCallback, useState } from "react";

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
  columnVisibilityConfig?: Partial<Record<keyof TData, boolean>>;
  onTableChange?: (table: TableType<TData>, newState: TableState) => void;
  onRowSelectionChange?: (table: TData[]) => void;
  totalCount?: number;
  manualPagination?: boolean;
  onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  placeholder,
  toolbarActions,
  viewOptions,
  getSubRows,
  columnVisibilityConfig,
  onTableChange,
  onRowSelectionChange,
  totalCount,
  manualPagination,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    columnVisibilityConfig as VisibilityState ?? {} //OJO: When defining visibility, at least 1 field must be present
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
    left: ["select"],
    right: ["actions"],
  });

  // Calcular el número de páginas para la paginación manual
  const calculatePageCount = (totalItems: number | undefined, pageSize: number): number | undefined => {
    if (!totalItems) return undefined;
    return Math.ceil(totalItems / pageSize);
  };

  const handleOnRowSelectionChange = useCallback(
    (valueFn: Updater<RowSelectionState>) => {
      if (typeof valueFn === "function") {
        const updatedRowSelection = valueFn(rowSelection);
        setRowSelection(updatedRowSelection);

        //Get all selected rows based on the updatedRowSelection
        const selectedRows = Object.keys(updatedRowSelection).reduce(
          (acc, key) => {
            if (updatedRowSelection[key]) {
              const row = data[parseInt(key)]; //It will be more secure if not validating by the array key
              if (row) {
                acc.push(row);
              }
            }
            return acc;
          },
          [] as TData[],
        );
        // Call the onRowSelectionChange function with the selected rows
        onRowSelectionChange?.(selectedRows);
      }
    },
    [data, onRowSelectionChange, rowSelection],
  );

  const table = useReactTable({
    data,
    columns,
    onStateChange: (updaterOrValue) => {
      // Si no has definido onTableChange, salimos
      if (!onTableChange) return;
      // Determina el nuevo estado
      // (Si updaterOrValue es una función, úsala para calcular el estado real)
      // console.log('table.getState()', table.getState())
      const newState =
        typeof updaterOrValue === "function"
          ? updaterOrValue(table.getState())
          : updaterOrValue;
      // Llamamos tu callback solo en los cambios de estado
      onTableChange(table, newState);
    },
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
    onRowSelectionChange: handleOnRowSelectionChange,
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
    manualPagination: manualPagination,
    pageCount: manualPagination ? calculatePageCount(totalCount, 10) : undefined, // Usar 10 como valor predeterminado para pageSize
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
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={onRowClick ? () => onRowClick(row.original) : undefined}
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
