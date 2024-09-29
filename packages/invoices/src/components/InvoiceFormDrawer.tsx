import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@invoice-manager/state';
import { addInvoice, updateInvoice, setSelectedInvoice } from '../store/invoiceSlice';
import styles from './InvoiceFormDrawer.module.scss';

interface InvoiceFormDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const InvoiceFormDrawer: React.FC<InvoiceFormDrawerProps> = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const selectedInvoice = useSelector((state: RootState) => state.invoice.selectedInvoice);

    const [formData, setFormData] = useState({
        id: '',
        customer: '',
        totalAmount: 0,
        date: '',
    });

    // Load the selected invoice data into the form when editing
    useEffect(() => {
        if (selectedInvoice) {
            setFormData({
                id: selectedInvoice.id,
                customer: selectedInvoice.customer,
                totalAmount: selectedInvoice.totalAmount,
                date: selectedInvoice.date,
            });
        } else {
            setFormData({
                id: '',
                customer: '',
                totalAmount: 0,
                date: '',
            });
        }
    }, [selectedInvoice]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'totalAmount' ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.id) {
            dispatch(updateInvoice(formData));  // Update existing invoice
        } else {
            dispatch(addInvoice({ ...formData, id: Date.now().toString() }));  // Add new invoice
        }
        onClose();
        dispatch(setSelectedInvoice(null));  // Reset the selected invoice
    };

    if (!isOpen) return null;

    return (
        <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
            <button onClick={onClose} className={styles.closeButton}>Close</button>
            <h2>{selectedInvoice ? 'Edit Invoice' : 'Add New Invoice'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="customer"
                    value={formData.customer}
                    onChange={handleChange}
                    placeholder="Customer Name"
                    required
                />
                <input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    placeholder="Total Amount"
                    required
                />
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className={styles.submitButton}>
                    {selectedInvoice ? 'Save Changes' : 'Add Invoice'}
                </button>
            </form>
        </div>
    );
};

export default InvoiceFormDrawer;