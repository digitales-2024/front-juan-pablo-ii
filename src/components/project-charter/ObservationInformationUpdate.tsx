import { Observation, ProjectCharter } from "@/types";
import { format, parse } from "date-fns";
import { es } from "date-fns/locale";
import { Pencil, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface ObservationInformationUpdateProps {
    obs: Observation;
    projectCharter: ProjectCharter;
    expandido: boolean;
    handleToggle: () => void;
    startEditing: (obs: Observation) => void;
    deleteObservation: (obs: Observation) => void;
}

export function ObservationInformationUpdate({
    obs,
    projectCharter,
    expandido,
    handleToggle,
    startEditing,
    deleteObservation,
}: ObservationInformationUpdateProps) {
    return (
        <>
            <div
                className={cn(
                    "w-auto cursor-pointer truncate",
                    expandido ? "whitespace-normal" : "whitespace-nowrap",
                )}
                onClick={handleToggle}
            >
                {obs.observation ? (
                    <span className="text-sm font-light">
                        {obs.observation}
                    </span>
                ) : (
                    <span className="text-xs text-slate-300">
                        Sin observación
                    </span>
                )}
            </div>
            <div className="bg-background text-xs font-light italic text-slate-500">
                Fecha:{" "}
                {obs.meetingDate
                    ? format(
                          parse(obs.meetingDate, "yyyy-MM-dd", new Date()),
                          "PPP",
                          {
                              locale: es,
                          },
                      )
                    : "Sin fecha"}
            </div>
            <div className="mt-4 flex flex-col justify-end gap-2 sm:flex-row">
                <Button
                    size="sm"
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-background hover:text-destructive/90"
                    onClick={() => {
                        const observation = {
                            ...obs,
                            projectCharterId: projectCharter.id,
                        };

                        deleteObservation(observation);
                    }}
                >
                    <Trash
                        className="mr-1 h-4 w-4 flex-shrink-0"
                        strokeWidth={1.5}
                    />{" "}
                    <span className="truncate text-ellipsis">Eliminar</span>
                </Button>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                        const observation = {
                            ...obs,
                            projectCharterId: projectCharter.id,
                        };

                        startEditing(observation);
                    }}
                >
                    <Pencil
                        className="mr-1 h-4 w-4 flex-shrink-0"
                        strokeWidth={1.5}
                    />{" "}
                    <span className="truncate text-ellipsis">Editar</span>
                </Button>
            </div>
        </>
    );
}
