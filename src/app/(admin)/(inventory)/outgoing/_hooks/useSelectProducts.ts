// StateManager/index.tsx
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ActiveProduct } from "@/app/(admin)/(catalog)/product/products/_interfaces/products.interface";

type State = ActiveProduct[];
type Action =
  | { type: "append"; payload: ActiveProduct[] }
  | { type: "remove"; payload: { productId: string }}
  | { type: "clear" };

function reducer(state: State, action: Action): ActiveProduct[] {
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
    case "remove":
      return (state ?? []).filter((item) => item.id !== action.payload.productId);
    case "clear":
      return [];
    default:
      return state ?? [];
  }
}

const useSelectedProducts = () => {
  const selectedProducts = useQuery<ActiveProduct[]>({
    queryKey: ["outgoing-selected-products"],
    initialData: [],
  });

  return selectedProducts.data ?? [];
};

const useSelectProductDispatch = () => {
  const client = useQueryClient();
  const dispatch = (action: Action) => {
    client.setQueryData<ActiveProduct[]>(["outgoing-selected-products"], (oldState) => {
      const newData = reducer(oldState ?? [], action);
      return newData;
    });
  };
  return dispatch;
};

export { useSelectedProducts, useSelectProductDispatch };
