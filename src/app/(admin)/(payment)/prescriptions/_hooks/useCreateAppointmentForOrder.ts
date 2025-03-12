import { useQuery, useQueryClient } from "@tanstack/react-query";

type ServiceIrderAppointmentItem = {
    serviceId: string;
    appointmentId: string;
}
type State = ServiceIrderAppointmentItem[];
type Action =
  | { type: "append"; payload: ServiceIrderAppointmentItem[] }
  | { type: "replace"; payload: ServiceIrderAppointmentItem[] }
  | { type: "remove"; payload: { appointmentId: string } }
  | { type: "clear" };

function reducer(state: State, action: Action): ServiceIrderAppointmentItem[] {
  switch (action.type) {
    case "append": {
      const existingServicesIds = new Set(
        state.map((appointment) => appointment.serviceId)
      );

      return [
        ...state,
        ...action.payload.filter(
          (newAppointment) => !existingServicesIds.has(newAppointment.serviceId)
        ),
      ];
    }
    case "replace":{
      return [...action.payload];
    }
    case "remove":
      return (state ?? []).filter((appointment) => appointment.appointmentId !== action.payload.appointmentId);
    case "clear":
      return [];
    default:
      return state ?? [];
  }
}

const useSelectedServicesAppointments = () => {
  const selectedServicesAppointmentsIds = useQuery<ServiceIrderAppointmentItem[]>({
    queryKey: ["selected-services-appointments-for-order"],
    initialData: [],
  });

  return selectedServicesAppointmentsIds.data ?? [];
};

const useSelectedServicesAppointmentsDispatch = () => {
  const client = useQueryClient();
  const dispatch = (action: Action) => {
    client.setQueryData<ServiceIrderAppointmentItem[]>(["selected-services-appointments-for-order"], (oldState) => {
      const newData = reducer(oldState ?? [], action);
      return newData;
    });
  };
  return dispatch;
};

export { useSelectedServicesAppointments, useSelectedServicesAppointmentsDispatch };
