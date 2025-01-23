export type Observation = {
    id: string;
    observation: string;
    meetingDate: string;
    projectCharterId: string;
};

export type ObservationProject = {
    id: string;
    observation: string;
    meetingDate: string;
    projectCharter: {
        designProject: {
            code: string;
            name: string;
        };
    };
};
