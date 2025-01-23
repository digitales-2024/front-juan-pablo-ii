import { Client } from "./quotation";

export type ProjectCharter = {
    id: string;
    amountOfObservations?: number;
    designProject: DesignProject;
};

type DesignProject = {
    id: string;
    code: string;
    status: string;
    client: Client;
    designer: Designer;
};

export type Designer = {
    id: string;
    name: string;
};
