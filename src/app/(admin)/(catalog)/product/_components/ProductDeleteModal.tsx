'use client';
import { useState } from "react";
import { deleteProduct } from "../actions";

interface ProductDeleteModalProps {
    productId: string;
    onClose: () => void;
}

const ProductDeleteModal: React.FC<ProductDeleteModalProps> = ({ productId, onClose }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDelete = async () => {
        setIsSubmitting(true);
        await deleteProduct(productId);
        setIsSubmitting(false);
        onClose();
    };

    return (
        <div>
            <h2>Are you sure you want to delete this product?</h2>
            <button onClick={handleDelete} disabled={isSubmitting}>Delete</button>
            <button onClick={onClose}>Cancel</button>
        </div>
    );
};

export default ProductDeleteModal;