import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { TableSkeleton } from "@/components/data-table/TableSkeleton";
import { METADATA } from "./_statics/metadata";

export default function LoadingCategories() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={METADATA.title}
        description={METADATA.description}
        Icon={METADATA.Icon}
      />
      <Card>
        <TableSkeleton columns={5} rows={10} />
      </Card>
    </div>
  );
}
