// import { fetchRegionNames } from "@/lib/api";
// import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { SearchCombobox } from "./RemoteSearchComobox";
import { useProducts } from "@/app/(admin)/(catalog)/product/products/_hooks/useProduct";
import { ProductSearch } from "@/app/(admin)/(catalog)/product/products/_interfaces/products.interface";

type SearchProductComoBoxProps = {
    onValueChange: (value: string) => void;
    defaultValue?: string;
};

export default function SearchProductCombobox({
    onValueChange,
    defaultValue,
}: SearchProductComoBoxProps) {
  const [value, setValue] = useState(defaultValue);
  const [label, setLabel] = useState("Busque un producto");
  const [search, setSearch] = useState("None");
//   const { data } = useQuery({
//     queryKey: ["regions", search],
//     queryFn: () =>
//       fetchRegionNames(search).then((res) =>
//         res.map((region) => ({
//           value: region.id.toString(),
//           label: region.name,
//         })),
//       ),
//   });

    const { searchProductsByIndexedName } = useProducts();
    const queryResponse = searchProductsByIndexedName(search);
    const { data } = queryResponse;

    const mapToComboboxItem = useCallback((product: ProductSearch) => ({
      value: product.id,
      label: product.name,
    }), []);

    const mapToComboboxItems = useCallback((products: ProductSearch[]) => products.map(mapToComboboxItem), [mapToComboboxItem]);

  return (
    <SearchCombobox<ProductSearch>
      queryState={queryResponse}
      className="w-full"
      items={data ? (mapToComboboxItems(data)):[]}
      value={value}
      label={label}
      onSelect={(value, label) => {
        setValue(value ?? "None"); //antes estaba ''
        setLabel(label ?? "None"); //antes estaba ''
        onValueChange(value);
      }}
      onSearchChange={(val)=>setSearch(val===""?"None":val)} // set search to "None" if empty string
      searchPlaceholder="Busca un producto..."
      noResultsMsg="No se encontro resultados"
      selectItemMsg="Selecciona un producto"
    />
  );
}