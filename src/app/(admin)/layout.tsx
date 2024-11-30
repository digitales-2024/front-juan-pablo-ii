import { Shell } from "@/components/common/Shell";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminPanelLayout>
            <Shell className="rounded-3xl border">{children}</Shell>
        </AdminPanelLayout>
    );
}
