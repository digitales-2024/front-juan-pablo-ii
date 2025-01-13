export default async function PageUser() {
	return (
		<>
			<div className="mb-2 flex items-center justify-between space-y-2 flex-wrap gap-x-4">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">
						Usuarios
					</h2>
					<p className="text-muted-foreground">
						Administra los usuarios de tu empresa
					</p>
				</div>
			</div>
			<div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0"></div>
		</>
	);
}
