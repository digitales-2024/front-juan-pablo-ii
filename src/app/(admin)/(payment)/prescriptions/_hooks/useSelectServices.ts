// StateManager/index.tsx
import { Service } from "@/app/(admin)/services/_interfaces/service.interface";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type State = Service[];
type Action =
  | { type: "append"; payload: Service[] }
  | { type: "replace"; payload: Service[] }
  | { type: "remove"; payload: { serviceId: string }}
  | { type: "clear" };

function reducer(state: State, action: Action): Service[] {
  switch (action.type) {
    case "append": {
      const existingIds = new Set(
        state.map((service) => service.id)
      );

      return [
        ...state,
        ...action.payload.filter(
          (newService) => !existingIds.has(newService.id)
        ),
      ];
    }
    case "replace":{
      return [...action.payload];
    }
    case "remove":
      return (state ?? []).filter((item) => item.id !== action.payload.serviceId);
    case "clear":
      return [];
    default:
      return state ?? [];
  }
}

const useSelectedServices = () => {
  const selectedProducts = useQuery<Service[]>({
    queryKey: ["prescription-order-selected-services"],
    initialData: [],
  });

  return selectedProducts.data ?? [];
};

const useSelectServiceDispatch = () => {
  const client = useQueryClient();
  const dispatch = (action: Action) => {
    client.setQueryData<Service[]>(["prescription-order-selected-services"], (oldState) => {
      const newData = reducer(oldState ?? [], action);
      return newData;
    });
  };
  return dispatch;
};

export { useSelectedServices, useSelectServiceDispatch };
