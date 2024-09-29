import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './CustomerFormDrawer.module.scss';
import { RootState } from '@invoice-manager/state';
import { addCustomer, updateCustomer, setSelectedCustomer } from '../store/customerSlice';

interface CustomerFormDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CustomerFormDrawer: React.FC<CustomerFormDrawerProps> = ({ isOpen, onClose }) => {
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
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.id) {
            dispatch(updateCustomer(formData));
        } else {
            dispatch(addCustomer({ ...formData, id: Date.now().toString() }));
        }
        onClose();
        dispatch(setSelectedCustomer(null));
    };

    return (
        <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
            <button onClick={onClose} className={styles.closeButton}>Close</button>
            <h2>{selectedCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                />
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    required
                />
                <button type="submit" className={styles.submitButton}>Submit</button>
            </form>
        </div>
    );
};

export default CustomerFormDrawer;