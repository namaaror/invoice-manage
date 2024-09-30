import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@invoice-manager/state';
import { setSelectedProduct, deleteProduct } from '../store/productSlice';
import styles from './ProductList.module.scss';

interface ProductListProps {
    onEdit: () => void;  // Prop to open the drawer for editing
}

const ProductList: React.FC<ProductListProps> = ({ onEdit }) => {
    const dispatch = useDispatch();
    const products = useSelector((state: RootState) => state.product.products);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;

    // Handle search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to the first page when search changes
    };

    // Filter products based on the search query
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    return (
        <div className={styles.productListContainer}>
            <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchInput}
            />
            {currentProducts.length > 0 ? (
                <>
                    <table className={styles.productTable}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProducts.map((product) => (
                                <tr key={product.id} className={styles.productItem}>
                                    <td>{product.name}</td>
                                    <td>₹{product.rate.toFixed(2)}</td>
                                    <td>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => {
                                                dispatch(setSelectedProduct(product));
                                                onEdit();  // Open the drawer for editing
                                            }}
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
                    </table>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                className={styles.paginationButton}
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span>Page {currentPage} of {totalPages}</span>
                            <button
                                className={styles.paginationButton}
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className={styles.productsNotPresent}>
                    No products found
                </div>
            )}
        </div>
    );
};

export default ProductList;
