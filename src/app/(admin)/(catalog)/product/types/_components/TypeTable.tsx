"use client";
import { DataTable } from "@/components/data-table/DataTable";
import { useEffect, useMemo } from "react";
import { Category } from "../types";
import { categoryColumns } from "./TypeTableColumns";
import { CategoryTableToolbarActions } from "./TypeTableToolbarActions";
import { Profile } from "@/app/(account)/type";
import { useProfileStore } from "@/app/hooks/use-profile";

interface CategoryTableProps {
    data: Category[];
    profile: Profile;
}

const CategoryTable: React.FC<CategoryTableProps> = ({ data, profile }) => {
    const columns = useMemo(
        () => categoryColumns(profile.isSuperAdmin),
        [profile]
    );
    const { setProfile } = useProfileStore();

    useEffect(() => {
        setProfile(profile);
    }, [profile]);

    return (
        <DataTable
            data={data}
            columns={columns}
            toolbarActions={<CategoryTableToolbarActions />}
            placeholder="Buscar categoría..."
        />
    );
};

export default CategoryTable;