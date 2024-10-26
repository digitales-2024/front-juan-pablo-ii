import { Shell } from "@/components/common/Shell";
import AdminPanelLayout from "@/components/layouts/AdminPanelLayout";
import { Card } from "@/components/ui/card";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminPanelLayout>
            <Card className="border-none">
                <Shell>{children}</Shell>
            </Card>
        </AdminPanelLayout>
    );
}