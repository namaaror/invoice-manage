import React, { useState, useEffect } from 'react';
import { Invoice, InvoiceItem } from '../store/invoiceSlice';
import styles from './InvoiceForm.module.scss';
import CustomerFormDrawer from '../../../customers/src/components/CustomerFormDrawer';
import ProductFormDrawer from '../../../products/src/components/ProductFormDrawer'; // Import the ProductFormDrawer

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
}

interface Product {
    id: string;
    name: string;
    price: number;
}

interface InvoiceFormProps {
    onSubmit: (invoice: Invoice) => void;
    selectedInvoice: Invoice | null; // Invoice to edit, or null for a new invoice
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onSubmit, selectedInvoice }) => {
    const [customer, setCustomer] = useState('');
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [date, setDate] = useState('');
    const [status, setStatus] = useState<'pending' | 'processing' | 'delivered' | 'failed'>('pending');
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [isCustomerDrawerOpen, setCustomerDrawerOpen] = useState(false);
    const [isProductDrawerOpen, setProductDrawerOpen] = useState(false);

    useEffect(() => {
        const storedCustomers = localStorage.getItem('customers');
        const storedProducts = localStorage.getItem('products');

        if (storedCustomers) {
            setCustomers(JSON.parse(storedCustomers));
        }

        if (storedProducts) {
            setProducts(JSON.parse(storedProducts));
        }
    }, []);

    useEffect(() => {
        if (selectedInvoice) {
            setCustomer(selectedInvoice.customer);
            setItems(selectedInvoice.items);
            setTotalAmount(selectedInvoice.totalAmount);
            setDate(selectedInvoice.date);
            setStatus(selectedInvoice.status);
        } else {
            setCustomer('');
            setItems([]);
            setTotalAmount(0);
            setDate('');
            setStatus('pending');
        }
    }, [selectedInvoice]);

    const addItem = () => {
        setItems([...items, { product: '', description: '', quantity: 1, rate: 0, amount: 0 }]);
    };

    const removeItem = (index: number) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
        calculateTotal(updatedItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const invoice: Invoice = {
            id: selectedInvoice ? selectedInvoice.id : Date.now().toString(),
            customer,
            items,
            totalAmount,
            date,
            status,
        };

        onSubmit(invoice);

        // Clear the form after submission
        setCustomer('');
        setItems([]);
        setTotalAmount(0);
        setDate('');
        setStatus('pending');
    };

    const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number) => {
        const updatedItems = items.map((item, i) =>
            i === index ? { ...item, [field]: value, amount: item.quantity * item.rate } : item
        );
        setItems(updatedItems);
        calculateTotal(updatedItems);
    };

    const handleProductChange = (index: number, productName: string) => {
        const selectedProduct = products.find(prod => prod.name === productName);
        if (selectedProduct) {
            const updatedItems = items.map((item, i) =>
                i === index
                    ? { ...item, product: selectedProduct.name, rate: selectedProduct.price, amount: item.quantity * selectedProduct.price }
                    : item
            );
            setItems(updatedItems);
            calculateTotal(updatedItems);
        }
    };

    const handleQuantityChange = (index: number, quantity: number) => {
        const updatedItems = items.map((item, i) =>
            i === index ? { ...item, quantity, amount: quantity * item.rate } : item
        );
        setItems(updatedItems);
        calculateTotal(updatedItems);
    };

    const calculateTotal = (updatedItems: InvoiceItem[]) => {
        const total = updatedItems.reduce((sum, item) => sum + item.amount, 0);
        setTotalAmount(total);
    };

    return (
        <>
            <form className={styles.invoiceForm} onSubmit={handleSubmit}>
                <h2>{selectedInvoice ? 'Edit Invoice' : 'New Invoice'}</h2>

                <label>
                    Customer Name:
                    <select
                        value={customer}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === 'addNew') {
                                setCustomerDrawerOpen(true);
                            } else {
                                setCustomer(value);
                            }
                        }}
                        required
                    >
                        <option value="" disabled>Select a customer</option>
                        {customers.map((cust) => (
                            <option key={cust.id} value={cust.name}>
                                {cust.name}
                            </option>
                        ))}
                        <option value="addNew">
                            Add new +
                        </option>
                    </select>
                </label>

                <div className={styles.itemsSection}>
                    <h3>Invoice Items</h3>
                    {items.map((item, index) => (
                        <div className={styles.itemInputRow} key={index}>
                            <select
                                value={item.product}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === 'addNew') {
                                        setProductDrawerOpen(true);
                                    } else {
                                        handleProductChange(index, value);
                                    }
                                }}
                                required
                            >
                                <option value="" disabled>Select a product</option>
                                {products.map((prod) => (
                                    <option key={prod.id} value={prod.name}>
                                        {prod.name}
                                    </option>
                                ))}
                                <option value="addNew">Add new +</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(index, Number(e.target.value))}
                            />
                            <input
                                type="number"
                                placeholder="Rate"
                                value={item.rate}
                                disabled
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                value={item.amount}
                                disabled
                            />
                            <button
                                type="button"
                                className={styles.removeItemButton}
                                onClick={() => removeItem(index)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        className={styles.addItemButton}
                        onClick={addItem}
                    >
                        Add Item
                    </button>
                </div>

                <label>
                    Total Amount:
                    <input
                        type="number"
                        value={totalAmount}
                        disabled
                    />
                </label>

                <label>
                    Status:
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'pending' | 'processing' | 'delivered' | 'failed')}
                    >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="delivered">Delivered</option>
                        <option value="failed">Failed</option>
                    </select>
                </label>

                <button type="submit">{selectedInvoice ? 'Update Invoice' : 'Create Invoice'}</button>
            </form>

            {/* Reuse CustomerFormDrawer */}
            <CustomerFormDrawer
                isOpen={isCustomerDrawerOpen}
                onClose={() => setCustomerDrawerOpen(false)}
                onAddCustomer={(newCustomer) => {
                    const updatedCustomers = [...customers, newCustomer];
                    setCustomers(updatedCustomers);
                    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
                    setCustomer(newCustomer.name);
                }}
            />

            {/* Reuse ProductFormDrawer */}
            <ProductFormDrawer
                isOpen={isProductDrawerOpen}
                onClose={() => setProductDrawerOpen(false)}
                onAddProduct={(newProduct) => {
                    const updatedProducts = [...products, newProduct];
                    setProducts(updatedProducts);
                    localStorage.setItem('products', JSON.stringify(updatedProducts));
                }}
            />
        </>
    );
};

export default InvoiceForm;