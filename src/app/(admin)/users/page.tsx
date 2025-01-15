import { serverFetch } from "@/utils/serverFetch";
import { User } from "./types";
import { UsersTable } from "./_components/UsersTable";
import { PageHeader } from "@/components/PageHeader";

export default async function PageUser() {
	const [user] = await serverFetch<User[]>("/users");

	return (
		<>
			<div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
				<PageHeader title="Usuarios" description="Administra los usuarios de tu empresa"/>
			</div>
			<div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
				<UsersTable data={user} />
			</div>
		</>
	);
}
