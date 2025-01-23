import { ResourceType } from "@/types/resource";
import {
    Wrench,
    Users,
    Package,
    HeartHandshake,
    LucideIcon,
} from "lucide-react";

export const iconMap: Record<ResourceType, LucideIcon> = {
    TOOLS: Wrench,
    LABOR: Users,
    SUPPLIES: Package,
    SERVICES: HeartHandshake,
};
