import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@invoice-manager/state';
import { setSelectedCustomer, deleteCustomer } from '../store/customerSlice';
import styles from './CustomerList.module.scss';

interface CustomerListProps {
    onEdit: () => void;  // Prop to handle opening the drawer for editing
}

const CustomerList: React.FC<CustomerListProps> = ({ onEdit }) => {
    const dispatch = useDispatch();
    const customers = useSelector((state: RootState) => state.customer.customers);

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const customersPerPage = 5;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to the first page when search changes
    };

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery)
    );

    // Pagination Logic
    const indexOfLastCustomer = currentPage * customersPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
    const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);
    const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    return (
        <div className={styles.customerListContainer}>
            <input
                type="text"
                placeholder="Search by name, email, or phone"
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchInput}
            />

            {currentCustomers.length > 0 ? (
                <>
                    <table className={styles.customerTable}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentCustomers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.name}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.phone}</td>
                                    <td>
                                        <button
                                            className={styles.editButton}
                                            onClick={() => {
                                                dispatch(setSelectedCustomer(customer));
                                                onEdit();
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={styles.deleteButton}
                                            onClick={() => dispatch(deleteCustomer(customer.id))}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
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
                </>
            ) : (
                <div className={styles.customersNoPresent}>No customers</div>
            )}
        </div>
    );
};

export default CustomerList;