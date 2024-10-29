import { HeaderPage } from "@/components/common/HeaderPage";
import { Shell } from "@/components/common/Shell";
import DashboardReport from "@/components/dashboard/DashboardReport";

export default function Dashboard() {
  
  return (
    <Shell>
      <HeaderPage
        title="Página Principal"
        description="Aquí puedes ver los reportes del ERP">
      </HeaderPage>
      <DashboardReport></DashboardReport>
    </Shell>
  );
}
