import { UsersTable } from "./_components/UsersTable";
import { PageHeader } from "@/components/PageHeader";
import { getUsers } from "./actions";
import { notFound } from "next/navigation";

export default async function PageUser() {
	const response = await getUsers();
	/* console.log("🚀 ~ PageUser ~ response:", response) */

	if (!response || 'error' in response) {
		notFound();
	}

	return (
		<>
			<div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
				<PageHeader
					title="Usuarios"
					description="Administra los usuarios de tu empresa"
				/>
			</div>
			<div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
				<UsersTable data={response} />
			</div>
		</>
	);
}
