import {
	Column,
	ColumnDef,
	ColumnFiltersState,
	ColumnPinningState,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from "@tanstack/react-table";
import { CSSProperties, Fragment, ReactElement, useState } from "react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { Empty } from "../common/Empty";

import { DataTablePagination } from "./DataTablePagination";
import { DataTableToolbar } from "./DataTableToolbar";

interface DataTableExpandedProps<TData, TValue> {
	data: TData[];
	columns: ColumnDef<TData, TValue>[];
	placeholder?: string;
	toolbarActions?: ReactElement;
	viewOptions?: boolean;
	getSubRows?: (row: TData) => TData[] | undefined;
	renderExpandedRow?: (row: TData) => ReactElement;
	onClickRow?: (row: TData) => void;
	customExcelExport?: (data: TData[]) => void;
}

export function DataTableExpanded<TData, TValue>({
	columns,
	data,
	placeholder,
	toolbarActions,
	viewOptions,
	getSubRows,
	renderExpandedRow,
	onClickRow,
}: DataTableExpandedProps<TData, TValue>) {
	const [rowSelection, setRowSelection] = useState({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		{}
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
		},
		enableRowSelection: true,
		getSubRows,
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
	});

	const getCommonPinningStyles = (column: Column<TData>): CSSProperties => {
		const isPinned = column.getIsPinned();

		return {
			left:
				isPinned === "left"
					? `${column.getStart("left")}px`
					: undefined,
			right:
				isPinned === "right"
					? `${column.getAfter("right")}px`
					: undefined,
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
				toolbarActions={toolbarActions}
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
												...getCommonPinningStyles(
													column
												),
											}}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef
															.header,
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
								<Fragment key={row.id}>
									<TableRow
										data-state={
											row.getIsSelected() && "selected"
										}
										onClick={
											onClickRow
												? () => onClickRow(row.original)
												: undefined
										}
									>
										{row.getVisibleCells().map((cell) => {
											const { column } = cell;

											return (
												<TableCell
													key={cell.id}
													className="text-slate-600"
													style={{
														...getCommonPinningStyles(
															column
														),
													}}
												>
													{flexRender(
														cell.column.columnDef
															.cell,
														cell.getContext()
													)}
												</TableCell>
											);
										})}
									</TableRow>
									{row.getIsExpanded() && (
										<TableRow key={row.id}>
											<TableCell colSpan={columns.length}>
												{renderExpandedRow
													? renderExpandedRow(
															row.original
													  ) // Renderizado dinámico
													: "No expanded content"}
											</TableCell>
										</TableRow>
									)}
								</Fragment>
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