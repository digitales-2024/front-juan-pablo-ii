import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  Icon?: LucideIcon;
  className?: string;
}

export function PageHeader({
  title,
  description,
  Icon,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn(
      "flex items-center justify-between space-y-2",
      className
    )}>
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon 
              className="size-5 text-primary" 
              aria-hidden="true"
            />
          </div>
        )}
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface PageHeaderSkeletonProps {
  hasIcon?: boolean;
  hasAction?: boolean;
  className?: string;
}

export function PageHeaderSkeleton({
  hasIcon = true,
  hasAction = true,
  className,
}: PageHeaderSkeletonProps) {
  return (
    <div className={cn(
      "flex items-center justify-between space-y-2",
      className
    )}>
      <div className="flex items-center gap-4">
        {hasIcon && (
          <div className="p-2 bg-muted rounded-lg animate-pulse">
            <div className="size-5" />
          </div>
        )}
        <div className="space-y-1">
          <div className="h-7 w-32 bg-muted rounded animate-pulse" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse" />
        </div>
      </div>
      {hasAction && (
        <div className="flex-shrink-0">
          <div className="h-9 w-24 bg-muted rounded animate-pulse" />
        </div>
      )}
    </div>
  );
} 