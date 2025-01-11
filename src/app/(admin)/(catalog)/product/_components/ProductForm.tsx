'use client';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../validation";
import { CreateProductInput, Product } from "../types";
import { createProduct, updateProduct } from "../actions";

interface ProductFormProps {
    product?: Product;
    onSubmit: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<CreateProductInput>({
        resolver: zodResolver(productSchema),
        defaultValues: product || {},
    });

    const submitHandler = async (data: CreateProductInput) => {
        if (product) {
            await updateProduct(product.id, data);
        } else {
            await createProduct(data);
        }
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit(submitHandler)}>
            <input {...register("name")} placeholder="Name" />
            {errors.name && <p>{errors.name.message}</p>}
            <input {...register("precio")} placeholder="Price" type="number" />
            {errors.precio && <p>{errors.precio.message}</p>}
            <input {...register("unidadMedida")} placeholder="Unit" />
            <input {...register("proveedor")} placeholder="Provider" />
            <input {...register("uso")} placeholder="Use" />
            <input {...register("usoProducto")} placeholder="Product Use" />
            <input {...register("description")} placeholder="Description" />
            <input {...register("codigoProducto")} placeholder="Product Code" />
            <input {...register("descuento")} placeholder="Discount" type="number" />
            <input {...register("observaciones")} placeholder="Observations" />
            <input {...register("condicionesAlmacenamiento")} placeholder="Storage Conditions" />
            <input {...register("imagenUrl")} placeholder="Image URL" />
            <button type="submit">Submit</button>
        </form>
    );
};

export default ProductForm;