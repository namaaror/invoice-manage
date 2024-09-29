import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@invoice-manager/state';
import { addProduct, updateProduct, setSelectedProduct } from '../store/productSlice';
import styles from './ProductFormDrawer.module.scss';

interface Product {
    id: string;
    name: string;
    price: number;
}

interface ProductFormDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onAddProduct?: (product: Product) => void; // Optional callback for adding a product in parent
}

const ProductFormDrawer: React.FC<ProductFormDrawerProps> = ({ isOpen, onClose, onAddProduct }) => {
    const dispatch = useDispatch();
    const selectedProduct = useSelector((state: RootState) => state.product.selectedProduct);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price: 0,
    });

    useEffect(() => {
        if (selectedProduct) {
            setFormData({
                id: selectedProduct.id,
                name: selectedProduct.name,
                price: selectedProduct.price,
            });
        } else {
            setFormData({
                id: '',
                name: '',
                price: 0,
            });
        }
    }, [selectedProduct]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'price' ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newProduct = {
            ...formData,
            id: formData.id || Date.now().toString(), // Generate an ID if it's a new product
        };

        if (formData.id) {
            // If product already exists (edit mode)
            dispatch(updateProduct(newProduct));
        } else if (onAddProduct) {
            // If `onAddProduct` is provided, pass the new product back to the parent (InvoiceForm)
            onAddProduct(newProduct);
        } else {
            // Otherwise, dispatch addProduct to Redux store
            dispatch(addProduct(newProduct));
        }

        onClose(); // Close the drawer after submitting
        dispatch(setSelectedProduct(null)); // Reset selected product
    };

    if (!isOpen) return null;

    return (
        <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
            <button onClick={onClose} className={styles.closeButton}>Close</button>
            <h2>{selectedProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Product Name"
                    required
                />
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price"
                    required
                />
                <button type="submit" className={styles.submitButton}>
                    {selectedProduct ? 'Save Changes' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};

export default ProductFormDrawer;