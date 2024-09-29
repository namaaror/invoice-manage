import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface CustomerState {
    customers: Customer[];
    selectedCustomer: Customer | null;
}

const initialState: CustomerState = {
    customers: [],
    selectedCustomer: null,
};

// Helper function to get customers from localStorage
const loadCustomersFromLocalStorage = (): Customer[] => {
    const storedCustomers = localStorage.getItem('customers');
    return storedCustomers ? JSON.parse(storedCustomers) : [];
};

// Helper function to save customers to localStorage
const saveCustomersToLocalStorage = (customers: Customer[]) => {
    localStorage.setItem('customers', JSON.stringify(customers));
};

const customerSlice = createSlice({
    name: 'customer',
    initialState,
    reducers: {
        // Load customers from localStorage
        loadCustomers(state) {
            state.customers = loadCustomersFromLocalStorage();
        },
        // Add a new customer and update localStorage
        addCustomer(state, action: PayloadAction<Customer>) {
            const updatedCustomers = [...state.customers, action.payload];
            state.customers = updatedCustomers;
            saveCustomersToLocalStorage(updatedCustomers); // Save updated customers to localStorage
        },
        // Update an existing customer and update localStorage
        updateCustomer(state, action: PayloadAction<Customer>) {
            const updatedCustomer = action.payload;
            const updatedCustomers = state.customers.map((customer) =>
                customer.id === updatedCustomer.id ? updatedCustomer : customer
            );
            state.customers = updatedCustomers;
            saveCustomersToLocalStorage(updatedCustomers); // Save updated customers to localStorage
        },
        // Delete a customer and update localStorage
        deleteCustomer(state, action: PayloadAction<string>) {
            const updatedCustomers = state.customers.filter((customer) => customer.id !== action.payload);
            state.customers = updatedCustomers;
            saveCustomersToLocalStorage(updatedCustomers); // Save updated customers to localStorage
        },
        setSelectedCustomer(state, action: PayloadAction<Customer | null>) {
            state.selectedCustomer = action.payload;
        },
    },
});

export const { loadCustomers, addCustomer, updateCustomer, deleteCustomer, setSelectedCustomer } = customerSlice.actions;
export default customerSlice.reducer;