// StateManager/index.tsx
import { OutgoingProducStockForm } from "@/app/(admin)/(inventory)/stock/_interfaces/stock.interface";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type State = OutgoingProducStockForm[];
type Action =
  | { type: "append"; payload: OutgoingProducStockForm[] }
  | { type: "replace"; payload: OutgoingProducStockForm[] }
  | { type: "remove"; payload: { productId: string }}
  | { type: "clear" };

function reducer(state: State, action: Action): OutgoingProducStockForm[] {
  switch (action.type) {
    case "append": {
      const existingIds = new Set(
        state.map((product) => product.id)
      );

      return [
        ...state,
        ...action.payload.filter(
          (newProduct) => !existingIds.has(newProduct.id)
        ),
      ];
    }
    case "replace":{
      return [...action.payload];
    }
    case "remove":
      return (state ?? []).filter((item) => item.id !== action.payload.productId);
    case "clear":
      return [];
    default:
      return state ?? [];
  }
}

const useSelectedProducts = () => {
  const selectedProducts = useQuery<OutgoingProducStockForm[]>({
    queryKey: ["prescription-order-selected-products"],
    initialData: [],
  });

  return selectedProducts.data ?? [];
};

const useSelectProductDispatch = () => {
  const client = useQueryClient();
  const dispatch = (action: Action) => {
    client.setQueryData<OutgoingProducStockForm[]>(["prescription-order-selected-products"], (oldState) => {
      const newData = reducer(oldState ?? [], action);
      return newData;
    });
  };
  return dispatch;
};

export { useSelectedProducts, useSelectProductDispatch };
