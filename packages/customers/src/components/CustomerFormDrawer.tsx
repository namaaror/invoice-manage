import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@invoice-manager/state';
import { addCustomer, updateCustomer, setSelectedCustomer } from '../store/customerSlice';
import styles from './CustomerFormDrawer.module.scss';

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
}

interface CustomerFormDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onAddCustomer?: (customer: Customer) => void; // Optional callback to add customer in parent
}

const CustomerFormDrawer: React.FC<CustomerFormDrawerProps> = ({ isOpen, onClose, onAddCustomer }) => {
    const dispatch = useDispatch();
    const selectedCustomer = useSelector((state: RootState) => state.customer.selectedCustomer);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        if (selectedCustomer) {
            setFormData({
                id: selectedCustomer.id,
                name: selectedCustomer.name,
                email: selectedCustomer.email,
                phone: selectedCustomer.phone,
            });
        } else {
            setFormData({
                id: '',
                name: '',
                email: '',
                phone: '',
            });
        }
    }, [selectedCustomer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (formData.id) {
            // If the customer exists (editing mode)
            dispatch(updateCustomer(formData));
        } else {
            // Adding a new customer
            const newCustomer = { ...formData, id: Date.now().toString() };

            if (onAddCustomer) {
                // If `onAddCustomer` is provided, call it to pass the customer to the parent (InvoiceForm)
                onAddCustomer(newCustomer);
            } else {
                // If `onAddCustomer` is not provided, dispatch to Redux store
                dispatch(addCustomer(newCustomer));
            }
        }

        onClose(); // Close the drawer after submitting
        dispatch(setSelectedCustomer(null)); // Reset selected customer after submission
    };

    if (!isOpen) return null;

    return (
        <div className={styles.drawer}>
            <div className={styles.drawerHeader}>
                <h2>{selectedCustomer ? 'Edit Customer' : 'New Customer'}</h2>
            </div>
            <form onSubmit={handleSubmit} className={styles.customerForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formActions}>
                    <button type="button" className={styles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className={styles.saveButton}>
                        {selectedCustomer ? 'Update' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CustomerFormDrawer;