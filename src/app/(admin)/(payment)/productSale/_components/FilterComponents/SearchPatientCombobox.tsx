// import { fetchRegionNames } from "@/lib/api";
// import { useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
// import { useProducts } from "@/app/(admin)/(catalog)/product/products/_hooks/useProduct";
import { SearchCombobox } from "@/components/ui/custom/remoteSearchCombobox/RemoteSearchComobox";
import { usePatients } from "@/app/(admin)/(patient)/patient/_hooks/usePatient";
import { Patient } from "@/app/(admin)/(patient)/patient/_interfaces/patient.interface";

type SearchProductComoBoxProps = {
    onValueChange: (value: string) => void;
    defaultValue?: string;
};

export default function SearchPatientCombobox({
    onValueChange,
    defaultValue,
}: SearchProductComoBoxProps) {
  const DefaultSearchValue = "None"; //IMPORTANT: This value is used to SEND a request to the backend when the search input is empty
  const [value, setValue] = useState(defaultValue);
  const [label, setLabel] = useState("Buscar paciente por DNI");
  const [search, setSearch] = useState(DefaultSearchValue);

    const { usePatientByDNI } = usePatients();
    const queryResponse = usePatientByDNI(search);
    const { data } = queryResponse;

    const mapToComboboxItem = useCallback((patient: Patient) => ({
      value: patient.id,
      label: `${patient.dni} - ${patient.name.toUpperCase()} ${patient.lastName? patient.lastName.toUpperCase():""}`,
    }), []);

    const mapToComboboxItems = useCallback((patients: Patient[]) => patients.map(mapToComboboxItem), [mapToComboboxItem]);

  return (
    <SearchCombobox<Patient>
      queryState={queryResponse}
      className="w-full"
      items={data ? (mapToComboboxItems(data)):[]}
      value={value}
      label={label}
      onSelect={(value, label) => {
        setValue(value ?? DefaultSearchValue); //antes estaba ''
        setLabel(label ?? DefaultSearchValue); //antes estaba ''
        onValueChange(value);
      }}
      onSearchChange={(val)=>setSearch(val===""?DefaultSearchValue:val)} // set search to "None" if empty string
      regexInput={/^[0-9]*$/} // only allow numbers
      searchPlaceholder="Busca por DNI..."
      noResultsMsg="No se encontro resultados"
      selectItemMsg="Selecciona un paciente"
    />
  );
}


// type SearchPatientComoBoxProps = {
//   onValueChange: (value: string) => void;
//   defaultValue?: string;
// };

// export default function SearchPatientCombobox({
//   onValueChange,
//   defaultValue,
// }: SearchPatientComoBoxProps) {
//   const DefaultSearchValue = "None";
//   const [value, setValue] = useState(defaultValue);
//   const [label, setLabel] = useState("Busque a un PACIENTE por su nro. de DNI");
//   const [search, setSearch] = useState(DefaultSearchValue);
//   const [isSearching, setIsSearching] = useState(false);
//   const [hasCE, setHasCE] = useState(false);
  
//   const DNIChars = 8;
//   const CEChars = 9;

//   const { usePatientByDNI } = usePatients();
//   const queryResponse = usePatientByDNI(isSearching ? search : DefaultSearchValue);
//   const { data } = queryResponse;

//   const mapToComboboxItem = useCallback((patient: Patient) => ({
//   value: patient.dni,
//   label: patient.name,
//   }), []);

//   const mapToComboboxItems = useCallback((patients: Patient[]) => patients.map(mapToComboboxItem), [mapToComboboxItem]);

//   const handleSearchChange = (val: string) => {
//   const searchTerm = val === "" ? DefaultSearchValue : val;
//   setSearch(searchTerm);
  
//   // Check if the search term is valid before triggering a search
//   if (searchTerm === DefaultSearchValue) {
//     setIsSearching(false);
//     return;
//   }
  
//   const isCE = searchTerm.startsWith("CE") || searchTerm.startsWith("ce");
//   setHasCE(isCE);
  
//   // Apply validation logic
//   if (!searchTerm) {
//     setIsSearching(false);
//     return;
//   }
  
//   if (!isCE && searchTerm.length < DNIChars) {
//     setIsSearching(false);
//     return;
//   }
  
//   if (!isCE && searchTerm.length > DNIChars) {
//     setIsSearching(false);
//     return;
//   }
  
//   if (isCE && searchTerm.length < 1) {
//     setIsSearching(false);
//     return;
//   }
  
//   if (isCE && searchTerm.length > CEChars) {
//     setIsSearching(false);
//     return;
//   }
  
//   // If we passed all validations, set searching to true
//   setIsSearching(true);
//   };

//   return (
//   <SearchCombobox<ProductSearch>
//     queryState={queryResponse}
//     className="w-full"
//     items={data ? (mapToComboboxItems(data)):[]}
//     value={value}
//     label={label}
//     onSelect={(value, label) => {
//     setValue(value ?? DefaultSearchValue);
//     setLabel(label ?? DefaultSearchValue);
//     onValueChange(value);
//     }}
//     onSearchChange={handleSearchChange}
//     searchPlaceholder="Busca por DNI..."
//     noResultsMsg="No se encontro resultados"
//     selectItemMsg="Selecciona un paciente"
//   />
//   );
// }