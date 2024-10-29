import { HeaderPage } from "@/components/common/HeaderPage";
import AdminLayout from "./(admin)/layout";

export default function Home() {
    return (
    <AdminLayout>
        <HeaderPage
        title="Página Principal"
        description="Asegúrate de iniciar sesión antes de entrar a los módulos">
      </HeaderPage>
    </AdminLayout>
    );
}