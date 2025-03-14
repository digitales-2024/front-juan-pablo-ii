import { Skeleton } from "@/components/ui/skeleton";

export function ToolbarButtonsLoading() {
    return (
        <div className="flex items-center space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
        </div>
    );
}