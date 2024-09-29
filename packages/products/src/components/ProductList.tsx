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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.productListContainer}>
            <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchInput}
            />
            <table className={styles.productTable}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.map((product) => (
                        <tr key={product.id} className={styles.productItem}>
                            <td>{product.name}</td>
                            <td>₹{product.price.toFixed(2)}</td>
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
        </div>
    );
};

export default ProductList;