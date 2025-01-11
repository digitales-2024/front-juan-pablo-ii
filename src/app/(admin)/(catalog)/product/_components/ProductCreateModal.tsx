'use client';
import { useState } from "react";
import ProductForm from "./ProductForm";

const ProductCreateModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Lógica para crear el producto
        setIsSubmitting(false);
        onClose();
    };

    return (
        <div>
            <h2>Create Product</h2>
            <ProductForm onSubmit={handleSubmit} />
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default ProductCreateModal;