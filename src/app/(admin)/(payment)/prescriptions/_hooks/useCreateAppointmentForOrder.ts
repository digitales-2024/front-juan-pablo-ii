import { useQuery, useQueryClient } from "@tanstack/react-query";

type ServiceIrderAppointmentItem = {
    serviceId: string;
    appointmentId: string;
    uniqueIdentifier?: string;
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
      // const existingServicesIds = new Set(
      //   state.map((appointment) => appointment.serviceId)
      // );

      // const existingServicesIds = new Set(
      //   state.map((appointment) =>
      //     appointment.uniqueIdentifier
      //       ? `${appointment.serviceId}-${appointment.uniqueIdentifier}`
      //       : appointment.serviceId
      //   )
      // );

      const existingKeys = new Set(
        state.map((item) =>
          item.uniqueIdentifier
        ? `${item.serviceId}-${item.uniqueIdentifier}`
        : item.serviceId
        )
      );
      return [
        ...state,
        ...action.payload.filter((newItem) => {
          const key = newItem.uniqueIdentifier
        ? `${newItem.serviceId}-${newItem.uniqueIdentifier}`
        : newItem.serviceId;
          return !existingKeys.has(key);
        }),
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

  return {
    dataQuery: selectedServicesAppointmentsIds,
    data: selectedServicesAppointmentsIds.data ?? [],
  };
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
