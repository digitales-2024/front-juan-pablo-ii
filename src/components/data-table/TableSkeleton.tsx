import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  columns: number;
  rows: number;
  showHeader?: boolean;
  showToolbar?: boolean;
  showPagination?: boolean;
  className?: string;
}

export function TableSkeleton({
  columns,
  rows,
  showHeader = true,
  showToolbar = true,
  showPagination = true,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Toolbar Skeleton */}
      {showToolbar && (
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[250px]" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-[70px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <div className="space-y-4">
          {/* Header Skeleton */}
          {showHeader && (
            <div className="border-b bg-muted/30 p-4">
              <div
                className="grid items-center gap-4"
                style={{
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: columns }).map((_, i) => (
                  <Skeleton
                    key={`header-${i}`}
                    className={cn(
                      "h-4",
                      i === 0 ? "w-[80px]" : "w-full"
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Rows Skeleton */}
          <div className="space-y-4 p-4">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div
                key={`row-${rowIndex}`}
                className="grid items-center gap-4"
                style={{
                  gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <Skeleton
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={cn(
                      "h-4",
                      colIndex === columns - 1 ? "w-[100px]" : "w-full"
                    )}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pagination Skeleton */}
      {showPagination && (
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[100px]" />
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-[70px]" />
            <Skeleton className="h-8 w-[70px]" />
          </div>
        </div>
      )}
    </div>
  );
}

interface DataTableSkeletonProps extends TableSkeletonProps {
  showSelection?: boolean;
  showActions?: boolean;
}

export function DataTableSkeleton({
  columns,
  rows,
  showSelection = true,
  showActions = true,
  ...props
}: DataTableSkeletonProps) {
  // Ajustamos el número de columnas basado en las opciones
  const adjustedColumns = columns + 
    (showSelection ? 1 : 0) + 
    (showActions ? 1 : 0);

  return <TableSkeleton columns={adjustedColumns} rows={rows} {...props} />;
} 