import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { loadProducts, setSelectedProduct } from '../store/productSlice';
import ProductFormDrawer from '../components/ProductFormDrawer';
import ProductList from '../components/ProductList'; // Import the ProductList component
import styles from './ProductsPage.module.scss';

// Define the Product interface or import it from a shared file
interface Product {
    id: string;
    name: string;
    rate: number;
}

export const ProductsPage: React.FC = () => {
    const dispatch = useDispatch();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
            dispatch(loadProducts(JSON.parse(storedProducts))); // Load products from localStorage
        }
    }, [dispatch]);

    // Open the drawer for adding a new product
    const handleAddProduct = () => {
        dispatch(setSelectedProduct(null)); // Reset selected product for new addition
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    return (
        <div className={styles.productsPage}>
            <h1>Products</h1>

            <button onClick={handleAddProduct} className={styles.addButton}>
                Add New Product
            </button>

            {/* Reuse ProductList component */}
            <ProductList onEdit={() => setIsDrawerOpen(true)} />

            {/* ProductFormDrawer for adding/editing products */}
            {isDrawerOpen && <ProductFormDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} />}
        </div>
    );
};
