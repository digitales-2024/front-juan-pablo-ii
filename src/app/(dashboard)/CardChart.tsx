import type { ReactNode } from "react";
import { cn } from "@/lib/utils"; // Importa la función cn

interface KPICardProps {
  title: string;
  value: string;
  description: string;
  icon?: ReactNode
  className?: string
}

export function KPICard({ title, value, description, icon, className }: KPICardProps) {
  return (
    <div className={cn(
      "bg-white p-4 rounded-lg border transition-all", 
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        {icon && <div className="bg-gray-100 p-2 rounded-md">{icon}</div>}
      </div>
    </div>
  )
}

