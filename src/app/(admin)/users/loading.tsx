import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { TableSkeleton } from "@/components/data-table/TableSkeleton";
import { Users } from "lucide-react";

const USERS_PAGE = {
	title: "Usuarios",
	description: "Administra los usuarios de tu empresa",
	icon: Users,
} as const;

export default function LoadingUsers() {
	return (
		<div className="flex flex-col gap-4">
			<PageHeader
				title={USERS_PAGE.title}
				description={USERS_PAGE.description}
				Icon={USERS_PAGE.icon}
			/>

			<Card>
				<TableSkeleton columns={5} rows={10} />
			</Card>
		</div>
	);
}
