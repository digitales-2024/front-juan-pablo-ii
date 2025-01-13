"use client";
"use memo";
import { DataTable } from "@/components/data-table/DataTable";
import { useMemo } from "react";
import { Product } from "../types";
import { productColumns } from "./ProductTableColumns";
import { ProductTableToolbarActions } from "./ProductTableToolbarActions";

interface ProductTableProps {
    data: Product[];
}

const ProductTable: React.FC<ProductTableProps> = ({ data }) => {
    const columns = useMemo(() => productColumns(), []);

    return (
        <DataTable
            data={data}
            columns={columns}
            toolbarActions={<ProductTableToolbarActions />}
            placeholder="Buscar producto..."
        />
    );
};

export default ProductTable;