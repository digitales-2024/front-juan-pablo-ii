import { DesignProjectStatus } from "@/types/designProject";

import { Badge } from "../ui/badge";

export function StatusBadge(props: { status: DesignProjectStatus }) {
    let badge = <></>;
    switch (props.status) {
        case "APPROVED":
            badge = (
                <Badge
                    variant="secondary"
                    className="bg-yellow-200 text-yellow-600"
                >
                    Aprobado
                </Badge>
            );
            break;
        case "COMPLETED":
            badge = (
                <Badge
                    variant="secondary"
                    className="bg-green-200 text-green-700"
                >
                    Completado
                </Badge>
            );
            break;
        case "ENGINEERING":
            badge = (
                <Badge
                    variant="secondary"
                    className="bg-blue-200 text-blue-600"
                >
                    En ingeniería
                </Badge>
            );
            break;
        case "CONFIRMATION":
            badge = (
                <Badge
                    variant="secondary"
                    className="bg-cyan-200 text-cyan-600"
                >
                    Confirmado
                </Badge>
            );
            break;
        case "PRESENTATION":
            badge = (
                <Badge
                    variant="secondary"
                    className="bg-teal-200 text-teal-600"
                >
                    En presentacion
                </Badge>
            );
            break;
    }
    return badge;
}
