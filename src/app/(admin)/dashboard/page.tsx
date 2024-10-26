import DashboardReport from "@/components/dashboard/DashboardReport";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  
  return (
    <Card className="bg-white shadow-md w-full max-w-5xl mx-auto p-4">
      <CardHeader>
        <div className="flex flex-col items-center md:items-start">
          <CardTitle className="text-2xl font-bold text-gray-800 text-center md:text-left">
            Página Principal
          </CardTitle>
        </div>
     </CardHeader>
      <DashboardReport />
    </Card>
  );
}
