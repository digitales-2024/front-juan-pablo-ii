"use client";
import { DataTable } from "@/components/data-table/DataTable";
import { useEffect, useMemo } from "react";
import { TypeProduct } from "../types";
import { typeColumns } from "./TypeTableColumns";
import { TypeTableToolbarActions } from "./TypeTableToolbarActions";
import { Profile } from "@/app/(account)/type";
import { useProfileStore } from "@/app/hooks/use-profile";

interface TypeTableProps {
    data: TypeProduct[];
    profile: Profile;
}

const TypeTable: React.FC<TypeTableProps> = ({ data, profile }) => {
    const columns = useMemo(
        () => typeColumns(profile.isSuperAdmin),
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
            toolbarActions={<TypeTableToolbarActions />}
            placeholder="Buscar tipo de producto..."
        />
    );
};

export default TypeTable;