import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@invoice-manager/state';
import {
    addInvoice,
    updateInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    loadInvoices,
    setSelectedInvoice,
    Invoice
} from '../store/invoiceSlice'; // Make sure to import `updateInvoice`
import InvoiceList from '../components/InvoiceList';
import InvoiceForm from '../components/InvoiceForm';
import styles from './InvoicesPage.module.scss'; // Import the updated styles

export const InvoicesPage: React.FC = () => {
    const dispatch = useDispatch();
    const invoices = useSelector((state: RootState) => state.invoice.invoices);
    const selectedInvoice = useSelector((state: RootState) => state.invoice.selectedInvoice);

    useEffect(() => {
        dispatch(loadInvoices());
    }, [dispatch]);

    // Function to handle both adding a new invoice and updating an existing one
    const handleAddInvoice = (invoice: Invoice) => {
        if (invoice.id && invoices.some(inv => inv.id === invoice.id)) {
            // If the invoice exists, update it
            dispatch(updateInvoice(invoice));
        } else {
            // If the invoice is new, add it
            dispatch(addInvoice(invoice));
        }
    };

    const handleUpdateStatus = (id: string, status: 'pending' | 'processing' | 'delivered' | 'failed') => {
        dispatch(updateInvoiceStatus({ id, status }));
    };

    const handleSelectInvoice = (invoice: Invoice) => {
        dispatch(setSelectedInvoice(invoice));
    };

    const handleDeleteInvoice = (id: string) => {
        dispatch(deleteInvoice(id));
    };

    return (
        <>
            <div className={styles.pageContainer}>
                <div className={styles.formSection}>
                    <InvoiceForm onSubmit={handleAddInvoice} selectedInvoice={selectedInvoice} />
                </div>
                <div className={styles.listSection}>
                    <InvoiceList
                        invoices={invoices}
                        onUpdateStatus={handleUpdateStatus}
                        onSelectInvoice={handleSelectInvoice}
                        onDelete={handleDeleteInvoice}
                    />
                </div>
            </div>
        </>
    );
};