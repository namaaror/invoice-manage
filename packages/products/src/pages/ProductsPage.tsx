import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@invoice-manager/state';
import { loadProducts, setSelectedProduct, deleteProduct } from '../store/productSlice';
import ProductFormDrawer from '../components/ProductFormDrawer';
import styles from './ProductsPage.module.scss';

// Define the Product interface at the top of the file or import it from a shared file
interface Product {
    id: string;
    name: string;
    rate: number;
}

export const ProductsPage: React.FC = () => {
    const dispatch = useDispatch();
    const products = useSelector((state: RootState) => state.product.products);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    useEffect(() => {
        const storedProducts = localStorage.getItem('products');
        if (storedProducts) {
            dispatch(loadProducts(JSON.parse(storedProducts)));  // Provide the payload (Product[])
        }
    }, [dispatch]);

    // Open the drawer for adding a new product
    const handleAddProduct = () => {
        dispatch(setSelectedProduct(null)); // Reset selected product for new addition
        setIsDrawerOpen(true);
    };

    // Open the drawer for editing an existing product
    const handleEditProduct = (product: Product) => {
        dispatch(setSelectedProduct(product)); // Set selected product for editing
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    return (
        <div className={styles.productsPage}>
            <h1>Products</h1>

            <button onClick={handleAddProduct} className={styles.addButton}>
                Add New Product
            </button>

            <input
                type="text"
                placeholder="Search by product name"
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchInput}
            />

            {currentProducts.length > 0 ? <table className={styles.productTable}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>₹{product.rate.toFixed(2)}</td>
                            <td>
                                <button
                                    className={styles.editButton}
                                    onClick={() => handleEditProduct(product)}
                                >
                                    Edit
                                </button>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => dispatch(deleteProduct(product.id))}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table> :
                <div className={styles.productsNotPresent}>
                    No products
                </div>
            }


            {totalPages > 1 &&
                <div className={styles.pagination}>
                    <button
                        className={styles.paginationButton}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className={styles.paginationButton}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                    >
                        Next
                    </button>
                </div>
            }


            {isDrawerOpen && <ProductFormDrawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} />}
        </div>
    );
};
