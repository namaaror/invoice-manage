import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InvoiceItem {
    product: string;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

export interface Invoice {
    id: string;
    customer: string;
    items: InvoiceItem[];
    totalAmount: number;
    date: string;
    status: 'pending' | 'processing' | 'delivered' | 'failed';
}

interface InvoiceState {
    invoices: Invoice[];
    selectedInvoice: Invoice | null;
}

const initialState: InvoiceState = {
    invoices: [],
    selectedInvoice: null,
};

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {
        addInvoice: (state, action: PayloadAction<Invoice>) => {
            state.invoices.push(action.payload);
            localStorage.setItem('invoices', JSON.stringify(state.invoices));
        },

        updateInvoiceStatus: (state, action: PayloadAction<{ id: string; status: 'pending' | 'processing' | 'delivered' | 'failed' }>) => {
            const { id, status } = action.payload;
            const invoice = state.invoices.find((invoice) => invoice.id === id);
            if (invoice) {
                invoice.status = status;
                localStorage.setItem('invoices', JSON.stringify(state.invoices));
            }
        },

        setSelectedInvoice: (state, action: PayloadAction<Invoice | null>) => {
            state.selectedInvoice = action.payload;
        },

        deleteInvoice: (state, action: PayloadAction<string>) => {
            state.invoices = state.invoices.filter((invoice) => invoice.id !== action.payload);
            localStorage.setItem('invoices', JSON.stringify(state.invoices));
        },

        loadInvoices: (state) => {
            try {
                const storedInvoices = localStorage.getItem('invoices');
                if (storedInvoices) {
                    state.invoices = JSON.parse(storedInvoices);
                }
            } catch (err) {
                console.error("Error loading invoices from localStorage", err);
            }
        },

        updateInvoice: (state, action: PayloadAction<Invoice>) => {
            const index = state.invoices.findIndex((invoice) => invoice.id === action.payload.id);
            if (index !== -1) {
                state.invoices[index] = action.payload;
                localStorage.setItem('invoices', JSON.stringify(state.invoices));
            }
        },
    },
});

export const {
    addInvoice,
    updateInvoiceStatus,
    deleteInvoice,
    loadInvoices,
    updateInvoice,
    setSelectedInvoice,
} = invoiceSlice.actions;

export default invoiceSlice.reducer;