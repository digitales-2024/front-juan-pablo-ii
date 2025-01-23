export interface Space {
    spaceId: string;
    name: string;
    meters: number;
    amount: number;
    selected?: boolean;
}

export interface Floor {
    number: number;
    name: string;
    spaces: Space[];
    expanded: boolean;
}
