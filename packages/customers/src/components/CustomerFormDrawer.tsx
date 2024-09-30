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
    onAddCustomer?: (customer: Customer) => void;
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

    const [phoneError, setPhoneError] = useState('');
    const [nameError, setNameError] = useState('');

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

        if (name === 'phone') {
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(value)) {
                setPhoneError('Phone number must be 10 digits long');
            } else {
                setPhoneError('');
            }
        }

        if (name === 'name') {
            const nameRegex = /^[A-Za-z\s]+$/;
            if (!nameRegex.test(value)) {
                setNameError('Name must contain only alphabets and spaces');
            } else {
                setNameError('');
            }
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (phoneError || nameError) {
            return;
        }

        if (formData.id) {
            dispatch(updateCustomer(formData));
        } else {
            const newCustomer = { ...formData, id: Date.now().toString() };

            if (onAddCustomer) {
                onAddCustomer(newCustomer);
            } else {
                dispatch(addCustomer(newCustomer));
            }
        }

        onClose();
        dispatch(setSelectedCustomer(null));
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
                    {nameError && <p className={styles.error}>{nameError}</p>} {/* Display error message */}
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
                    {phoneError && <p className={styles.error}>{phoneError}</p>} {/* Display error message */}
                </div>

                <div className={styles.formActions}>
                    <button type="button" className={styles.cancelButton} onClick={onClose}>
                        Cancel
                    </button>
                    <button type="submit" className={styles.saveButton} disabled={!!phoneError || !!nameError}>
                        {selectedCustomer ? 'Update' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CustomerFormDrawer;