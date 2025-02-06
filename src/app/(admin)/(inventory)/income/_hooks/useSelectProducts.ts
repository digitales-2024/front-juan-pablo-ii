// StateManager/index.tsx
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MovementDto } from "../_interfaces/income.interface";
// type MovementDto = {
//     productId: string;
//     quantity: number;
//     date?: string;
//     state?: boolean;
// }
interface ProductSelected extends MovementDto {
  name: string;
}

type Action =
    | { type: "append"; payload: ProductSelected }
    | { type: "delete"; payload: { productId: string } };

function reducer(state: ProductSelected[], action: Action): ProductSelected[] {
    switch (action.type) {
        case "append":
            return [
                ...state,
                action.payload
            ];
        case "delete":
            return state.filter(product => product.productId !== action.payload.productId);
        default:
            throw new Error();
    }
}

const useSelectedProducts = () => {
  const { data } = useQuery<ProductSelected[]>({
    queryKey: ["incoming-selected-products"],
  });
  return data;
};

const useSelectProductDispatch = () => {
  const client = useQueryClient();
  const dispatch = (action: Action) => {
    client.setQueryData(["incoming-selected-products"], (oldState: ProductSelected[]) => {
      return reducer(oldState, action);
    });
  };
  return dispatch;
};

export { useSelectedProducts, useSelectProductDispatch };