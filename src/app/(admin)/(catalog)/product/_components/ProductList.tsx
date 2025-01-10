'use client';
import { Product } from "../types";

interface ProductListProps {
    products: Product[];
    onEdit: (product: Product) => void;
    onDelete: (id: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete }) => {
    return (
        <div>
            {products.map((product) => (
                <div key={product.id}>
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p>{product.precio}</p>
                    <button onClick={() => onEdit(product)}>Edit</button>
                    <button onClick={() => onDelete(product.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
};

export default ProductList;