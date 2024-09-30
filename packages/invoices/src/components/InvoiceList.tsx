import React, { useState } from 'react';
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
    const [searchQuery, setSearchQuery] = useState(''); // State to manage search input
    const [currentPage, setCurrentPage] = useState(1);  // State to manage current page
    const invoicesPerPage = 5; // Set the number of invoices per page

    const handleStatusChange = (id: string, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value as 'pending' | 'processing' | 'delivered' | 'failed';
        onUpdateStatus(id, newStatus);
    };

    // Filter invoices based on the search query
    const filteredInvoices = invoices.filter((invoice) =>
        invoice.customer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const indexOfLastInvoice = currentPage * invoicesPerPage;
    const indexOfFirstInvoice = indexOfLastInvoice - invoicesPerPage;
    const currentInvoices = filteredInvoices.slice(indexOfFirstInvoice, indexOfLastInvoice);
    const totalPages = Math.ceil(filteredInvoices.length / invoicesPerPage);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    return (
        <div className={styles.invoiceList}>
            <h2>Invoice List</h2>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search by customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
            />

            {filteredInvoices.length === 0 ? (
                <p className={styles.noInvoices}>No invoices found.</p>
            ) : (
                <>
                    <table className={styles.invoiceTable}>
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
                            {currentInvoices.map((invoice) => (
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

                    {/* Pagination */}
                    {totalPages > 1 && (
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
                    )}
                </>
            )}
        </div>
    );
};

export default InvoiceList;
