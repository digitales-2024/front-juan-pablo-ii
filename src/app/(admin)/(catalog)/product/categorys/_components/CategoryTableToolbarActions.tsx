"use client";

import { Category } from "../types";
import { type Table } from "@tanstack/react-table";

import { CreateCategoryDialog } from "./CreateCategoryDialog";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { ReactivateCategoryDialog } from "./ReactivateCategoryDialog";
import { useProfileStore } from "@/app/hooks/use-profile";

export interface CategoryTableToolbarActionsProps {
    table?: Table<Category>;
    exportFile?: boolean;
}

/**
 * Componente que renderiza las acciones de la tabla de categorías.
 * Recibe un objeto {@link Table} que representa la tabla.
 * Si se seleccionaron filas en la tabla, renderiza dos botones:
 * - "Eliminar categorías" que lanza un diálogo para eliminar las categorías
 *   seleccionadas.
 * - "Reactivar categorías" que lanza un diálogo para reactivar las categorías
 *   seleccionadas, solo si el perfil del usuario actual tiene permiso de
 *   administrador.
 * Si no se seleccionaron filas en la tabla, solo renderiza el botón
 * "Crear categoría".
 * @param {{ table?: Table<Category> }} props
 * @returns {JSX.Element} El componente renderizado.
 */
export function CategoryTableToolbarActions({
    table,
}: CategoryTableToolbarActionsProps) {
    const { profile } = useProfileStore();
    return (
        <div className="flex w-fit flex-wrap items-center gap-2">
            {table && table.getFilteredSelectedRowModel().rows.length > 0 ? (
                <>
                    <DeleteCategoryDialog
                        categories={table
                            .getFilteredSelectedRowModel()
                            .rows.map((row) => row.original)}
                        onSuccess={() => table.toggleAllRowsSelected(false)}
                    />
                    {profile?.isSuperAdmin && (
                        <ReactivateCategoryDialog
                            categories={table
                                .getFilteredSelectedRowModel()
                                .rows.map((row) => row.original)}
                            onSuccess={() => table.toggleAllRowsSelected(false)}
                        />
                    )}
                </>
            ) : null}
            <CreateCategoryDialog />
        </div>
    );
}