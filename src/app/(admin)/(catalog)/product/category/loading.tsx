import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { TableSkeleton } from "@/components/data-table/TableSkeleton";
import { List } from "lucide-react";

const CATEGORIES_PAGE = {
	title: "Categorías",
	description: "Administra las categorías de tus productos",
	icon: List,
} as const;

export default function LoadingCategories() {
	return (
		<div className="flex flex-col gap-4">
			<PageHeader
				title={CATEGORIES_PAGE.title}
				description={CATEGORIES_PAGE.description}
				Icon={CATEGORIES_PAGE.icon}
			/>
			<Card>
				<TableSkeleton columns={5} rows={10} />
			</Card>
		</div>
	);
}
