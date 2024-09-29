import React from 'react';
import { Invoice } from '../store/invoiceSlice';
import styles from './InvoiceList.module.scss'; // Import styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';  // Import the icons

interface InvoiceListProps {
    invoices: Invoice[];
    onUpdateStatus: (id: string, status: 'pending' | 'processing' | 'delivered' | 'failed') => void;
    onSelectInvoice: (invoice: Invoice) => void;
    onDelete: (id: string) => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onUpdateStatus, onSelectInvoice, onDelete }) => {
    const handleStatusChange = (id: string, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value as 'pending' | 'processing' | 'delivered' | 'failed';
        onUpdateStatus(id, newStatus);
    };

    return (
        <div className={styles.invoiceList}>
            <h2>Invoice List</h2>
            {invoices.length === 0 ? (
                <p className={styles.noInvoices}>No invoices found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Total Amount</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice.id}>
                                <td>{invoice.customer}</td>
                                <td>{invoice.date}</td>
                                <td>₹{invoice.totalAmount}</td>
                                <td>
                                    <select
                                        className={styles.invoiceStatus}
                                        value={invoice.status}
                                        onChange={(e) => handleStatusChange(invoice.id, e)}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                </td>
                                <td>
                                    <button onClick={() => onSelectInvoice(invoice)}>
                                        <FontAwesomeIcon icon={faEdit} /> {/* Pencil Icon */}
                                    </button>
                                    <button
                                        className={styles.deleteButton}
                                        onClick={() => onDelete(invoice.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} /> {/* Trash Icon */}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default InvoiceList;