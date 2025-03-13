// import { fetchRegionNames } from "@/lib/api";
// import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
// import { useProducts } from "@/app/(admin)/(catalog)/product/products/_hooks/useProduct";
import { SearchCombobox } from "@/components/ui/custom/remoteSearchCombobox/RemoteSearchComobox";
import { useOrders } from "../../_hooks/useOrders";
import { DetailedOrder } from "../../_interfaces/order.interface";

type SearchOrderComoBoxProps = {
    onValueChange: (value: string, entity?:unknown) => void;
    defaultValue?: string;
};

export default function SearchOrderCombobox({
    onValueChange,
    defaultValue,

}: SearchOrderComoBoxProps) {
  const DefaultSearchValue = "None"; //IMPORTANT: This value is used to SEND a request to the backend when the search input is empty
  const [value, setValue] = useState(defaultValue);
  const [label, setLabel] = useState("Buscar paciente por Nro. de Órden");
  // const [entity, setEntity] = useState<T | null>(null);
  const [search, setSearch] = useState(DefaultSearchValue);

    const { useSearchDetailedOrderQuery } = useOrders();
    const queryResponse = useSearchDetailedOrderQuery(search);
    const { data } = queryResponse;

    const mapToComboboxItem = useCallback((order: DetailedOrder) => {
      const date = new Date(order.date);
      return {
        value: order.id,
        label: `${order.id} - ${date.toLocaleDateString()}`,
        entity: order,
      }
    }, []);

    const mapToComboboxItems = useCallback((orders: DetailedOrder[]) => orders.map(mapToComboboxItem), [mapToComboboxItem]);

  return (
    <SearchCombobox<DetailedOrder>
      queryState={queryResponse}
      className="max-w-90"
      items={data ? (mapToComboboxItems(data)):[]}
      value={value}
      label={label}
      onSelect={(value, label, entity) => {
        setValue(value ?? DefaultSearchValue); //antes estaba ''
        setLabel(label ?? DefaultSearchValue); //antes estaba ''
        onValueChange(value, entity);
      }}
      onSearchChange={(val)=>setSearch(val===""?DefaultSearchValue:val)} // set search to "None" if empty string
      // regexInput={/^[0-9]*$/} // only allow numbers
      searchPlaceholder="Busca por Nro. de Òrden..."
      noResultsMsg="No se encontro resultados"
      selectItemMsg="Selecciona una òrden"
    />
  );
}