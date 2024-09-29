import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCustomer } from '../store/customerSlice';
import styles from './AddCustomer.module.scss';

const AddCustomer: React.FC = () => {
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const handleSubmit = () => {
        const newCustomer = {
            id: Date.now().toString(),  // Generate a unique ID
            name,
            email,
            phone
        };

        dispatch(addCustomer(newCustomer));
    };

    return (
        <div className={styles.addCustomerForm}>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <button onClick={handleSubmit} className={styles.submitButton}>
                Add Customer
            </button>
        </div>
    );
};

export default AddCustomer;