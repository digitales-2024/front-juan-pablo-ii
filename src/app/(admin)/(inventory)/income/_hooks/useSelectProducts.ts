// StateManager/index.tsx
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MovementDto } from "../_interfaces/income.interface";
import { ActiveProduct } from "@/app/(admin)/(catalog)/product/products/_interfaces/products.interface";
// type MovementDto = {
//     productId: string;
//     quantity: number;
//     date?: string;
//     state?: boolean;
// }
// interface ProductSelected extends MovementDto {
//   name: string;
// }

type State = ActiveProduct[];
type Action =
  | { type: "append"; payload: ActiveProduct[] }
  | { type: "remove"; payload: { productId: string } }
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
    queryKey: ["incoming-selected-products"],
    initialData: [],
  });

  return selectedProducts.data ?? [];
};

const useSelectProductDispatch = () => {
  const client = useQueryClient();
  const dispatch = (action: Action) => {
    client.setQueryData<ActiveProduct[]>(["incoming-selected-products"], (oldState) => {
      console.log(
        "oldState",
        oldState
      )
      const newData = reducer(oldState ?? [], action);
      console.log('updatedData', newData);
      return newData;
    });
  };
  return dispatch;
};

export { useSelectedProducts, useSelectProductDispatch };
