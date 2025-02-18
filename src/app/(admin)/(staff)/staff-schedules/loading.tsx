import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingBranches() {
  return (
    <>
      <div className="mb-2 flex items-center justify-between space-y-2">
        <PageHeader
          title="Turnos"
          description="Administra los turnos de tu personal"
        />
      </div>
      <div className="space-y-4">
        <div className="rounded-md border">
          <div className="p-4">
            <Skeleton className="h-8 w-[250px]" />
          </div>
          <div className="border-t">
            <div className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-[80%]" />
                <Skeleton className="h-5 w-[60%]" />
                <Skeleton className="h-5 w-[70%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
