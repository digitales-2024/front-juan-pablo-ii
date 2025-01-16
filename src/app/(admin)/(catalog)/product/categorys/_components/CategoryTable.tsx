"use client";
import { DataTable } from "@/components/data-table/DataTable";
import { useEffect, useMemo } from "react";
import { Category } from "../types";
import { categoryColumns } from "./CategoryTableColumns";
import { CategoryTableToolbarActions } from "./CategoryTableToolbarActions";
import { Profile } from "@/app/(account)/type";
import { useProfileStore } from "@/app/hooks/use-profile";

interface CategoryTableProps {
    data: Category[];
    profile: Profile;
}

/**
 * Componente que renderiza una tabla de categorías.
 * Recibe una lista de categorías y el perfil del usuario actual.
 * Utiliza la hook `useProfileStore` para guardar el perfil del usuario actual.
 * Utiliza la hook `useMemo` para memoizar las columnas de la tabla.
 * Utiliza la hook `useEffect` para guardar el perfil del usuario actual.
 * @param {Category[]} data - La lista de categorías.
 * @param {Profile} profile - El perfil del usuario actual.
 * @returns {JSX.Element} El componente renderizado.
 */
const CategoryTable: React.FC<CategoryTableProps> = ({ data, profile }) => {
    const columns = useMemo(
        // Memoiza las columnas de la tabla con la propiedad isSuperAdmin del perfil.
        () => categoryColumns(profile.isSuperAdmin),
        // El array de dependencias solo contiene el perfil, por lo que si el perfil cambia,
        // se volverán a calcular las columnas.
        [profile]
    );
    const { setProfile } = useProfileStore();

    useEffect(() => {
        // Guarda el perfil del usuario actual en el store.
        setProfile(profile);
    }, [profile]);

    return (
        <DataTable
            // La lista de categorías que se va a renderizar.
            data={data}
            // Las columnas de la tabla, que se memoizaron previamente.
            columns={columns}
            // El toolbar con las acciones de la tabla.
            toolbarActions={<CategoryTableToolbarActions />}
            // El placeholder del input de búsqueda.
            placeholder="Buscar categoría..."
        />
    );
};

export default CategoryTable;