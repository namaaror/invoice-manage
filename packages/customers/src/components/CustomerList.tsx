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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const filteredCustomers = customers.filter((customer) =>
        customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.customerListContainer}>
            <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchInput}
            />
            <ul>
                {filteredCustomers.map((customer) => (
                    <li key={customer.id} className={styles.customerItem}>
                        <div>
                            <strong>{customer.name}</strong>
                            <p>{customer.email}</p>
                            <p>{customer.phone}</p>
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    dispatch(setSelectedCustomer(customer));
                                    onEdit();
                                }}
                            >
                                Edit
                            </button>
                            <button onClick={() => dispatch(deleteCustomer(customer.id))}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CustomerList;