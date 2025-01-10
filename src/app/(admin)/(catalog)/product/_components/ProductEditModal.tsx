'use client';
import { useState } from "react";
import { Product } from "../types";
import ProductForm from "./ProductForm";

interface ProductEditModalProps {
    product: Product;
    onClose: () => void;
}

const ProductEditModal: React.FC<ProductEditModalProps> = ({ product, onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Lógica para actualizar el producto
        setIsSubmitting(false);
        onClose();
    };

    return (
        <div>
            <h2>Edit Product</h2>
            <ProductForm product={product} onSubmit={handleSubmit} />
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default ProductEditModal;