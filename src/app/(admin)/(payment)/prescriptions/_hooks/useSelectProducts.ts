// // StateManager/index.tsx
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { OutgoingProducStockForm } from "../../stock/_interfaces/stock.interface";

// type State = OutgoingProducStockForm[];
// type Action =
//   | { type: "append"; payload: OutgoingProducStockForm[] }
//   | { type: "replace"; payload: OutgoingProducStockForm[] }
//   | { type: "remove"; payload: { productId: string }}
//   | { type: "clear" };

// function reducer(state: State, action: Action): OutgoingProducStockForm[] {
//   switch (action.type) {
//     case "append": {
//       const existingIds = new Set(
//         state.map((product) => product.id)
//       );
//       return [
//         ...state,
//         ...action.payload.filter(
//           (newProduct) => !existingIds.has(newProduct.id)
//         ),
//       ];
//     }
//     case "replace":{
//       return [...action.payload];
//     }
//     case "remove":
//       return (state ?? []).filter((item) => item.id !== action.payload.productId);
//     case "clear":
//       return [];
//     default:
//       return state ?? [];
//   }
// }

// const useSelectedProducts = () => {
//   const selectedProducts = useQuery<OutgoingProducStockForm[]>({
//     queryKey: ["outgoing-selected-products"],
//     initialData: [],
//   });

//   return selectedProducts.data ?? [];
// };

// const useSelectProductDispatch = () => {
//   const client = useQueryClient();
//   const dispatch = (action: Action) => {
//     client.setQueryData<OutgoingProducStockForm[]>(["outgoing-selected-products"], (oldState) => {
//       const newData = reducer(oldState ?? [], action);
//       return newData;
//     });
//   };
//   return dispatch;
// };


// export type OutgoingSelectedStorage = {
//   storageId: string;
//   name: string;
// }
// type OutgoingSelectedStorageAction =
//   | { type: "append"; payload: OutgoingSelectedStorage[] }
//   | { type: "remove"; payload: { storageId: string }}
//   | { type: "clear" };

// export function useSelectedStorageId() {
//   const { data } = useQuery({
//     queryKey: ["selected-outgoing-storage-id"],
//     initialData: [],
//   });
//   return data;
// }

// function storageReducer(state: OutgoingSelectedStorage[], action: OutgoingSelectedStorageAction): OutgoingSelectedStorage[] {
//   switch (action.type) {
//     case "append": {
//       const existing = new Set(state.map(item => item.storageId));
//       return [
//         ...state,
//         ...action.payload.filter(entry => !existing.has(entry.storageId)),
//       ];
//     }
//     case "remove":
//       return state.filter(item => item.storageId !== action.payload.storageId);
//     case "clear":
//       return [];
//     default:
//       return state;
//   }
// }

// export function useSelectStorageDispatch() {
//   const client = useQueryClient();
//   return (action: OutgoingSelectedStorageAction) => {
//     client.setQueryData<OutgoingSelectedStorage[]>(
//       ["selected-outgoing-storage-id"],
//       prev => storageReducer(prev ?? [], action)
//     );
//   };
// }

// export { useSelectedProducts, useSelectProductDispatch };
