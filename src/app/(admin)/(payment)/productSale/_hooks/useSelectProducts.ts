// StateManager/index.tsx
import { OutgoingProductStock } from "@/app/(admin)/(inventory)/stock/_interfaces/stock.interface";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type State = OutgoingProductStock[];
type Action =
  | { type: "append"; payload: OutgoingProductStock[] }
  | { type: "replace"; payload: OutgoingProductStock[] }
  | { type: "remove"; payload: { productId: string }}
  | { type: "clear" };

function reducer(state: State, action: Action): OutgoingProductStock[] {
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
  const selectedProducts = useQuery<OutgoingProductStock[]>({
    queryKey: ["product-sale-order-selected-products"],
    initialData: [],
  });

  return selectedProducts.data ?? [];
};

const useSelectProductDispatch = () => {
  const client = useQueryClient();
  const dispatch = (action: Action) => {
    client.setQueryData<OutgoingProductStock[]>(["product-sale-order-selected-products"], (oldState) => {
      const newData = reducer(oldState ?? [], action);
      return newData;
    });
  };
  return dispatch;
};

export { useSelectedProducts, useSelectProductDispatch };
